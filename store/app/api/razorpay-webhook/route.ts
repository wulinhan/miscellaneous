// POST /api/razorpay-webhook
// Razorpay calls this server-to-server. We verify the HMAC signature, and on
// a captured payment we mark the order paid, mirror it to Notion, and (TODO)
// email the receipt. "Paid" is set ONLY here, never from the browser.

import { verifyWebhookSignature, NotConfiguredError } from '@/lib/razorpay';
import { markOrderPaid } from '@/lib/db';

export const runtime = 'nodejs';

// Idempotency: remember handled event ids. TODO: back this with the DB so it
// survives restarts and scales across instances.
const handledEvents = new Set<string>();

export async function POST(req: Request) {
  const raw = await req.text(); // raw body required for signature verification
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  try {
    if (!verifyWebhookSignature(raw, signature)) {
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (err) {
    const status = err instanceof NotConfiguredError ? 501 : 400;
    return Response.json({ error: (err as Error).message }, { status });
  }

  let event: {
    event: string;
    id?: string;
    payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventId = event.id ?? `${event.event}:${event.payload?.payment?.entity?.id ?? ''}`;
  if (handledEvents.has(eventId)) {
    return Response.json({ ok: true, duplicate: true });
  }

  if (event.event === 'payment.captured') {
    const entity = event.payload?.payment?.entity;
    if (entity?.order_id && entity?.id) {
      await markOrderPaid(entity.order_id, entity.id);
      // TODO: load the order, mirrorOrderToNotion(order), send receipt (Resend).
    }
  }

  handledEvents.add(eventId);
  return Response.json({ ok: true });
}
