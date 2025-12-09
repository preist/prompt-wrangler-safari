import { useEffect } from 'react';
import { useIssues } from '@popup/hooks/useIssues';
import { ScreenContainer } from '@popup/components/ScreenContainer/ScreenContainer';
import { ScreenEmptyState } from '@popup/components/ScreenEmptyState/ScreenEmptyState';
import { ScreenPanel } from '@popup/components/ScreenPanel/ScreenPanel';
import { IssueListItem } from '@popup/components/IssueListItem/IssueListItem';

export function IssuesFoundScreen() {
  const { latestIssues, dismissIssue, clearDismissed, markIssuesAsViewed } = useIssues();

  useEffect(() => {
    // Clear badge when viewing issues screen
    void chrome.action.setBadgeText({ text: '' });

    const interval = setInterval(() => {
      clearDismissed();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [clearDismissed]);

  const activeIssues = latestIssues.filter((issue) => !issue.dismissed);

  if (activeIssues.length === 0) {
    return (
      <ScreenContainer>
        <ScreenEmptyState
          title="No issues found"
          description="Tumbleweeds, your prompts are clean and secure"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenPanel
        title="Issues Found"
        action={{
          label: 'Clear all',
          onClick: () => {
            void markIssuesAsViewed();
          },
        }}
      >
        {activeIssues.map((issue) => (
          <IssueListItem key={issue.id} issue={issue} onDismiss={dismissIssue} />
        ))}
      </ScreenPanel>
    </ScreenContainer>
  );
}
