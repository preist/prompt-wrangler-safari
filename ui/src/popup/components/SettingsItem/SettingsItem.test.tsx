import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingsItem } from './SettingsItem';

describe('SettingsItem', () => {
  it('renders title and children', () => {
    render(
      <SettingsItem title="Test Setting">
        <div>Control</div>
      </SettingsItem>
    );

    expect(screen.getByText('Test Setting')).toBeTruthy();
    expect(screen.getByText('Control')).toBeTruthy();
  });

  it('renders description when provided', () => {
    render(
      <SettingsItem title="Test" description="Helper text">
        <div>Control</div>
      </SettingsItem>
    );

    expect(screen.getByText('Helper text')).toBeTruthy();
  });
});
