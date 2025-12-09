import type { DetectedIssue } from '@lib/detectors/types';

export interface IssuesDetectedMessage {
  type: 'ISSUES_DETECTED';
  issues: DetectedIssue[];
}

export interface IssuesStoredMessage {
  type: 'ISSUES_STORED';
  success: boolean;
}

export type Message = IssuesDetectedMessage | IssuesStoredMessage;
