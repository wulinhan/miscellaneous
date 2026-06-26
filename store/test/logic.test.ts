import { describe, it, expect } from 'vitest';
import { earliestDeliveryDate, freshSlots, resolveOrderType, prettyDate } from '../lib/schedule';
import { quote } from '../lib/pricing';
import { mapProduct } from '../lib/catalog';
import { resolveDiscount } from '../lib/coupons';
import type { CatalogProduct } from '../lib/types';

const HOLIDAYS = new Set<string>(); // none, for deterministic weekday tests
const dow = (ymd: string) =>
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date(`${ymd}T00:00:00Z`).getUTCDay()];

// A fixed SGT instant helper: build a UTC time 8h behind the desired SGT time.
const sgt = (ymd: string, hour: number) =>
  new Date(`${ymd}T${String(hour - 8).padStart(2, '0')}:00:00Z`);

describe('earliest delivery date', () => {
  // 2026-07-06 is Monday, 2026-07-10 is Friday.
  it('Mon before cutoff -> Thu', () => {
    expect(dow(earliestDeliveryDate(sgt('2026-07-06', 10), HOLIDAYS))).toBe('Thu');
  });
  it('Mon at/after cutoff -> Fri', () => {
    expect(dow(earliestDeliveryDate(sgt('2026-07-06', 17), HOLIDAYS))).toBe('Fri');
  });
  it('Fri after cutoff -> Thu', () => {
    expect(dow(earliestDeliveryDate(sgt('2026-07-10', 17), HOLIDAYS))).toBe('Thu');
  });
  it('skips a public holiday', () => {
    const hol = new Set(['2026-07-09']); // make Thu a holiday
    expect(dow(earliestDeliveryDate(sgt('2026-07-06', 10), hol))).toBe('Fri');
  });
});

describe('time slots', () => {
  it('30-min slots 9am-5pm, first and last', () => {
    const s = freshSlots();
    expect(s[0]).toBe('9:00 AM - 9:30 AM');
    expect(s[s.length - 1]).toBe('4:30 PM - 5:00 PM');
    expect(s).toHaveLength(16);
  });
});

const FRESH: CatalogProduct = {
  id: 'milk-tea',
  title: 'Milk Tea',
  kind: 'fresh',
  sizes: [{ label: 'Regular cup (500ml)', price: 3.2 }],
};
const SHELF: CatalogProduct = {
  id: 'cookies',
  title: 'Cookies',
  kind: 'shelf',
  sizes: [{ label: 'Bottle (150g)', price: 9.8 }],
};
const byId = { [FRESH.id]: FRESH, [SHELF.id]: SHELF };

describe('order-type deconfliction', () => {
  it('mixed order is treated as fresh, no specific-time add-on', () => {
    const r = resolveOrderType(
      [{ productId: 'milk-tea', size: 'Regular cup (500ml)', qty: 1 }, { productId: 'cookies', size: 'Bottle (150g)', qty: 1 }],
      byId,
    );
    expect(r.orderType).toBe('fresh');
    expect(r.needsSlot).toBe(true);
    expect(r.specificTimeEligible).toBe(false);
  });
  it('shelf-only is eligible for the specific-time add-on', () => {
    const r = resolveOrderType([{ productId: 'cookies', size: 'Bottle (150g)', qty: 1 }], byId);
    expect(r.orderType).toBe('shelf');
    expect(r.needsSlot).toBe(false);
    expect(r.specificTimeEligible).toBe(true);
  });
});

