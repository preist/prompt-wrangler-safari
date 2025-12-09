import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIssues } from './useIssues';

describe('useIssues', () => {
  it('throws error when used outside IssuesProvider', () => {
    expect(() => {
      renderHook(() => useIssues());
    }).toThrow('useIssues must be used within IssuesProvider');
  });
});
