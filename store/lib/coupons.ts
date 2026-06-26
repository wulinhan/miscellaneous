// Discount codes. Resolved server-side from the CMS (Sanity) so the owner can
// add/edit codes without a deploy. Falls back to a tiny built-in map when
// Sanity is not configured or unreachable. Amounts are still recomputed in
// pricing.ts — a code only selects the kind/size of the discount, never money.

import type { Discount } from './types';
import { isSanityConfigured, sanityQuery } from './sanity';

const FALLBACK: Record<string, Discount> = {
  SOFNADE50: { code: 'SOFNADE50', type: 'percent', value: 50 },
};

interface RawCode {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number | null;
}

// Map the CMS discount type to the pricing engine's discount type.
function mapType(t: RawCode['type']): Discount['type'] {
  if (t === 'percent') return 'percent';
  if (t === 'shipping') return 'shipping';
  return 'amount'; // 'fixed' = fixed dollar amount off
}

export async function resolveDiscount(code?: string | null): Promise<Discount | null> {
  const key = code?.trim().toUpperCase();
  if (!key) return null;

  if (isSanityConfigured()) {
    try {
      const rows = await sanityQuery<RawCode[]>(
        '*[_type == "discountCode"]{code, type, value}',
      );
      const row = (rows ?? []).find((r) => r.code?.trim().toUpperCase() === key);
      // Configured: the CMS is authoritative. An unknown code is simply invalid.
      return row ? { code: key, type: mapType(row.type), value: row.value ?? 0 } : null;
    } catch (err) {
      console.error('[coupons] Sanity fetch failed, using fallback:', (err as Error).message);
    }
  }

  return FALLBACK[key] ?? null;
}
