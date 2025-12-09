import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { DetectedIssue } from '@lib/detectors/types';
import { IssueListItem } from './IssueListItem';

describe('IssueListItem', () => {
  const mockIssue: DetectedIssue = {
    id: '123',
    type: 'email',
    value: 'test@example.com',
    timestamp: Date.now(),
  };

  it('renders issue value', () => {
    const onDismiss = vi.fn();
    render(<IssueListItem issue={mockIssue} onDismiss={onDismiss} />);

    expect(screen.getByText('test@example.com')).toBeTruthy();
  });

  it('calls onDismiss with 24h when "Allow for 24h" is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<IssueListItem issue={mockIssue} onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: /24h/i }));

    expect(onDismiss).toHaveBeenCalledWith('123', '24h');
  });

  it('calls onDismiss with forever when "Allow forever" is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<IssueListItem issue={mockIssue} onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button', { name: /forever/i }));

    expect(onDismiss).toHaveBeenCalledWith('123', 'forever');
  });
});
