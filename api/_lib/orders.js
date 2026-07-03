// Order persistence via Supabase REST (PostgREST). No SDK — plain fetch, to
// match the rest of api/_lib. Every function no-ops gracefully when Supabase is
// not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY), so the store keeps
// working in test mode exactly as before.

const notify = require('./notify');

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
    payment_method: record.paymentMethod === 'vendors_sg' ? 'vendors_sg' : 'card',
    razorpay_order_id: record.razorpayOrderId || null,
    status_history: [{ status: 'created', at: new Date().toISOString(), by: 'system' }],
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
  const row = Array.isArray(rows) && rows.length ? rows[0] : null;
  // Log the paid transition (best-effort; the atomic flip above already stands).
  if (row) {
    try {
      const hist = Array.isArray(row.status_history) ? row.status_history.slice() : [];
      hist.push({ status: 'paid', at: new Date().toISOString(), by: 'payment' });
      await fetch(`${base()}?id=eq.${encodeURIComponent(row.id)}`, {
        method: 'PATCH',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify({ status_history: hist }),
      });
      row.status_history = hist;
    } catch (e) {
      console.error('[orders] paid history append failed:', e.message);
    }
  }
  return row;
}

// ---- Staff admin reads/writes ---------------------------------------------

// Newest-first list, optionally filtered by status. `archived` controls which
// rows come back: 'no' (default, active only), 'only' (archived only), or 'all'.
// Returns [] if unconfigured.
async function listOrders({ status, limit = 200, archived = 'no' } = {}) {
  if (!isConfigured()) return [];
  const lim = Math.min(Number(limit) || 200, 500);
  let url = `${base()}?select=*&order=created_at.desc&limit=${lim}`;
  if (status) url += `&status=eq.${encodeURIComponent(status)}`;
  if (archived === 'only') url += `&archived=is.true`;
  else if (archived !== 'all') url += `&archived=is.false`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase list ${res.status}: ${await res.text()}`);
  return res.json();
}

// Permanently remove one order. Returns true if the row was deleted, false if
// unconfigured / not found. Irreversible — the admin UI gates this behind a
// typed confirmation.
async function deleteOrder(id) {
  if (!isConfigured() || !id) return false;
  const url = `${base()}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers({ Prefer: 'return=representation' }),
  });
  if (!res.ok) throw new Error(`Supabase delete ${res.status}: ${await res.text()}`);
  const rows = await res.json().catch(() => []);
  return Array.isArray(rows) && rows.length > 0;
}

async function getOne(id) {
  const url = `${base()}?id=eq.${encodeURIComponent(id)}&select=status,status_history&limit=1`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase get ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

// Update a whitelisted set of fields for one order. Returns the updated row, or
// null if not found / unconfigured. Stamps updated_at, and appends to
// status_history when the status actually changes (meta.by = who changed it).
const EDITABLE = ['status', 'staff_notes', 'delivery_date', 'slot_or_window', 'fulfilment', 'preparer', 'driver', 'archived'];
async function updateOrder(id, patch, meta = {}) {
  if (!isConfigured() || !id) return null;
  const set = {};
  for (const k of EDITABLE) if (patch[k] !== undefined) set[k] = patch[k];
  const now = new Date().toISOString();
  set.updated_at = now;

  let prevStatus = null;
  if (patch.status !== undefined) {
    const cur = await getOne(id);
    if (!cur) return null;
    prevStatus = cur.status;
    if (patch.status !== cur.status) {
      const hist = Array.isArray(cur.status_history) ? cur.status_history.slice() : [];
      hist.push({ status: patch.status, at: now, by: meta.by || null });
      set.status_history = hist;
    }
  }

  const url = `${base()}?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: headers({ Prefer: 'return=representation' }),
    body: JSON.stringify(set),
  });
  if (!res.ok) throw new Error(`Supabase update ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  const row = Array.isArray(rows) && rows.length ? rows[0] : null;

  // When staff mark an order Paid (and it wasn't already), fire the receipt +
  // Notion mirror. Best-effort; never blocks the update. No-ops if Resend/Notion
  // aren't configured.
  if (row && patch.status === 'paid' && prevStatus !== 'paid') {
    try { await notify.onPaid(row); } catch (e) { console.error('[orders] onPaid failed:', e.message); }
  }
  return row;
}

// ---- Staff roster (for Preparer/Driver dropdowns) -------------------------

function staffBase() {
  return `${process.env.SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/staff`;
}

async function listStaff() {
  if (!isConfigured()) return [];
  const res = await fetch(`${staffBase()}?select=name&active=eq.true&order=name.asc`, { headers: headers() });
  if (!res.ok) throw new Error(`Supabase staff list ${res.status}: ${await res.text()}`);
  const rows = await res.json();
  return rows.map((r) => r.name).filter(Boolean);
}

// Add a name (idempotent upsert on the name PK). Returns the refreshed list.
async function addStaff(name) {
  const clean = String(name || '').trim();
  if (!isConfigured() || !clean) return listStaff();
  const res = await fetch(`${staffBase()}?on_conflict=name`, {
    method: 'POST',
    headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
    body: JSON.stringify({ name: clean, active: true }),
  });
  if (!res.ok) throw new Error(`Supabase staff add ${res.status}: ${await res.text()}`);
  return listStaff();
}

module.exports = { isConfigured, insertPending, markPaid, listOrders, updateOrder, deleteOrder, listStaff, addStaff };
