import type { DetectedIssue, DismissedItem } from '@lib/detectors/types';

const STORAGE_KEYS = {
  ISSUES: 'detected_issues',
  DISMISSED: 'dismissed_items',
} as const;

export async function saveData(key: string, value: unknown): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

export async function loadData<T>(key: string): Promise<T | undefined> {
  const result = await chrome.storage.local.get(key);
  return result[key] as T | undefined;
}

export async function getDetectedIssues(): Promise<DetectedIssue[]> {
  const issues = await loadData<DetectedIssue[]>(STORAGE_KEYS.ISSUES);
  return issues ?? [];
}

export async function addDetectedIssues(newIssues: DetectedIssue[]): Promise<void> {
  const existingIssues = await getDetectedIssues();
  const allIssues = [...existingIssues, ...newIssues];
  await saveData(STORAGE_KEYS.ISSUES, allIssues);
}

export async function clearDetectedIssues(): Promise<void> {
  await saveData(STORAGE_KEYS.ISSUES, []);
}

export async function getDismissedItems(): Promise<DismissedItem[]> {
  const items = await loadData<DismissedItem[]>(STORAGE_KEYS.DISMISSED);
  return items ?? [];
}

export async function addDismissedItem(value: string, type: DetectedIssue['type']): Promise<void> {
  const items = await getDismissedItems();

  const dismissedAt = Date.now();
  const dismissedUntil = dismissedAt + 24 * 60 * 60 * 1000;

  const newItem: DismissedItem = {
    value,
    type,
    dismissedAt,
    dismissedUntil,
  };

  const filteredItems = items.filter(
    (item) => item.value.toLowerCase() !== value.toLowerCase() || item.type !== type
  );

  await saveData(STORAGE_KEYS.DISMISSED, [...filteredItems, newItem]);
}

export async function removeDismissedItem(
  value: string,
  type: DetectedIssue['type']
): Promise<void> {
  const items = await getDismissedItems();
  const filteredItems = items.filter(
    (item) => item.value.toLowerCase() !== value.toLowerCase() || item.type !== type
  );
  await saveData(STORAGE_KEYS.DISMISSED, filteredItems);
}

export async function cleanupExpiredDismissals(): Promise<void> {
  const items = await getDismissedItems();
  const now = Date.now();
  const activeItems = items.filter((item) => now < item.dismissedUntil);
  await saveData(STORAGE_KEYS.DISMISSED, activeItems);
}
