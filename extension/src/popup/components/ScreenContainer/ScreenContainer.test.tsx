import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScreenContainer } from './ScreenContainer';

describe('ScreenContainer', () => {
  it('renders children', () => {
    render(
      <ScreenContainer>
        <div>Screen content</div>
      </ScreenContainer>
    );

    expect(screen.getByText('Screen content')).toBeTruthy();
  });
});
