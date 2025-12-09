import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders GitHub link', () => {
    render(<Footer />);

    const link = screen.getByRole('link', { name: /view source/i });

    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toContain('github.com');
  });
});
