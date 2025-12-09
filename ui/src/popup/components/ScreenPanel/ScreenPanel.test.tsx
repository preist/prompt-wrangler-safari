import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScreenPanel } from './ScreenPanel';

describe('ScreenPanel', () => {
  it('renders children', () => {
    render(
      <ScreenPanel>
        <div>Panel content</div>
      </ScreenPanel>
    );

    expect(screen.getByText('Panel content')).toBeTruthy();
  });

  it('renders action button and calls onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <ScreenPanel action={{ label: 'Clear All', onClick, show: true }}>
        <div>Content</div>
      </ScreenPanel>
    );

    const button = screen.getByRole('button', { name: 'Clear All' });
    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('hides action button when show is false', () => {
    const onClick = vi.fn();

    render(
      <ScreenPanel action={{ label: 'Hidden', onClick, show: false }}>
        <div>Content</div>
      </ScreenPanel>
    );

    expect(screen.queryByRole('button', { name: 'Hidden' })).toBeFalsy();
  });
});
