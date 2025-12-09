import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingScreen } from './OnboardingScreen';

describe('OnboardingScreen', () => {
  it('renders welcome message', () => {
    const onComplete = vi.fn();
    render(<OnboardingScreen onComplete={onComplete} />);

    expect(screen.getByText(/Howdy, partner/i)).toBeTruthy();
    expect(screen.getByText(/Prompt Wrangler/i)).toBeTruthy();
  });

  it('calls onComplete when button is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<OnboardingScreen onComplete={onComplete} />);

    await user.click(screen.getByRole('button', { name: /let's go/i }));

    expect(onComplete).toHaveBeenCalledOnce();
  });
});
