import type { Detector, DetectedIssue, DetectionResult, DismissedItem } from './detectors/types';
import type { AllowlistItem } from './storage/allowlist';
import { emailDetector } from './detectors/emailDetector';
import { phoneDetector } from './detectors/phoneDetector';

const DETECTORS: Detector[] = [emailDetector, phoneDetector];

function isDismissed(item: DismissedItem): boolean {
  return Date.now() < item.dismissedUntil;
}

function getDismissedSet(dismissedItems: DismissedItem[]): Set<string> {
  const dismissed = new Set<string>();

  for (const item of dismissedItems) {
    if (isDismissed(item)) {
      dismissed.add(item.value.toLowerCase());
    }
  }

  return dismissed;
}

function getAllowlistedSet(allowlist: AllowlistItem[]): Set<string> {
  const allowed = new Set<string>();
  const now = Date.now();

  for (const item of allowlist) {
    if (item.expiresAt === 'never' || item.expiresAt > now) {
      allowed.add(`${item.type}:${item.value.toLowerCase()}`);
    }
  }

  return allowed;
}

export function scanText(
  text: string,
  dismissedItems: DismissedItem[] = [],
  allowlist: AllowlistItem[] = []
): DetectionResult {
  const allIssues: DetectedIssue[] = [];
  const dismissedSet = getDismissedSet(dismissedItems);
  const allowlistedSet = getAllowlistedSet(allowlist);

  for (const detector of DETECTORS) {
    const issues = detector.detect(text);

    const nonDismissedIssues = issues.filter((issue) => {
      const isInDismissed = dismissedSet.has(issue.value.toLowerCase());
      const isInAllowlist = allowlistedSet.has(`${issue.type}:${issue.value.toLowerCase()}`);
      return !isInDismissed && !isInAllowlist;
    });

    allIssues.push(...nonDismissedIssues);
  }

  let anonymizedText = text;
  for (const detector of DETECTORS) {
    anonymizedText = detector.anonymize(anonymizedText, dismissedSet);
  }

  for (const item of allowlist) {
    if (item.expiresAt === 'never' || item.expiresAt > Date.now()) {
      const pattern = new RegExp(item.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      anonymizedText = anonymizedText.replace(pattern, (match) => match);
    }
  }

  return {
    issues: allIssues,
    anonymizedText,
  };
}

export function removeDuplicateIssues(issues: DetectedIssue[]): DetectedIssue[] {
  const seen = new Map<string, DetectedIssue>();

  for (const issue of issues) {
    const key = `${issue.type}:${issue.value.toLowerCase()}`;
    if (!seen.has(key)) {
      seen.set(key, issue);
    }
  }

  return Array.from(seen.values());
}
