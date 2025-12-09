import { useContext } from 'react';
import { IssuesContext } from '@popup/state/IssuesContext';

export function useIssues() {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within IssuesProvider');
  }
  return context;
}
