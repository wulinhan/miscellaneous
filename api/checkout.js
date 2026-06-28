// POST /api/checkout — recompute the total server-side from the catalog,
// create a Razorpay order, and return what the browser needs to pay. The
// amount is never taken from the client.
const crypto = require('crypto');
const { getStore, priceOrder } = require('./_lib/engine');
const rp = require('./_lib/razorpay');
const orders = require('./_lib/orders');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { lines, customer, fulfilment = 'delivery', code, specificTimeOn, date, slotOrWindow } = body;

    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (!customer || !customer.name || !customer.phone || !customer.email) {
      return res.status(400).json({ error: 'Missing customer details' });
    }
    const postal = body.postal || customer.postal;
    if (fulfilment === 'delivery' && !postal) {
      return res.status(400).json({ error: 'Delivery requires a postal code' });
    }

    const store = await getStore();
    const quote = priceOrder(store, { lines, fulfilment, postal, code, specificTimeOn });
    const orderId =
      'SOF-' + Date.now().toString(36).toUpperCase() + '-' + crypto.randomBytes(2).toString('hex').toUpperCase();

    let payment;
    let razorpayOrderId = null;
    if (rp.isConfigured()) {
      // Razorpay test mode on a standard (India) account usually only accepts INR.
      // Set RAZORPAY_CURRENCY=INR for testing; defaults to the order currency (SGD).
      const currency = process.env.RAZORPAY_CURRENCY || quote.currency;
      const order = await rp.createOrder(quote.amountMinor, currency, orderId);
      razorpayOrderId = order.id;
      payment = {
        configured: true,
        razorpayOrderId: order.id,
        keyId: rp.publicKeyId(),
        amount: order.amount,
        currency: order.currency,
      };
    } else {
      payment = { configured: false, note: 'Razorpay keys not set; running in test mode.' };
    }

    // Persist a pending order (status: created) so a later payment can be matched
    // and fulfilled. Best-effort: a logging hiccup must not block the sale — the
    // webhook is still the authoritative "paid" signal. No-ops if Supabase is unset.
    try {
      await orders.insertPending({
        id: orderId,
        customer,
        fulfilment,
        postal,
        date,
        slotOrWindow,
        quote,
        razorpayOrderId,
      });
    } catch (e) {
      console.error('[checkout] order persist failed:', e.message);
    }

    return res.status(200).json({ orderId, quote, schedule: { date, slotOrWindow }, payment });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
