import { describe, it, expect } from 'vitest';
import { emailDetector } from './emailDetector';

describe('emailDetector', () => {
  describe('detect', () => {
    it('detects single email address', () => {
      const text = 'Contact me at john@example.com';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(1);
      expect(result[0]?.value).toBe('john@example.com');
      expect(result[0]?.type).toBe('email');
    });

    it('detects multiple email addresses', () => {
      const text = 'Email john@example.com or jane@test.org for info';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(2);
      expect(result[0]?.value).toBe('john@example.com');
      expect(result[1]?.value).toBe('jane@test.org');
    });

    it('detects emails with special characters', () => {
      const text = 'Send to user.name+tag@sub.domain.com';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(1);
      expect(result[0]?.value).toBe('user.name+tag@sub.domain.com');
    });

    it('detects emails with numbers', () => {
      const text = 'Contact user123@example456.com';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(1);
      expect(result[0]?.value).toBe('user123@example456.com');
    });

    it('returns empty array when no emails found', () => {
      const text = 'This text has no email addresses';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(0);
    });

    it('does not detect invalid email patterns', () => {
      const text = 'Invalid: @example.com, user@, user@.com';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(0);
    });

    it('generates unique IDs for each detection', () => {
      const text = 'Email john@example.com or jane@example.com';
      const result = emailDetector.detect(text);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).not.toBe(result[1]?.id);
    });

    it('includes timestamp in each detection', () => {
      const beforeTime = Date.now();
      const text = 'Contact john@example.com';
      const result = emailDetector.detect(text);
      const afterTime = Date.now();

      expect(result).toHaveLength(1);
      expect(result[0]?.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(result[0]?.timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('anonymize', () => {
    it('replaces single email with placeholder', () => {
      const text = 'Contact me at john@example.com';
      const dismissed = new Set<string>();
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('Contact me at [EMAIL_ADDRESS]');
    });

    it('replaces multiple emails with placeholder', () => {
      const text = 'Email john@example.com or jane@test.org';
      const dismissed = new Set<string>();
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('Email [EMAIL_ADDRESS] or [EMAIL_ADDRESS]');
    });

    it('preserves dismissed email addresses', () => {
      const text = 'Email john@example.com or jane@test.org';
      const dismissed = new Set(['john@example.com']);
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('Email john@example.com or [EMAIL_ADDRESS]');
    });

    it('handles case-insensitive dismissed emails', () => {
      const text = 'Email JOHN@EXAMPLE.COM or jane@test.org';
      const dismissed = new Set(['john@example.com']);
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('Email JOHN@EXAMPLE.COM or [EMAIL_ADDRESS]');
    });

    it('preserves text without emails', () => {
      const text = 'This text has no email addresses';
      const dismissed = new Set<string>();
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('This text has no email addresses');
    });

    it('handles multiple occurrences of same email', () => {
      const text = 'Email john@example.com and john@example.com again';
      const dismissed = new Set<string>();
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('Email [EMAIL_ADDRESS] and [EMAIL_ADDRESS] again');
    });

    it('preserves surrounding whitespace and punctuation', () => {
      const text = 'Contact: john@example.com, jane@test.org.';
      const dismissed = new Set<string>();
      const result = emailDetector.anonymize(text, dismissed);

      expect(result).toBe('Contact: [EMAIL_ADDRESS], [EMAIL_ADDRESS].');
    });
  });

  describe('metadata', () => {
    it('has correct type', () => {
      expect(emailDetector.type).toBe('email');
    });

    it('has correct placeholder', () => {
      expect(emailDetector.placeholder).toBe('[EMAIL_ADDRESS]');
    });

    it('has pattern property', () => {
      expect(emailDetector.pattern).toBeInstanceOf(RegExp);
    });
  });
});
