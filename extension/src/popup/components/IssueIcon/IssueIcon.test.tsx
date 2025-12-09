import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { IssueIcon } from './IssueIcon';

describe('IssueIcon', () => {
  it('renders icon for each issue type', () => {
    const types = ['email', 'phone', 'creditCard', 'ssn'];

    types.forEach((type) => {
      const { container } = render(<IssueIcon type={type} />);
      expect(container.querySelector('.issue-icon')).toBeTruthy();
    });
  });

  it('returns null for unknown type', () => {
    const { container } = render(<IssueIcon type="unknown" />);
    expect(container.firstChild).toBeFalsy();
  });
});
