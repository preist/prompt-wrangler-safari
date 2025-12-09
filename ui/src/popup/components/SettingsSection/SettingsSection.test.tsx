import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsSection } from './SettingsSection';

describe('SettingsSection', () => {
  it('renders children', () => {
    render(
      <SettingsSection>
        <div>Test content</div>
      </SettingsSection>
    );

    expect(screen.getByText('Test content')).toBeTruthy();
  });

  it('renders title and description when provided', () => {
    render(
      <SettingsSection title="Test Title" description="Test Description">
        <div>Content</div>
      </SettingsSection>
    );

    expect(screen.getByText('Test Title')).toBeTruthy();
    expect(screen.getByText('Test Description')).toBeTruthy();
  });
});
