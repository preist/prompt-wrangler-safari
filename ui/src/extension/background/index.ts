import type { Message } from '@shared/messages';

interface StoredIssue {
  id: string;
  type: string;
  value: string;
  timestamp: number;
  batchId: string;
}

async function updateIcon() {
  try {
    const result = await chrome.storage.local.get(['settings.protectedMode']);
    const protectedMode = result['settings.protectedMode'] as boolean | undefined;

    const iconPath = {
      16: protectedMode === false ? 'icons/icon-16-off.png' : 'icons/icon-16.png',
      32: protectedMode === false ? 'icons/icon-32-off.png' : 'icons/icon-32.png',
    };

    await chrome.action.setIcon({ path: iconPath });
    console.log('[Prompt Wrangler] Icon updated:', iconPath);
  } catch (error) {
    console.error('[Prompt Wrangler] Failed to update icon:', error);
  }
}

// Listen for storage changes to update icon
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes['settings.protectedMode']) {
    void updateIcon();
  }
});

// Update icon on extension startup
void updateIcon();

chrome.runtime.onMessage.addListener(
  (message: Message, _sender, _sendResponse: (response?: unknown) => void) => {
    if (message.type === 'ISSUES_DETECTED') {
      console.log('[Prompt Wrangler] Background received issues:', message.issues);

      void (async () => {
        try {
          // Create batch ID
          const now = Date.now();
          const random = Math.random().toString(36).substring(2, 9);
          const batchId = `batch-${now.toString()}-${random}`;

          // Add batchId to issues
          const issuesWithBatch: StoredIssue[] = message.issues.map((issue) => ({
            ...issue,
            batchId,
          }));

          // Get existing history
          const result = await chrome.storage.local.get(['issues.history']);
          const existingHistory = (result['issues.history'] as StoredIssue[] | undefined) ?? [];

          // Prepend new issues
          const updatedHistory = [...issuesWithBatch, ...existingHistory];

          // Store back
          await chrome.storage.local.set({
            'issues.latestBatch': batchId,
            'issues.history': updatedHistory,
          });

          console.log('[Prompt Wrangler] Stored issues in chrome.storage');

          // Update badge with issue count
          const count = message.issues.length;
          await chrome.action.setBadgeText({ text: count.toString() });
          await chrome.action.setBadgeBackgroundColor({ color: '#DC2626' });

          // Show OS notification
          const itemText = count === 1 ? 'item' : 'items';
          try {
            await chrome.notifications.create('prompt-wrangler-alert', {
              type: 'basic',
              iconUrl: 'icons/icon-128.png',
              title: 'Sensitive Data Detected',
              message: `${count.toString()} ${itemText} detected and anonymized`,
              priority: 2,
            });
            console.log('[Prompt Wrangler] Notification created successfully');
          } catch (notificationError) {
            console.error('[Prompt Wrangler] Failed to create notification:', notificationError);
          }

          // Try to notify popup if it's open (don't wait for response)
          chrome.runtime.sendMessage(
            {
              type: 'NEW_ISSUES',
              issues: message.issues,
            },
            () => {
              // Ignore errors if popup isn't open
              if (chrome.runtime.lastError) {
                console.log('[Prompt Wrangler] Popup not open, issues stored for later');
              }
            }
          );
        } catch (error) {
          console.error('[Prompt Wrangler] Failed to store issues:', error);
        }
      })();

      return false;
    }

    return false;
  }
);

// Handle notification clicks - open the popup
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'prompt-wrangler-alert') {
    void chrome.action.openPopup();
    console.log('[Prompt Wrangler] Notification clicked, opening popup');
  }
});
