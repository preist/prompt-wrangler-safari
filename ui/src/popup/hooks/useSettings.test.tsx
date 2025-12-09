import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSettings } from './useSettings';

describe('useSettings', () => {
  it('throws error when used outside SettingsProvider', () => {
    expect(() => {
      renderHook(() => useSettings());
    }).toThrow('useSettings must be used within SettingsProvider');
  });
});
