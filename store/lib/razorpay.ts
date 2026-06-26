// Razorpay server-side client. Creates orders and verifies webhook
// signatures. Secrets come from environment variables only.

import crypto from 'node:crypto';

export class NotConfiguredError extends Error {}

function creds() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new NotConfiguredError('Razorpay keys are not set (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET).');
  }
  return { keyId, keySecret };
}

export function isRazorpayConfigured(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

/**
 * Create a Razorpay order. amountMinor is in the smallest currency unit
 * (cents for SGD). Uses the REST API directly to avoid an SDK dependency.
 */
export async function createOrder(
  amountMinor: number,
  currency: string,
  receipt: string,
): Promise<RazorpayOrder> {
  const { keyId, keySecret } = creds();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountMinor, currency, receipt, payment_capture: 1 }),
  });
  if (!res.ok) {
    throw new Error(`Razorpay order create failed: ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as RazorpayOrder;
}

/** Verify a Razorpay webhook signature (HMAC-SHA256 of the raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new NotConfiguredError('RAZORPAY_WEBHOOK_SECRET is not set.');
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  // Constant-time comparison.
  const a = Buffer.from(expected);
  const b = Buffer.from(signature || '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** The public key id, safe to expose to the browser checkout widget. */
export function publicKeyId(): string {
  return creds().keyId;
}
