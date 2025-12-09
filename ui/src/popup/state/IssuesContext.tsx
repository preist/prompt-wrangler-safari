import { createContext, useState, useEffect, type ReactNode } from 'react';
import { addToAllowlist, cleanExpiredAllowlistItems } from '@lib/storage/allowlist';

export type DismissDuration = '24h' | 'forever';

export interface Issue {
  id: string;
  type: 'email' | 'phone' | 'creditCard' | 'ssn';
  value: string;
  timestamp: number;
  batchId: string;
  dismissed?: {
    until: number | 'forever';
  };
}

export interface IssuesContextValue {
  latestIssues: Issue[];
  history: Issue[];
  dismissIssue: (id: string, duration: DismissDuration) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearDismissed: () => void;
  markIssuesAsViewed: () => Promise<void>;
  clearAllHistory: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const IssuesContext = createContext<IssuesContextValue | undefined>(undefined);

interface IssuesProviderProps {
  children: ReactNode;
}

export function IssuesProvider(props: IssuesProviderProps) {
  const { children } = props;

  const [latestBatchId, setLatestBatchId] = useState<string | null>(null);
  const [history, setHistory] = useState<Issue[]>([]);

  // Load issues from chrome.storage on mount
  useEffect(() => {
    const loadIssues = async () => {
      const result = await chrome.storage.local.get(['issues.latestBatch', 'issues.history']);
      console.log('[Prompt Wrangler][popup] load issues on mount', result);

      const latest = result['issues.latestBatch'] as string | null | undefined;
      const storedHistory = result['issues.history'] as Issue[] | undefined;
      if (latest) {
        setLatestBatchId(latest);
      }
      if (storedHistory) {
        setHistory(storedHistory);
      }
    };

    void loadIssues();
  }, []);

  // Listen for new issues notification (storage already updated by background worker)
  useEffect(() => {
    const handleMessage = (
      message: { type: string },
      _sender: chrome.runtime.MessageSender,
      _sendResponse: (response?: unknown) => void
    ) => {
      console.log('[Prompt Wrangler][popup] onMessage', message.type, message);
      if (message.type === 'NEW_ISSUES') {
        // Reload from storage since background worker already saved
        void chrome.storage.local.get(['issues.latestBatch', 'issues.history']).then((result) => {
          console.log('[Prompt Wrangler][popup] reload issues after NEW_ISSUES', result);
          const latest = (result['issues.latestBatch'] as string | null | undefined) ?? null;
          const storedHistory = result['issues.history'] as Issue[] | undefined;
          if (latest) {
            setLatestBatchId(latest);
          }
          if (storedHistory) {
            setHistory(storedHistory);
          }
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Listen for direct NEW_ISSUES payloads (Safari may not share storage)
  useEffect(() => {
    const handleDirectIssues = (
      message: { type: string; batchId?: string; issues?: Issue[] },
      _sender: chrome.runtime.MessageSender,
      _sendResponse: (response?: unknown) => void
    ) => {
      if (message.type === 'NEW_ISSUES' && message.issues?.length) {
        console.log('[Prompt Wrangler][popup] direct NEW_ISSUES', message);
        const incomingIssues = message.issues;
        const latestId = message.batchId ?? incomingIssues[0]?.batchId ?? null;
        const updatedHistory = [...incomingIssues, ...history];
        setHistory(updatedHistory);
        setLatestBatchId(latestId);
      }
    };

    chrome.runtime.onMessage.addListener(handleDirectIssues);
    return () => {
      chrome.runtime.onMessage.removeListener(handleDirectIssues);
    };
  }, [history]);

  // Clean up expired 24h dismissals
  const clearDismissed = () => {
    const now = Date.now();
    const filtered = history.filter((issue) => {
      if (!issue.dismissed) return true;
      if (issue.dismissed.until === 'forever') return false;
      return issue.dismissed.until > now;
    });

    setHistory(filtered);
    void chrome.storage.local.set({ 'issues.history': filtered });
    void cleanExpiredAllowlistItems();
  };

  const dismissIssue = async (id: string, duration: DismissDuration) => {
    const issue = history.find((i) => i.id === id);
    if (!issue) return;

    await addToAllowlist(issue.value, issue.type, duration);

    window.dispatchEvent(new CustomEvent('allowlist-item-added'));

    const until: number | 'forever' =
      duration === 'forever' ? 'forever' : Date.now() + 24 * 60 * 60 * 1000;

    const updated: Issue[] = history.map((i) => (i.id === id ? { ...i, dismissed: { until } } : i));

    setHistory(updated);
    await chrome.storage.local.set({ 'issues.history': updated });
  };

  const deleteFromHistory = async (id: string) => {
    const filtered = history.filter((issue) => issue.id !== id);
    setHistory(filtered);
    await chrome.storage.local.set({ 'issues.history': filtered });
  };

  const markIssuesAsViewed = async () => {
    await chrome.storage.local.set({ 'issues.latestBatch': null });
    setLatestBatchId(null);
  };

  const clearAllHistory = async () => {
    setHistory([]);
    setLatestBatchId(null);
    await chrome.storage.local.set({
      'issues.history': [],
      'issues.latestBatch': null,
    });
  };

  // Compute latest issues from history based on latestBatchId
  const latestIssues = latestBatchId
    ? history.filter((issue) => issue.batchId === latestBatchId)
    : [];

  return (
    <IssuesContext.Provider
      value={{
        latestIssues,
        history,
        dismissIssue,
        deleteFromHistory,
        clearDismissed,
        markIssuesAsViewed,
        clearAllHistory,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
}
