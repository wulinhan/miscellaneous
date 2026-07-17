// POST /api/verify-payment — verify the Razorpay checkout handler signature
// before showing the customer a success screen. This is the immediate path:
// on a valid signature we mark the order paid and fire notifications. The
// webhook is the server-to-server backstop; the markPaid() guard ensures the
// order is recorded + notified exactly once whichever arrives first.
const rp = require('./_lib/razorpay');
const orders = require('./_lib/orders');
const notify = require('./_lib/notify');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }
    const ok = rp.verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (ok) {
      // Best-effort: never let bookkeeping/notification failures block the
      // customer's success screen. The webhook will retry the same work.
      let order = null;
      let dbFailed = false;
      try {
        order = await orders.markPaid(razorpay_order_id, razorpay_payment_id);
      } catch (e) {
        dbFailed = true;
        console.error('[verify-payment] record failed:', e.message);
      }
      try {
        if (order) {
          await notify.onPaid(order);
        } else if (body.order && body.order.id && (dbFailed || !orders.isConfigured())) {
          // The order DB is down or unset, so there is no row to notify from —
          // fall back to the checkout snapshot (its quote was priced by
          // /api/checkout, and the signature check above proves the payment is
          // genuine). Only on DB failure: a healthy-DB null means the webhook
          // already handled this payment, and we must not email twice.
          await notify.onPaid(Object.assign({}, body.order, {
            status: 'paid',
            payment_method: 'card',
            razorpay_order_id,
            razorpay_payment_id,
          }));
        }
      } catch (e) {
        console.error('[verify-payment] notify failed:', e.message);
      }
    }
    return res.status(ok ? 200 : 400).json({ ok });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
