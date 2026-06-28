// POST /api/razorpay-webhook — verify the HMAC signature and mark the order
// paid. "Paid" is set only here (and the equally-verified /verify-payment),
// never from an unverified browser call. Raw body is required for signature
// verification, so body parsing is disabled.
const rp = require('./_lib/razorpay');
const orders = require('./_lib/orders');
const notify = require('./_lib/notify');

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

  try {
    if (event.event === 'payment.captured') {
      const entity = (event.payload && event.payload.payment && event.payload.payment.entity) || {};
      // markPaid is idempotent (created -> paid once), so duplicate webhook
      // deliveries return null here and skip re-notifying.
      const order = await orders.markPaid(entity.order_id, entity.id);
      if (order) await notify.onPaid(order); // onPaid never throws
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    // A DB error here is transient — return non-2xx so Razorpay retries later.
    console.error('[webhook] processing failed:', e.message);
    return res.status(500).json({ error: 'processing failed' });
  }
}

module.exports = handler;
module.exports.config = { api: { bodyParser: false } };
