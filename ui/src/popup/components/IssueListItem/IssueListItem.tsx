import type { DetectedIssue } from '@lib/detectors/types';
import { IssueIcon } from '@popup/components/IssueIcon/IssueIcon';
import { formatTimestamp } from '@popup/utils/issueHelpers';

interface IssueListItemProps {
  issue: DetectedIssue;
  onDismiss: (id: string, duration: '24h' | 'forever') => void;
}

export function IssueListItem(props: IssueListItemProps) {
  const { issue, onDismiss } = props;

  return (
    <div className="issue-list-item">
      <IssueIcon type={issue.type} />
      <div className="issue-list-item__content">
        <div className="issue-list-item__value">{issue.value}</div>
        <div className="issue-list-item__timestamp">{formatTimestamp(issue.timestamp)}</div>
        <div className="issue-list-item__actions">
          <button
            type="button"
            className="issue-list-item__dismiss-button"
            onClick={() => {
              onDismiss(issue.id, '24h');
            }}
          >
            Allow for 24h
          </button>
          <button
            type="button"
            className="issue-list-item__dismiss-button issue-list-item__dismiss-button--forever"
            onClick={() => {
              onDismiss(issue.id, 'forever');
            }}
          >
            Allow forever
          </button>
        </div>
      </div>
    </div>
  );
}
