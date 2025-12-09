export type PiiType = 'email' | 'phone' | 'ssn' | 'creditCard';

export interface DetectedIssue {
  id: string;
  type: PiiType;
  value: string;
  timestamp: number;
  context?: string;
}

export interface DismissedItem {
  value: string;
  type: PiiType;
  dismissedAt: number;
  dismissedUntil: number;
}

export interface DetectionResult {
  issues: DetectedIssue[];
  anonymizedText: string;
}

export interface Detector {
  type: PiiType;
  pattern: RegExp;
  placeholder: string;
  detect: (text: string) => DetectedIssue[];
  anonymize: (text: string, dismissed: Set<string>) => string;
}
