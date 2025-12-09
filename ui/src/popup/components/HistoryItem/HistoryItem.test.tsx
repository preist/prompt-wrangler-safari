import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryItem } from './HistoryItem';

describe('HistoryItem', () => {
  it('renders value and timestamp', () => {
    const onDelete = vi.fn();
    render(
      <HistoryItem
        icon={<div>Icon</div>}
        value="test@example.com"
        timestamp="2 hours ago"
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('test@example.com')).toBeTruthy();
    expect(screen.getByText('2 hours ago')).toBeTruthy();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <HistoryItem
        icon={<div>Icon</div>}
        value="test@example.com"
        timestamp="2 hours ago"
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledOnce();
  });
});
