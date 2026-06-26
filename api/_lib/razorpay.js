// Razorpay server helpers. Secrets come from environment variables only.
const crypto = require('crypto');

function isConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function publicKeyId() {
  return process.env.RAZORPAY_KEY_ID;
}

async function createOrder(amountMinor, currency, receipt) {
  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountMinor, currency, receipt, payment_capture: 1 }),
  });
  if (!res.ok) throw new Error(`Razorpay order create failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function verifyWebhookSignature(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not set');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = { isConfigured, publicKeyId, createOrder, verifyWebhookSignature };
