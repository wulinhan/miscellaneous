// POST /api/razorpay-webhook — verify the HMAC signature and mark the order
// paid. "Paid" is set only here, never from the browser. Raw body is required
// for signature verification, so body parsing is disabled.
const rp = require('./_lib/razorpay');

const handledEvents = new Set(); // idempotency (TODO: back with the DB)

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let raw = '';
  for await (const chunk of req) raw += chunk;
  const signature = req.headers['x-razorpay-signature'] || '';

  try {
    if (!rp.verifyWebhookSignature(raw, signature)) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (e) {
    return res.status(501).json({ error: e.message });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const eventId = event.id || `${event.event}:${event?.payload?.payment?.entity?.id || ''}`;
  if (handledEvents.has(eventId)) return res.status(200).json({ ok: true, duplicate: true });

  if (event.event === 'payment.captured') {
    // TODO: mark order paid in Supabase, mirror to Notion, send receipt (Resend).
  }

  handledEvents.add(eventId);
  return res.status(200).json({ ok: true });
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
