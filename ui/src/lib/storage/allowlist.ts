export interface AllowlistItem {
  value: string;
  type: 'email' | 'phone' | 'creditCard' | 'ssn';
  expiresAt: number | 'never';
  addedAt: number;
}

const STORAGE_KEY = 'allowlist';

export async function getAllowlist(): Promise<AllowlistItem[]> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as AllowlistItem[] | undefined) ?? [];
}

export async function addToAllowlist(
  value: string,
  type: 'email' | 'phone' | 'creditCard' | 'ssn',
  duration: '24h' | 'forever'
): Promise<void> {
  const allowlist = await getAllowlist();
  const now = Date.now();
  const expiresAt = duration === 'forever' ? 'never' : now + 24 * 60 * 60 * 1000;

  const existingIndex = allowlist.findIndex(
    (item) => item.value.toLowerCase() === value.toLowerCase() && item.type === type
  );

  if (existingIndex !== -1) {
    allowlist[existingIndex] = {
      value,
      type,
      expiresAt,
      addedAt: now,
    };
  } else {
    allowlist.push({
      value,
      type,
      expiresAt,
      addedAt: now,
    });
  }

  await chrome.storage.local.set({ [STORAGE_KEY]: allowlist });
}

export async function removeFromAllowlist(
  value: string,
  type: 'email' | 'phone' | 'creditCard' | 'ssn'
): Promise<void> {
  const allowlist = await getAllowlist();
  const filtered = allowlist.filter(
    (item) => !(item.value.toLowerCase() === value.toLowerCase() && item.type === type)
  );
  await chrome.storage.local.set({ [STORAGE_KEY]: filtered });
}

export async function cleanExpiredAllowlistItems(): Promise<void> {
  const allowlist = await getAllowlist();
  const now = Date.now();
  const active = allowlist.filter((item) => item.expiresAt === 'never' || item.expiresAt > now);

  if (active.length !== allowlist.length) {
    await chrome.storage.local.set({ [STORAGE_KEY]: active });
  }
}

export function isAllowlisted(
  value: string,
  type: 'email' | 'phone' | 'creditCard' | 'ssn',
  allowlist: AllowlistItem[]
): boolean {
  const now = Date.now();
  const normalizedValue = value.toLowerCase();

  return allowlist.some((item) => {
    if (item.type !== type) return false;
    if (item.value.toLowerCase() !== normalizedValue) return false;
    if (item.expiresAt === 'never') return true;
    return item.expiresAt > now;
  });
}