describe('pricing', () => {
  const lines = (qty: number) => [{ productId: 'cookies', size: 'Bottle (150g)', qty }];

  it('below threshold charges $30 delivery', () => {
    const q = quote({ lines: lines(5), catalogById: byId, fulfilment: 'delivery', postal: '530000', orderType: 'shelf' });
    expect(q.subtotal).toBe(49); // 5 * 9.80
    expect(q.deliveryFee).toBe(30);
    expect(q.surcharge).toBe(0);
    expect(q.total).toBe(79);
  });

  it('free delivery threshold uses subtotal BEFORE discount', () => {
    const q = quote({
      lines: lines(16), // 16 * 9.80 = 156.80 >= 150
      catalogById: byId,
      fulfilment: 'delivery',
      postal: '530000',
      discount: { code: 'SOFNADE50', type: 'percent', value: 50 },
      orderType: 'shelf',
    });
    expect(q.subtotal).toBe(156.8);
    expect(q.freeDeliveryApplied).toBe(true);
    expect(q.deliveryFee).toBe(0);
    expect(q.discount).toBe(78.4);
    expect(q.total).toBe(78.4);
  });

  it('surcharge applies even when delivery is free', () => {
    const q = quote({ lines: lines(16), catalogById: byId, fulfilment: 'delivery', postal: '498765', orderType: 'shelf' });
    expect(q.deliveryFee).toBe(0);
    expect(q.surcharge).toBe(15);
    expect(q.total).toBe(171.8); // 156.80 + 15
  });

  it('specific-time add-on applies to shelf-only when selected', () => {
    const q = quote({ lines: lines(5), catalogById: byId, fulfilment: 'delivery', postal: '530000', orderType: 'shelf', specificTimeSelected: true });
    expect(q.specificTimeFee).toBe(30);
    expect(q.total).toBe(109); // 49 + 30 delivery + 30 add-on
  });

  it('pickup has no delivery fee or surcharge', () => {
    const q = quote({ lines: lines(5), catalogById: byId, fulfilment: 'pickup', postal: '498765', orderType: 'shelf' });
    expect(q.deliveryFee).toBe(0);
    expect(q.surcharge).toBe(0);
    expect(q.total).toBe(49);
  });

  it('free-delivery (shipping) code zeroes delivery but not the subtotal; surcharge still applies', () => {
    const q = quote({
      lines: lines(5), // 49, well below the 150 threshold
      catalogById: byId,
      fulfilment: 'delivery',
      postal: '498765', // surcharge prefix
      discount: { code: 'FREESHIP', type: 'shipping', value: 0 },
      orderType: 'shelf',
    });
    expect(q.discount).toBe(0); // no money off the subtotal
    expect(q.freeDeliveryApplied).toBe(true);
    expect(q.deliveryFee).toBe(0);
    expect(q.surcharge).toBe(15);
    expect(q.total).toBe(64); // 49 + 15 surcharge
  });

  it('CMS config can override the delivery fee and free-delivery threshold', () => {
    const q = quote({
      lines: lines(5), // 49
      catalogById: byId,
      fulfilment: 'delivery',
      postal: '530000',
      orderType: 'shelf',
      config: { standardDeliveryFee: 12, freeDeliveryThreshold: 40 },
    });
    // 49 >= 40 threshold -> free delivery, fee override never charged.
    expect(q.freeDeliveryApplied).toBe(true);
    expect(q.deliveryFee).toBe(0);
    expect(q.total).toBe(49);
  });
});

describe('catalog mapping (Sanity -> CatalogProduct)', () => {
  const raw = {
    id: 'lychee-mint-tea',
    title: 'Lychee Mint Tea',
    shortDesc: 'Sweet lychee and fresh mint.',
    category: 'Bubble Tea',
    categories: ['Bubble Tea'],
    imageRef: 'image-abc123-800x800-jpg',
    sizes: [{ label: 'Regular cup (500ml)', price: 3.6 }],
    addOnIds: ['pearls', null, 'grass-jelly'],
  };

  it('derives fresh kind from a fresh category and keeps non-null add-ons', () => {
    const p = mapProduct(raw);
    expect(p.kind).toBe('fresh');
    expect(p.addOnIds).toEqual(['pearls', 'grass-jelly']);
    expect(p.emoji).toBe('🧋');
    // No SANITY env in tests -> no CDN URL can be built.
    expect(p.image).toBeUndefined();
  });

  it('non-fresh categories map to shelf and drop empty add-on lists', () => {
    const p = mapProduct({ ...raw, category: 'Housebake Cookies', categories: ['Housebake Cookies'], addOnIds: [] });
    expect(p.kind).toBe('shelf');
    expect(p.addOnIds).toBeUndefined();
  });
});

describe('discount resolution (fallback, no Sanity)', () => {
  it('resolves the built-in code case-insensitively', async () => {
    const d = await resolveDiscount('sofnade50');
    expect(d).toEqual({ code: 'SOFNADE50', type: 'percent', value: 50 });
  });
  it('returns null for blank or unknown codes', async () => {
    expect(await resolveDiscount('')).toBeNull();
    expect(await resolveDiscount(null)).toBeNull();
    expect(await resolveDiscount('NOPE')).toBeNull();
  });
});

describe('pretty date', () => {
  it('formats weekday and day', () => {
    expect(prettyDate('2026-07-09')).toBe('Thu, 9 Jul');
  });
});
