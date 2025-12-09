import type { DetectedIssue } from '@lib/detectors/types';
import type { IssuesDetectedMessage } from '@shared/messages';
import type { AllowlistItem } from '@lib/storage/allowlist';

console.log('[Prompt Wrangler] Content script (isolated world) loaded');

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

  console.log('[Prompt Wrangler] Received issues from injected script:', issues);

  void (async () => {
    try {
      // Send to service worker - it will handle storage
      const message: IssuesDetectedMessage = {
        type: 'ISSUES_DETECTED',
        issues,
      };
      await chrome.runtime.sendMessage(message);
      console.log('[Prompt Wrangler] Sent issues to service worker');
    } catch (error) {
      console.error('[Prompt Wrangler] Error sending issues to service worker:', error);
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

      window.dispatchEvent(
        new CustomEvent('prompt-wrangler-mode-change', {
          detail: { enabled: message.enabled },
        })
      );
    }

    if (message.type === 'UPDATE_DATA_TYPES') {
      console.log('[Prompt Wrangler] Data types updated:', message.dataTypes);

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
    console.log('[Prompt Wrangler] Allowlist changed, notified injected script');
  }
});
