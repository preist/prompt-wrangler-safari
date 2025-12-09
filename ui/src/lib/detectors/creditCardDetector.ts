import type { Detector, DetectedIssue } from './types';
import { CREDIT_CARD_PATTERN, CREDIT_CARD_PLACEHOLDER } from './patterns';

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function detect(text: string): DetectedIssue[] {
  const matches = text.matchAll(CREDIT_CARD_PATTERN);
  const issues: DetectedIssue[] = [];

  for (const match of matches) {
    if (match[0]) {
      issues.push({
        id: generateId(),
        type: 'creditCard',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function anonymize(text: string, dismissed: Set<string>): string {
  return text.replace(CREDIT_CARD_PATTERN, (match) => {
    if (dismissed.has(match.toLowerCase())) {
      return match;
    }
    return CREDIT_CARD_PLACEHOLDER;
  });
}

export const creditCardDetector: Detector = {
  type: 'creditCard',
  pattern: CREDIT_CARD_PATTERN,
  placeholder: CREDIT_CARD_PLACEHOLDER,
  detect,
  anonymize,
};
