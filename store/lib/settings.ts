// Site settings (hero copy, delivery fee/threshold, pick-up, time slots) read
// from the single `siteSettings` document in Sanity, with built-in defaults so
// the store renders before the CMS is connected or if it is unreachable.

import { isSanityConfigured, sanityQuery } from './sanity';

export interface TimeSlot {
  value: string;
  label: string;
  sub: string;
}

export interface SiteSettings {
  brandName: string;
  heroTitle: string;
  heroSubtitle: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  pickupEnabled: boolean;
  leadBusinessDays: number;
  timeSlots: TimeSlot[];
}

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'Sofnade',
  heroTitle: 'Order Sofnade',
  heroSubtitle:
    'Hand-shaken bubble tea, freshly baked sweets, wholesome snacks and giftable sets, delivered across Singapore.',
  deliveryFee: 30,
  freeDeliveryThreshold: 150,
  pickupEnabled: true,
  leadBusinessDays: 3,
  timeSlots: [],
};

const SETTINGS_GROQ = `*[_type == "siteSettings"][0]{
  brandName, heroTitle, heroSubtitle, deliveryFee, freeDeliveryThreshold,
  pickupEnabled, leadBusinessDays, timeSlots[]{value, label, sub}
}`;

// Drop null/undefined fields so they don't clobber the defaults on merge.
function defined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined),
  ) as Partial<T>;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured()) return DEFAULT_SETTINGS;
  try {
    const s = await sanityQuery<Partial<SiteSettings> | null>(SETTINGS_GROQ);
    return s ? { ...DEFAULT_SETTINGS, ...defined(s) } : DEFAULT_SETTINGS;
  } catch (err) {
    console.error('[settings] Sanity fetch failed, using fallback:', (err as Error).message);
    return DEFAULT_SETTINGS;
  }
}
