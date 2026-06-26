// Discount codes. In production these should live in the CMS / DB and be
// validated server-side (expiry, usage limits). Kept tiny here for the scaffold.

import type { Discount } from './types';

const CODES: Record<string, Discount> = {
  SOFNADE50: { code: 'SOFNADE50', type: 'percent', value: 50 },
};

export function resolveDiscount(code?: string | null): Discount | null {
  if (!code) return null;
  return CODES[code.trim().toUpperCase()] ?? null;
}
