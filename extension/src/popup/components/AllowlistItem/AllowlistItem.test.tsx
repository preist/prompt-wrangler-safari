import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { AllowlistItem as AllowlistItemType } from '@lib/storage/allowlist';
import { AllowlistItem } from './AllowlistItem';

describe('AllowlistItem', () => {
  const mockItem: AllowlistItemType = {
    value: 'test@example.com',
    type: 'email',
    expiresAt: 'never',
    addedAt: Date.now(),
  };

  it('renders value and expiry text', () => {
    const onRemove = vi.fn();
    render(<AllowlistItem item={mockItem} onRemove={onRemove} />);

    expect(screen.getByText('test@example.com')).toBeTruthy();
    expect(screen.getByText('Allowed forever')).toBeTruthy();
  });

  it('shows "24 hours" text for temporary items', () => {
    const onRemove = vi.fn();
    const tempItem: AllowlistItemType = {
      ...mockItem,
      expiresAt: Date.now() + 86400000,
    };
    render(<AllowlistItem item={tempItem} onRemove={onRemove} />);

    expect(screen.getByText('Allowed for 24 hours')).toBeTruthy();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<AllowlistItem item={mockItem} onRemove={onRemove} />);

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(onRemove).toHaveBeenCalledWith('test@example.com', 'email');
  });
});
