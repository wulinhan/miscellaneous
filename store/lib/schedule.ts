// Delivery scheduling: order cut-off, business-day lead time, time slots,
// order-type deconfliction, and the "order now" message.
//
// All wall-clock reasoning is done in Asia/Singapore. Business-day maths is
// done on calendar dates (YYYY-MM-DD), which is DST-safe (SG has no DST).

import type { CartLine, CatalogProduct, OrderType } from './types';
import { defaultHolidaySet } from './holidays';

export const SCHEDULE_CONFIG = {
  timezone: 'Asia/Singapore',
  cutoffHour: 16, // 4:00 PM
  leadBusinessDays: 3, // earliest delivery is the 3rd business day
  slot: { startHour: 9, endHour: 17, minutes: 30 }, // fresh-food 30-min slots, 9am-5pm
  shelfWindow: '9:00 AM to 5:00 PM',
  freshCategories: ['Bubble Tea'], // catalog tags treated as fresh-prepared
};

// ---- Singapore "now" -------------------------------------------------------

interface SgtNow {
  date: string; // YYYY-MM-DD in SGT
  hour: number; // 0-23 in SGT
}

export function sgtNow(now: Date): SgtNow {
  const dateFmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: SCHEDULE_CONFIG.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hourFmt = new Intl.DateTimeFormat('en-GB', {
    timeZone: SCHEDULE_CONFIG.timezone,
    hour: '2-digit',
    hour12: false,
  });
  const date = dateFmt.format(now); // en-CA -> YYYY-MM-DD
  const hour = parseInt(hourFmt.format(now), 10) % 24;
  return { date, hour };
}

// ---- Business-day maths ----------------------------------------------------

function ymdToDate(ymd: string): Date {
  return new Date(`${ymd}T00:00:00Z`);
}
function dateToYmd(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addCalendarDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

export function isBusinessDay(ymd: string, holidays: Set<string>): boolean {
  const wd = ymdToDate(ymd).getUTCDay(); // 0 Sun .. 6 Sat
  return wd !== 0 && wd !== 6 && !holidays.has(ymd);
}

export function nextBusinessDay(ymd: string, holidays: Set<string>): string {
  let d = addCalendarDays(ymdToDate(ymd), 1);
  while (!isBusinessDay(dateToYmd(d), holidays)) d = addCalendarDays(d, 1);
  return dateToYmd(d);
}

export function addBusinessDays(ymd: string, n: number, holidays: Set<string>): string {
  let cur = ymd;
  for (let i = 0; i < n; i++) cur = nextBusinessDay(cur, holidays);
  return cur;
}

// ---- Earliest delivery date ------------------------------------------------

export function earliestDeliveryDate(now: Date, holidays = defaultHolidaySet()): string {
  const { date, hour } = sgtNow(now);
  // Before cut-off: next business day is "business day 1".
  // At/after cut-off: skip one further business day.
  let firstBusinessDay = nextBusinessDay(date, holidays);
  if (hour >= SCHEDULE_CONFIG.cutoffHour) {
    firstBusinessDay = nextBusinessDay(firstBusinessDay, holidays);
  }
  // Earliest delivery is business day 3 = firstBusinessDay + (lead - 1).
  return addBusinessDays(firstBusinessDay, SCHEDULE_CONFIG.leadBusinessDays - 1, holidays);
}

// ---- Time slots (fresh food) ----------------------------------------------

function fmt12(hour: number, minute: number): string {
  const ampm = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export function freshSlots(): string[] {
  const { startHour, endHour, minutes } = SCHEDULE_CONFIG.slot;
  const out: string[] = [];
  for (let m = startHour * 60; m + minutes <= endHour * 60; m += minutes) {
    const s = fmt12(Math.floor(m / 60), m % 60);
    const e = fmt12(Math.floor((m + minutes) / 60), (m + minutes) % 60);
    out.push(`${s} - ${e}`);
  }
  return out;
}

// ---- Order-type deconfliction ---------------------------------------------

export function productKind(p: CatalogProduct): OrderType {
  return p.kind;
}

/**
 * A mixed order (fresh + shelf) is treated as FRESH (most urgent).
 *  - fresh / mixed: must pick date AND a 30-minute slot.
 *  - shelf only:    pick date only; may add the Specific Time add-on.
 */
export function resolveOrderType(
  lines: CartLine[],
  catalogById: Record<string, CatalogProduct>,
): { orderType: OrderType; needsSlot: boolean; specificTimeEligible: boolean } {
  const hasFresh = lines.some((l) => catalogById[l.productId]?.kind === 'fresh');
  const orderType: OrderType = hasFresh ? 'fresh' : 'shelf';
  return {
    orderType,
    needsSlot: orderType === 'fresh',
    specificTimeEligible: orderType === 'shelf',
  };
}

// ---- "Order now" message ---------------------------------------------------

export function prettyDate(ymd: string): string {
  const d = ymdToDate(ymd);
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getUTCDay()];
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
    d.getUTCMonth()
  ];
  return `${wd}, ${d.getUTCDate()} ${mon}`;
}

export function orderNowMessage(now: Date, holidays = defaultHolidaySet()): string {
  const { hour } = sgtNow(now);
  const earliest = prettyDate(earliestDeliveryDate(now, holidays));
  return hour < SCHEDULE_CONFIG.cutoffHour
    ? `Order before 4:00 PM today to get it by ${earliest}.`
    : `Order now to get it by ${earliest}.`;
}
