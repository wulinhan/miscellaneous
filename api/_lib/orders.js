// Order persistence via Supabase REST (PostgREST). No SDK — plain fetch, to
// match the rest of api/_lib. Every function no-ops gracefully when Supabase is
// not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY), so the store keeps
// working in test mode exactly as before.

function isConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function base() {
  return `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/orders`;
}

function headers(extra) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Object.assign(
    { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    extra || {},
  );
}

// Save a pending order at checkout time. Returns true if written, false if
// Supabase is not configured. Throws on a real API error (caller decides).
async function insertPending(record) {
  if (!isConfigured()) return false;
  const q = record.quote || {};
  const row = {
    id: record.id,
    status: 'created',
    customer: record.customer || null,
    fulfilment: record.fulfilment || null,
    postal: record.postal || null,
    delivery_date: record.date || null,
    slot_or_window: record.slotOrWindow || null,
    quote: q,
    amount_total: q.total ?? null,
    currency: q.currency || 'SGD',
    razorpay_order_id: record.razorpayOrderId || null,
  };
  const res = await fetch(base(), {
    method: 'POST',
    headers: headers({ Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  });
  if (!res.ok) throw new Error(`Supabase insert ${res.status}: ${await res.text()}`);
  return true;
}

// Atomically flip a 'created' order to 'paid'. The `status=eq.created` filter is
// the idempotency guard: only the FIRST caller (verify-payment OR the webhook)
// matches and gets the row back, so notifications fire exactly once. Returns the
// updated order row, or null if it was already paid / not found / unconfigured.
async function markPaid(razorpayOrderId, paymentId) {
  if (!isConfigured() || !razorpayOrderId) return null;
  const url =
    `${base()}?razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}&status=eq.created`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify({
      status: 'paid',
      razorpay_payment_id: paymentId || null,
      paid_at: new Date().toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Supabase update ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

module.exports = { isConfigured, insertPending, markPaid };
