import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScreenEmptyState } from './ScreenEmptyState';

describe('ScreenEmptyState', () => {
  it('renders title and description', () => {
    render(<ScreenEmptyState title="No items" description="Nothing to show here" />);

    expect(screen.getByText('No items')).toBeTruthy();
    expect(screen.getByText('Nothing to show here')).toBeTruthy();
  });
});
