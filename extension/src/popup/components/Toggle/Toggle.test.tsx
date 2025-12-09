import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle', () => {
  it('renders with label and calls onChange when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle label="Test Toggle" checked={false} onChange={onChange} />);

    const toggle = screen.getByRole('switch', { name: 'Test Toggle' });
    expect(toggle).toBeTruthy();

    await user.click(toggle);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('renders with description when provided', () => {
    const onChange = vi.fn();
    render(
      <Toggle
        label="Test Toggle"
        description="Test description"
        checked={false}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Test description')).toBeTruthy();
  });

  it('reflects checked state in aria-checked attribute', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Toggle label="Test Toggle" checked={false} onChange={onChange} />);

    const toggle = screen.getByRole('switch');
    expect(toggle.getAttribute('aria-checked')).toBe('false');

    rerender(<Toggle label="Test Toggle" checked={true} onChange={onChange} />);
    expect(toggle.getAttribute('aria-checked')).toBe('true');
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Toggle label="Test Toggle" checked={false} disabled={true} onChange={onChange} />);

    const toggle = screen.getByRole('switch');
    await user.click(toggle);

    expect(onChange).not.toHaveBeenCalled();
  });
});
