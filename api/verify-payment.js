// POST /api/verify-payment — verify the Razorpay checkout handler signature
// before showing the customer a success screen. The webhook remains the
// authoritative "paid" signal; this is the immediate, tamper-proof UX check.
const rp = require('./_lib/razorpay');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }
    const ok = rp.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    // TODO: on ok, optimistically mark the order paid; the webhook confirms it.
    return res.status(ok ? 200 : 400).json({ ok });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
