import type { Detector, DetectedIssue } from './types';
import { SSN_PATTERN, SSN_PLACEHOLDER } from './patterns';

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function detect(text: string): DetectedIssue[] {
  const matches = text.matchAll(SSN_PATTERN);
  const issues: DetectedIssue[] = [];

  for (const match of matches) {
    if (match[0]) {
      issues.push({
        id: generateId(),
        type: 'ssn',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function anonymize(text: string, dismissed: Set<string>): string {
  return text.replace(SSN_PATTERN, (match) => {
    if (dismissed.has(match.toLowerCase())) {
      return match;
    }
    return SSN_PLACEHOLDER;
  });
}

export const ssnDetector: Detector = {
  type: 'ssn',
  pattern: SSN_PATTERN,
  placeholder: SSN_PLACEHOLDER,
  detect,
  anonymize,
};
