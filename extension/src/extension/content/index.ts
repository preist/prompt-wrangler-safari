import type { DetectedIssue } from '@lib/detectors/types';
import type { IssuesDetectedMessage } from '@shared/messages';
import type { AllowlistItem } from '@lib/storage/allowlist';

console.log('[Prompt Wrangler][content] loaded (isolated world)');

function makeBatch(issues: DetectedIssue[]): {
  batchId: string;
  issuesWithBatch: (DetectedIssue & { batchId: string })[];
} {
  const now = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const batchId = `batch-${now.toString()}-${random}`;
  const issuesWithBatch = issues.map((issue) => ({ ...issue, batchId }));
  return { batchId, issuesWithBatch };
}

void (async () => {
  try {
    const result = await chrome.storage.local.get([
      'settings.dataTypes',
      'settings.protectedMode',
      'allowlist',
    ]);

    if (result['settings.dataTypes']) {
      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-data-types-change', {
          detail: { dataTypes: result['settings.dataTypes'] },
        })
      );
      console.log('[Prompt Wrangler] Sent initial data types to injected script');
    }

    if (result['settings.protectedMode'] !== undefined) {
      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-mode-change', {
          detail: { enabled: result['settings.protectedMode'] },
        })
      );
      console.log('[Prompt Wrangler] Sent initial protected mode to injected script');
    }

    if (result.allowlist) {
      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-allowlist-change', {
          detail: { allowlist: result.allowlist as AllowlistItem[] },
        })
      );
      console.log('[Prompt Wrangler] Sent initial allowlist to injected script');
    }
  } catch (error) {
    console.error('[Prompt Wrangler] Failed to load initial settings:', error);
  }
})();

// Listen for issues detected by the injected script
window.addEventListener('prompt-wrangler-issues', (event: Event) => {
  const customEvent = event as CustomEvent<{ issues: DetectedIssue[] }>;
  const { issues } = customEvent.detail;

  console.log('[Prompt Wrangler][content] issues event received from injected:', issues);

  void (async () => {
    const { batchId, issuesWithBatch } = makeBatch(issues);

    // Always persist locally so popup can read even if background isn't alive
    try {
      const existing = await chrome.storage.local.get(['issues.history']);
      const history =
        (existing['issues.history'] as (DetectedIssue & { batchId: string })[] | undefined) ?? [];
      const updatedHistory = [...issuesWithBatch, ...history];
      await chrome.storage.local.set({
        'issues.latestBatch': batchId,
        'issues.history': updatedHistory,
      });
      console.log('[Prompt Wrangler][content] stored issues in storage', {
        batchId,
        count: issuesWithBatch.length,
      });
      // Notify popup if open
      chrome.runtime
        .sendMessage({ type: 'NEW_ISSUES', issues: issuesWithBatch })
        .catch((err: unknown) => {
          console.warn('[Prompt Wrangler][content] popup notify failed', err);
        });
    } catch (storageError) {
      console.error('[Prompt Wrangler][content] failed to store issues locally', storageError);
    }

    // Always notify popup directly with batch info for Safari
    chrome.runtime
      .sendMessage({ type: 'NEW_ISSUES', batchId, issues: issuesWithBatch })
      .catch((err: unknown) => {
        console.warn('[Prompt Wrangler][content] direct NEW_ISSUES notify failed', err);
      });

    // Try to notify background so badges/notifications work if supported
    try {
      const message: IssuesDetectedMessage = {
        type: 'ISSUES_DETECTED',
        issues: issuesWithBatch,
      };
      await chrome.runtime.sendMessage(message);
      console.log('[Prompt Wrangler][content] sent issues to background');
    } catch (error) {
      console.error('[Prompt Wrangler][content] Error sending issues to background:', error);
    }
  })();
});

chrome.runtime.onMessage.addListener(
  (
    message: { type: string; enabled?: boolean; dataTypes?: Record<string, boolean> },
    _sender: chrome.runtime.MessageSender,
    _sendResponse: (response?: unknown) => void
  ) => {
    if (message.type === 'TOGGLE_PROTECTED_MODE') {
      console.log('[Prompt Wrangler] Protected mode toggled:', message.enabled);
      console.log('[Prompt Wrangler][content] forwarded protected mode toggle to injected');

      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-mode-change', {
          detail: { enabled: message.enabled },
        })
      );
    }

    if (message.type === 'UPDATE_DATA_TYPES') {
      console.log('[Prompt Wrangler] Data types updated:', message.dataTypes);
      console.log('[Prompt Wrangler][content] forwarded data types update to injected');

      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-data-types-change', {
          detail: { dataTypes: message.dataTypes },
        })
      );
    }
  }
);

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.allowlist) {
    const newAllowlist = changes.allowlist.newValue as AllowlistItem[] | undefined;
    window.dispatchEvent(
      new CustomEvent('prompt-wrangler-allowlist-change', {
        detail: { allowlist: newAllowlist ?? [] },
      })
    );
    console.log('[Prompt Wrangler][content] Allowlist changed, notified injected script');
  }
});
