// This script runs in the page's main world, not the isolated content script world
// It has access to the page's actual fetch function before any app code runs

import {
  EMAIL_PATTERN,
  EMAIL_PLACEHOLDER,
  PHONE_PATTERNS,
  PHONE_PLACEHOLDER,
  CREDIT_CARD_PATTERN,
  CREDIT_CARD_PLACEHOLDER,
  SSN_PATTERN,
  SSN_PLACEHOLDER,
} from '@lib/detectors/patterns';

interface DetectedIssue {
  id: string;
  type: string;
  value: string;
  timestamp: number;
}

interface AllowlistItem {
  value: string;
  type: 'email' | 'phone' | 'creditCard' | 'ssn';
  expiresAt: number | 'never';
  addedAt: number;
}

console.log('[Prompt Wrangler] Injected script (main world) loaded');

const originalFetch = window.fetch;
let protectedModeEnabled = true;
let enabledDataTypes = {
  email: true,
  phone: true,
  creditCard: true,
  ssn: true,
};
let allowlist: AllowlistItem[] = [];

window.addEventListener('prompt-wrangler-mode-change', (event: Event) => {
  const customEvent = event as CustomEvent<{ enabled: boolean }>;
  protectedModeEnabled = customEvent.detail.enabled;
  console.log('[Prompt Wrangler] Protected mode changed:', protectedModeEnabled);
});

window.addEventListener('prompt-wrangler-data-types-change', (event: Event) => {
  const customEvent = event as CustomEvent<{ dataTypes: Record<string, boolean> }>;
  enabledDataTypes = customEvent.detail.dataTypes as typeof enabledDataTypes;
  console.log('[Prompt Wrangler] Data types changed:', enabledDataTypes);
});

window.addEventListener('prompt-wrangler-allowlist-change', (event: Event) => {
  const customEvent = event as CustomEvent<{ allowlist: AllowlistItem[] }>;
  allowlist = customEvent.detail.allowlist;
  console.log('[Prompt Wrangler] Allowlist changed:', allowlist);
});

function generateId(): string {
  return `${Date.now().toString()}-${Math.random().toString(36).substring(2, 9)}`;
}

function isAllowlisted(value: string, type: string): boolean {
  const now = Date.now();
  const normalizedValue = value.toLowerCase();

  return allowlist.some((item) => {
    if (item.type !== type) return false;
    if (item.value.toLowerCase() !== normalizedValue) return false;
    if (item.expiresAt === 'never') return true;
    return item.expiresAt > now;
  });
}

