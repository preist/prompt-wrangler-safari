import type { DetectedIssue, DismissedItem } from '@lib/detectors/types';

export interface StorageSchema {
  detected_issues: DetectedIssue[];
  dismissed_items: DismissedItem[];
}

export type StorageKey = keyof StorageSchema;
