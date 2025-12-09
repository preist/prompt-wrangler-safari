import type { DetectedIssue, Detector } from './types';
import { PHONE_PATTERNS, PHONE_PLACEHOLDER, US_PHONE_PATTERN } from './patterns';

interface TextRange {
  start: number;
  end: number;
}

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function addMatch(
  issues: DetectedIssue[],
  consumedRanges: TextRange[],
  match: RegExpMatchArray
): void {
  if (!match[0] || match.index === undefined) return;

  const start = match.index;
  const end = start + match[0].length;
  const isConsumed = consumedRanges.some((range) => start < range.end && end > range.start);

  if (!isConsumed) {
    consumedRanges.push({ start, end });
    issues.push({
      id: generateId(),
      type: 'phone',
      value: match[0],
      timestamp: Date.now(),
    });
  }
}

function detect(text: string): DetectedIssue[] {
  const issues: DetectedIssue[] = [];
  const consumedRanges: TextRange[] = [];

  for (const pattern of PHONE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      addMatch(issues, consumedRanges, match);
    }
  }

  return issues.sort((a, b) => text.indexOf(a.value) - text.indexOf(b.value));
}

function anonymize(text: string, dismissed: Set<string>): string {
  let result = text;

  for (const pattern of PHONE_PATTERNS) {
    result = result.replace(pattern, (match) =>
      dismissed.has(match.toLowerCase()) ? match : PHONE_PLACEHOLDER
    );
  }

  return result;
}

export const phoneDetector: Detector = {
  type: 'phone',
  pattern: US_PHONE_PATTERN,
  placeholder: PHONE_PLACEHOLDER,
  detect,
  anonymize,
};
