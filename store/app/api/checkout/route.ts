// POST /api/checkout
// Validates the cart, recomputes every amount server-side, creates a
// Razorpay order, persists a pending order, and returns what the browser
// needs to open the Razorpay widget. The amount is NEVER taken from the client.

import { getAddOnsById, getCatalogById } from '@/lib/catalog';
import { quote } from '@/lib/pricing';
import { resolveDiscount } from '@/lib/coupons';
import { resolveOrderType, earliestDeliveryDate } from '@/lib/schedule';
import {
  createOrder,
  isRazorpayConfigured,
  NotConfiguredError,
  publicKeyId,
} from '@/lib/razorpay';
import { insertOrder, type OrderRecord } from '@/lib/db';
import type { CartLine, CustomerDetails, Fulfilment } from '@/lib/types';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

interface Body {
  lines: CartLine[];
  customer: CustomerDetails;
  fulfilment: Fulfilment;
  deliveryDate?: string;
  slotOrWindow?: string;
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
  if (!body.customer?.name || !body.customer?.phone || !body.customer?.email) {
    return Response.json({ error: 'Missing customer details' }, { status: 400 });
  }
  if (body.fulfilment === 'delivery' && !body.customer.postal) {
    return Response.json({ error: 'Delivery requires a postal code' }, { status: 400 });
  }

  const [catalogById, addOnsById] = await Promise.all([getCatalogById(), getAddOnsById()]);

  let q;
  let orderType;
  try {
    const resolved = resolveOrderType(body.lines, catalogById);
    orderType = resolved.orderType;
    q = quote({
      lines: body.lines,
      catalogById,
      addOnsById,
      fulfilment: body.fulfilment,
      postal: body.customer.postal,
      discount: resolveDiscount(body.code),
      orderType,
      specificTimeSelected: body.specificTimeSelected,
    });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }

  const orderId = `SOF-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(2)
    .toString('hex')
    .toUpperCase()}`;

  const record: OrderRecord = {
    id: orderId,
    status: 'created',
    customer: body.customer,
    fulfilment: body.fulfilment,
    orderType,
    deliveryDate: body.deliveryDate ?? earliestDeliveryDate(new Date()),
    slotOrWindow: body.slotOrWindow,
    quote: q,
    createdAt: new Date().toISOString(),
  };

  // Create the Razorpay order when configured; otherwise return a dry quote so
  // the route is demonstrable without keys.
  if (!isRazorpayConfigured()) {
    await insertOrder(record);
    return Response.json({
      orderId,
      quote: q,
      payment: { configured: false, note: 'Razorpay keys not set; returning computed quote only.' },
    });
  }

  try {
    const rp = await createOrder(q.amountMinor, q.currency, orderId);
    record.razorpayOrderId = rp.id;
    await insertOrder(record);
    return Response.json({
      orderId,
      quote: q,
      payment: {
        configured: true,
        razorpayOrderId: rp.id,
        keyId: publicKeyId(),
        amount: rp.amount,
        currency: rp.currency,
      },
    });
  } catch (err) {
    const status = err instanceof NotConfiguredError ? 501 : 502;
    return Response.json({ error: (err as Error).message }, { status });
  }
}