function detectEmails(text: string): DetectedIssue[] {
  if (!enabledDataTypes.email) {
    return [];
  }

  const matches = text.matchAll(EMAIL_PATTERN);
  const issues: DetectedIssue[] = [];

  for (const match of matches) {
    if (match[0] && !isAllowlisted(match[0], 'email')) {
      issues.push({
        id: generateId(),
        type: 'email',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function detectPhones(text: string): DetectedIssue[] {
  if (!enabledDataTypes.phone) {
    return [];
  }

  const issues: DetectedIssue[] = [];
  const seen = new Set<string>();

  for (const pattern of PHONE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      if (match[0] && !seen.has(match[0]) && !isAllowlisted(match[0], 'phone')) {
        seen.add(match[0]);
        issues.push({
          id: generateId(),
          type: 'phone',
          value: match[0],
          timestamp: Date.now(),
        });
      }
    }
  }

  return issues;
}

function anonymizeEmails(text: string): string {
  if (!enabledDataTypes.email) {
    return text;
  }
  return text.replace(EMAIL_PATTERN, (match) => {
    return isAllowlisted(match, 'email') ? match : EMAIL_PLACEHOLDER;
  });
}

function anonymizePhones(text: string): string {
  if (!enabledDataTypes.phone) {
    return text;
  }
  let result = text;
  for (const pattern of PHONE_PATTERNS) {
    result = result.replace(pattern, (match) => {
      return isAllowlisted(match, 'phone') ? match : PHONE_PLACEHOLDER;
    });
  }
  return result;
}

function detectCreditCards(text: string): DetectedIssue[] {
  if (!enabledDataTypes.creditCard) {
    return [];
  }

  const matches = text.matchAll(CREDIT_CARD_PATTERN);
  const issues: DetectedIssue[] = [];

  for (const match of matches) {
    if (match[0] && !isAllowlisted(match[0], 'creditCard')) {
      issues.push({
        id: generateId(),
        type: 'creditCard',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function anonymizeCreditCards(text: string): string {
  if (!enabledDataTypes.creditCard) {
    return text;
  }
  return text.replace(CREDIT_CARD_PATTERN, (match) => {
    return isAllowlisted(match, 'creditCard') ? match : CREDIT_CARD_PLACEHOLDER;
  });
}

function detectSSN(text: string): DetectedIssue[] {
  if (!enabledDataTypes.ssn) {
    return [];
  }

  const matches = text.matchAll(SSN_PATTERN);
  const issues: DetectedIssue[] = [];

  for (const match of matches) {
    if (match[0] && !isAllowlisted(match[0], 'ssn')) {
      issues.push({
        id: generateId(),
        type: 'ssn',
        value: match[0],
        timestamp: Date.now(),
      });
    }
  }

  return issues;
}

function anonymizeSSN(text: string): string {
  if (!enabledDataTypes.ssn) {
    return text;
  }
  return text.replace(SSN_PATTERN, (match) => {
    return isAllowlisted(match, 'ssn') ? match : SSN_PLACEHOLDER;
  });
}

function scanAndAnonymize(obj: unknown): { anonymized: unknown; issues: DetectedIssue[] } {
  const allIssues: DetectedIssue[] = [];

  function processValue(value: unknown): unknown {
    if (typeof value === 'string') {
      let currentText = value;

      const emailIssues = detectEmails(currentText);
      if (emailIssues.length > 0) {
        allIssues.push(...emailIssues);
        currentText = anonymizeEmails(currentText);
      }

      const creditCardIssues = detectCreditCards(currentText);
      if (creditCardIssues.length > 0) {
        allIssues.push(...creditCardIssues);
        currentText = anonymizeCreditCards(currentText);
      }

      const ssnIssues = detectSSN(currentText);
      if (ssnIssues.length > 0) {
        allIssues.push(...ssnIssues);
        currentText = anonymizeSSN(currentText);
      }

      const phoneIssues = detectPhones(currentText);
      if (phoneIssues.length > 0) {
        allIssues.push(...phoneIssues);
        currentText = anonymizePhones(currentText);
      }

      return currentText;
    }

    if (Array.isArray(value)) {
      return value.map((item) => processValue(item));
    }

    if (value !== null && typeof value === 'object') {
      const newObj: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        newObj[key] = processValue(val);
      }
      return newObj;
    }

    return value;
  }

  const anonymized = processValue(obj);
  return { anonymized, issues: allIssues };
}

window.fetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;

  console.log('[Prompt Wrangler] Fetch intercepted:', url);

  // Skip scanning if protected mode is disabled
  if (!protectedModeEnabled) {
    console.log('[Prompt Wrangler] Protected mode disabled, skipping scan');
    return await originalFetch(input, init);
  }

  if (
    url.includes('/backend-api/') &&
    init?.method === 'POST' &&
    init.body &&
    typeof init.body === 'string'
  ) {
    console.log('[Prompt Wrangler] ChatGPT API request detected, scanning...');

    try {
      const payload = JSON.parse(init.body) as unknown;
      const { anonymized, issues } = scanAndAnonymize(payload);

      if (issues.length > 0) {
        console.log('[Prompt Wrangler] Detected issues:', issues);

        // Send to content script via custom event
        window.dispatchEvent(
          new CustomEvent('prompt-wrangler-issues', {
            detail: { issues },
          })
        );

        // Modify request with anonymized payload
        const modifiedInit = {
          ...init,
          body: JSON.stringify(anonymized),
        };

        return await originalFetch(input, modifiedInit);
      }
    } catch (error) {
      console.error('[Prompt Wrangler] Error scanning request:', error);
    }
  }

  return await originalFetch(input, init);
};

console.log('[Prompt Wrangler] Fetch override installed');
