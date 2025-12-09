import { describe, it, expect } from 'vitest';
import { formatTimestamp } from './issueHelpers';

describe('formatTimestamp', () => {
  it('formats timestamp as localized date string', () => {
    const timestamp = new Date('2024-01-15T14:30:00').getTime();
    const result = formatTimestamp(timestamp);

    // Check that result contains expected date components
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});
