export const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
export const US_PHONE_PATTERN =
  /(?:\+?1\s?[-.]?\s?)?\(?[2-9]\d{2}\)?\s?[-.]?\s?\d{3}\s?[-.]?\s?\d{4}\b/g;
export const INTL_PHONE_PATTERN =
  /\+\d{1,3}\s?[-.]?\s?(?:\(?\d{1,4}\)?[\s.-]?)?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,4}(?:[\s.-]?\d{1,4})?\b/g;
export const CREDIT_CARD_PATTERN = /\b(?:\d{4}[\s-]?){3}\d{4}\b/g;
export const SSN_PATTERN = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g;

export const EMAIL_PLACEHOLDER = '[EMAIL_ADDRESS]';
export const PHONE_PLACEHOLDER = '[PHONE_NUMBER]';
export const CREDIT_CARD_PLACEHOLDER = '[CREDIT_CARD]';
export const SSN_PLACEHOLDER = '[SSN]';

export const PHONE_PATTERNS = [INTL_PHONE_PATTERN, US_PHONE_PATTERN] as const;
