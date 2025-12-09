import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AppLayout } from './AppLayout';

// Mock all the screen components to avoid chrome API calls
vi.mock('@popup/screens/IssuesFoundScreen/IssuesFoundScreen', () => ({
  IssuesFoundScreen: () => <div>IssuesFoundScreen</div>,
}));
vi.mock('@popup/screens/HistoryScreen/HistoryScreen', () => ({
  HistoryScreen: () => <div>HistoryScreen</div>,
}));
vi.mock('@popup/screens/AllowlistScreen/AllowlistScreen', () => ({
  AllowlistScreen: () => <div>AllowlistScreen</div>,
}));
vi.mock('@popup/screens/SettingsScreen/SettingsScreen', () => ({
  SettingsScreen: () => <div>SettingsScreen</div>,
}));
vi.mock('@popup/components/ProtectedModeToggle/ProtectedModeToggle', () => ({
  ProtectedModeToggle: () => <div>ProtectedModeToggle</div>,
}));

describe('AppLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(<AppLayout />);
    expect(container.querySelector('.app')).toBeTruthy();
  });
});
