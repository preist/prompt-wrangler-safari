import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from './Navigation';

describe('Navigation', () => {
  it('renders all navigation buttons', () => {
    const onChange = vi.fn();
    render(<Navigation current="issues" onChange={onChange} />);

    expect(screen.getByRole('button', { name: /issues/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /history/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /allowlist/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /settings/i })).toBeTruthy();
  });

  it('calls onChange when navigation buttons are clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Navigation current="issues" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: /history/i }));
    expect(onChange).toHaveBeenCalledWith('history');

    await user.click(screen.getByRole('button', { name: /allowlist/i }));
    expect(onChange).toHaveBeenCalledWith('allowlist');

    await user.click(screen.getByRole('button', { name: /settings/i }));
    expect(onChange).toHaveBeenCalledWith('settings');
  });

  describe('jiggle animation', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('triggers jiggle animation on allowlist button when allowlist-item-added event fires', () => {
      const onChange = vi.fn();
      render(<Navigation current="issues" onChange={onChange} />);

      const allowlistButton = screen.getByRole('button', { name: /allowlist/i });

      expect(allowlistButton.classList.contains('navigation__button--jiggle')).toBe(false);

      act(() => {
        window.dispatchEvent(new Event('allowlist-item-added'));
      });

      expect(allowlistButton.classList.contains('navigation__button--jiggle')).toBe(true);

      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(allowlistButton.classList.contains('navigation__button--jiggle')).toBe(false);
    });

    it('cleans up event listener on unmount', () => {
      const onChange = vi.fn();
      const { unmount } = render(<Navigation current="issues" onChange={onChange} />);

      unmount();

      // Verify no errors occur when dispatching event after unmount
      expect(() => {
        act(() => {
          window.dispatchEvent(new Event('allowlist-item-added'));
        });
      }).not.toThrow();
    });
  });
});
