// POST /api/quote
// Returns a delivery + fee preview for the current cart: earliest date,
// time slots (fresh) or window (shelf), the order-now message, and the
// itemised money breakdown. Read-only; safe to call as the cart changes.

import { getAddOnsById, getCatalogById } from '@/lib/catalog';
import { quote } from '@/lib/pricing';
import { resolveDiscount } from '@/lib/coupons';
import {
  earliestDeliveryDate,
  freshSlots,
  orderNowMessage,
  resolveOrderType,
  SCHEDULE_CONFIG,
} from '@/lib/schedule';
import type { CartLine, Fulfilment } from '@/lib/types';

export const runtime = 'nodejs';

interface Body {
  lines: CartLine[];
  fulfilment?: Fulfilment;
  postal?: string;
  code?: string;
  specificTimeSelected?: boolean;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return Response.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const [catalogById, addOnsById] = await Promise.all([getCatalogById(), getAddOnsById()]);
  const now = new Date();

  try {
    const { orderType, needsSlot, specificTimeEligible } = resolveOrderType(body.lines, catalogById);
    const q = quote({
      lines: body.lines,
      catalogById,
      addOnsById,
      fulfilment: body.fulfilment ?? 'delivery',
      postal: body.postal,
      discount: resolveDiscount(body.code),
      orderType,
      specificTimeSelected: body.specificTimeSelected,
    });

    return Response.json({
      schedule: {
        earliestDate: earliestDeliveryDate(now),
        message: orderNowMessage(now),
        orderType,
        needsSlot,
        specificTimeEligible,
        slots: needsSlot ? freshSlots() : [],
        window: needsSlot ? null : SCHEDULE_CONFIG.shelfWindow,
      },
      quote: q,
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}
