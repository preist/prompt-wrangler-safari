import { useIssues } from '@popup/hooks/useIssues';
import { ScreenContainer } from '@popup/components/ScreenContainer/ScreenContainer';
import { ScreenEmptyState } from '@popup/components/ScreenEmptyState/ScreenEmptyState';
import { ScreenPanel } from '@popup/components/ScreenPanel/ScreenPanel';
import { HistoryItem } from '@popup/components/HistoryItem/HistoryItem';
import { IssueIcon } from '@popup/components/IssueIcon/IssueIcon';
import { formatTimestamp } from '@popup/utils/issueHelpers';

export function HistoryScreen() {
  const { history, deleteFromHistory, clearAllHistory } = useIssues();

  if (history.length === 0) {
    return (
      <ScreenContainer>
        <ScreenEmptyState title="No History Yet" description="Detected issues will appear here" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenPanel
        title="History"
        action={{
          label: 'Clear all',
          onClick: () => {
            void clearAllHistory();
          },
        }}
      >
        {history.map((issue) => (
          <HistoryItem
            key={issue.id}
            icon={<IssueIcon type={issue.type} />}
            value={issue.value}
            timestamp={formatTimestamp(issue.timestamp)}
            onDelete={() => {
              void deleteFromHistory(issue.id);
            }}
          />
        ))}
      </ScreenPanel>
    </ScreenContainer>
  );
}
