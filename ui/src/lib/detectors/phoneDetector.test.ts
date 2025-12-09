import { describe, it, expect } from 'vitest';
import { phoneDetector } from './phoneDetector';

describe('phoneDetector', () => {
  describe('detect', () => {
    it('detects US phone numbers in various formats', () => {
      const cases = [
        { text: 'Call (555) 123-4567', expected: '(555) 123-4567' },
        { text: 'My number is 555-123-4567', expected: '555-123-4567' },
        { text: 'Contact: 555.123.4567', expected: '555.123.4567' },
        { text: 'Phone: 555 123 4567', expected: '555 123 4567' },
        { text: 'Call 5551234567 today', expected: '5551234567' },
      ];

      cases.forEach(({ text, expected }) => {
        const result = phoneDetector.detect(text);

        expect(result).toHaveLength(1);
        expect(result[0]?.value).toBe(expected);
        expect(result[0]?.type).toBe('phone');
      });
    });

    it('detects US numbers with country code', () => {
      const cases = [
        '+1 555 123 4567',
        '+1-555-123-4567',
        '1-555-123-4567',
        '1 (555) 123-4567',
        '+1 (555) 123-4567',
      ];

      cases.forEach((expected) => {
        const result = phoneDetector.detect(`Call ${expected}`);

        expect(result).toHaveLength(1);
        expect(result[0]?.value).toBe(expected);
      });
    });

    it('detects international phone numbers', () => {
      const cases = [
        { text: 'Israel: +972 50 123 4567', expected: '+972 50 123 4567' },
        { text: 'Moldova: +373 22 123 456', expected: '+373 22 123 456' },
        { text: 'Moldova mobile: +373 60 123 456', expected: '+373 60 123 456' },
        { text: 'UK: +44 20 7123 4567', expected: '+44 20 7123 4567' },
        { text: 'Germany: +49 30 12345678', expected: '+49 30 12345678' },
        { text: 'France: +33 1 23 45 67 89', expected: '+33 1 23 45 67 89' },
      ];

      cases.forEach(({ text, expected }) => {
        const result = phoneDetector.detect(text);

        expect(result).toHaveLength(1);
        expect(result[0]?.value).toBe(expected);
      });
    });

    it('detects multiple phone numbers in text', () => {
      const result = phoneDetector.detect('Call 555-123-4567 or (555) 987-6543');

      expect(result).toHaveLength(2);
      expect(result[0]?.value).toBe('555-123-4567');
      expect(result[1]?.value).toBe('(555) 987-6543');
    });

    it('detects mixed US and international numbers', () => {
      const text = 'US: +1 555 123 4567, Israel: +972 50 123 4567, Local: 555-123-4567';
      const result = phoneDetector.detect(text);

      expect(result).toHaveLength(3);
      expect(result[0]?.value).toBe('+1 555 123 4567');
      expect(result[1]?.value).toBe('+972 50 123 4567');
      expect(result[2]?.value).toBe('555-123-4567');
    });

    it('returns results in text order', () => {
      const result = phoneDetector.detect('Call (555) 123-4567 or +1 555 111 2222');

      expect(result[0]?.value).toBe('(555) 123-4567');
      expect(result[1]?.value).toBe('+1 555 111 2222');
    });

    it('avoids overlap when international number contains local-looking pattern', () => {
      const result = phoneDetector.detect('Rome: +39 06 1234 5678');

      expect(result).toHaveLength(1);
      expect(result[0]?.value).toBe('+39 06 1234 5678');
    });

    it('detects duplicate numbers at different positions', () => {
      const result = phoneDetector.detect('Call 555-123-4567 or text 555-123-4567');

      expect(result).toHaveLength(2);
      expect(result[0]?.value).toBe('555-123-4567');
      expect(result[1]?.value).toBe('555-123-4567');
    });

    it('does not detect invalid formats', () => {
      const invalid = [
        'Date: 2023-12-25',
        'Time: 10:30:45',
        'Invalid: 155-123-4567',
        'Short: 123-4567',
        'No numbers here',
      ];

      invalid.forEach((text) => {
        const result = phoneDetector.detect(text);

        expect(result).toHaveLength(0);
      });
    });

    it('includes metadata in detection', () => {
      const before = Date.now();
      const result = phoneDetector.detect('Call 555-123-4567');
      const after = Date.now();

      expect(result[0]?.id).toBeDefined();
      expect(result[0]?.timestamp).toBeGreaterThanOrEqual(before);
      expect(result[0]?.timestamp).toBeLessThanOrEqual(after);
    });
  });

  describe('anonymize', () => {
    it('replaces phone numbers with placeholder', () => {
      const result = phoneDetector.anonymize('Call 555-123-4567 or (555) 987-6543', new Set());

      expect(result).toBe('Call [PHONE_NUMBER] or [PHONE_NUMBER]');
    });

    it('anonymizes international numbers', () => {
      const result = phoneDetector.anonymize('Israel: +972 50 123 4567', new Set());

      expect(result).toBe('Israel: [PHONE_NUMBER]');
    });

    it('preserves dismissed phone numbers', () => {
      const dismissed = new Set(['555-123-4567']);
      const result = phoneDetector.anonymize('Call 555-123-4567 or 555-987-6543', dismissed);

      expect(result).toBe('Call 555-123-4567 or [PHONE_NUMBER]');
    });

    it('handles case-insensitive dismissal', () => {
      const dismissed = new Set(['555-123-4567']);
      const result = phoneDetector.anonymize('Call 555-123-4567', dismissed);

      expect(result).toBe('Call 555-123-4567');
    });

    it('does not modify text without phone numbers', () => {
      const text = 'No phone numbers here';
      const result = phoneDetector.anonymize(text, new Set());

      expect(result).toBe(text);
    });
  });

  describe('detector properties', () => {
    it('has correct configuration', () => {
      expect(phoneDetector.type).toBe('phone');
      expect(phoneDetector.placeholder).toBe('[PHONE_NUMBER]');
      expect(phoneDetector.pattern).toBeInstanceOf(RegExp);
    });
  });
});
