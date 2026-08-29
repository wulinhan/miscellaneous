// Meta Conversions API — the server-side twin of the browser pixel.
//
// The pixel alone loses a large share of conversions to ad blockers, ITP and
// iOS, so the money events are sent from here as well. Both sides send the
// SAME event_id, which is how Meta deduplicates them: one conversion, counted
// once, but recorded even when the browser call never fires.
//
// Customer data is SHA-256 hashed before it leaves this process. Meta requires
// a specific normalisation (trim + lowercase, phones in E.164 digits) before
// hashing or the hash simply will not match anything on their side.
//
// Every function no-ops when META_PIXEL_ID / META_CAPI_TOKEN are unset, so the
// store runs untouched without them.

const crypto = require('crypto');

const PIXEL_ID = process.env.META_PIXEL_ID || '';
const TOKEN = process.env.META_CAPI_TOKEN || '';
const TEST_CODE = process.env.META_TEST_EVENT_CODE || '';
const API_VERSION = process.env.META_API_VERSION || 'v21.0';

function isConfigured() {
  return Boolean(PIXEL_ID && TOKEN);
}

const sha256 = (v) => crypto.createHash('sha256').update(String(v)).digest('hex');

// Trim + lowercase, then hash. Empty in, null out (Meta rejects empty hashes).
function hashed(v) {
  const n = String(v == null ? '' : v).trim().toLowerCase();
  return n ? sha256(n) : null;
}

// Phones must be digits only, country code included. Local Singapore numbers
// are stored as 8 digits, so prefix 65 rather than sending an unmatchable hash.
function hashedPhone(v) {
  let d = String(v == null ? '' : v).replace(/\D/g, '');
  if (!d) return null;
  if (d.length === 8) d = '65' + d;
  return sha256(d);
}

// Split "Wu Lin Han" into first / last for the fn / ln parameters.
function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: '', last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

/* Build Meta's user_data block. Each hashed field is an extra chance to match
   the buyer to an account, so send everything the order actually has and omit
   the rest — nulls lower match quality rather than raise it. */
function userData(order, ctx) {
  const c = (order && order.customer) || {};
  const { first, last } = splitName(c.name);
  const out = {
    em: hashed(c.email),
    ph: hashedPhone(c.phone),
    fn: hashed(first),
    ln: hashed(last),
    zp: hashed(order && order.postal ? order.postal : c.postal),
    ct: hashed(c.city || 'singapore'),
    country: hashed('sg'),
  };
  const fb = (ctx && ctx.fb) || (order && order.quote && order.quote._fb) || {};
  if (fb.fbp) out.fbp = fb.fbp;
  if (fb.fbc) out.fbc = fb.fbc;
  if (fb.ip) out.client_ip_address = fb.ip;
  if (fb.ua) out.client_user_agent = fb.ua;
  Object.keys(out).forEach((k) => { if (!out[k]) delete out[k]; });
  return out;
}

// Cart contents in Meta's shape. `id` must match the catalog item id if a
// product feed is ever connected, so the product slug is used throughout.
function contentsOf(quote) {
  return ((quote && quote.items) || []).map((i) => ({
    id: i.productId,
    quantity: Number(i.qty || 0),
    item_price: Number(i.unitPrice || 0),
  }));
}

async function send(events) {
  if (!isConfigured() || !events.length) return { sent: false, reason: 'not configured' };
  const body = { data: events };
  if (TEST_CODE) body.test_event_code = TEST_CODE;

  const url = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Meta CAPI ${res.status}: ${text}`);
  return { sent: true, response: JSON.parse(text || '{}') };
}

/* One server event. `eventId` MUST equal the eventID the browser passed to
   fbq() for the same action, or the conversion is counted twice. */
function buildEvent(name, { eventId, order, quote, value, sourceUrl, ctx }) {
  const q = quote || (order && order.quote) || {};
  const ev = {
    event_name: name,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    user_data: userData(order, ctx),
    custom_data: {
      currency: q.currency || 'SGD',
      value: Number(value != null ? value : q.total || 0),
      content_type: 'product',
      contents: contentsOf(q),
    },
  };
  if (eventId) ev.event_id = eventId;
  if (sourceUrl) ev.event_source_url = sourceUrl;
  if (order && order.id) ev.custom_data.order_id = order.id;
  return ev;
}

/* Purchase. Fired from notify.onPaid so it runs exactly once per order,
   whichever of verify-payment / webhook gets there first. The order id is the
   event_id, which is also what the browser sends on the success screen. */
async function onPurchase(order, ctx) {
  if (!isConfigured()) return { sent: false, reason: 'not configured' };
  const q = (order && order.quote) || {};
  return send([buildEvent('Purchase', {
    eventId: order && order.id,
    order,
    quote: q,
    value: q.total != null ? q.total : order && order.amount_total,
    sourceUrl: (ctx && ctx.sourceUrl) || undefined,
    ctx,
  })]);
}

// InitiateCheckout, sent from /api/checkout where the customer details are
// already in hand. Deduplicated against the browser by the id it generated.
async function onInitiateCheckout(order, ctx) {
  if (!isConfigured()) return { sent: false, reason: 'not configured' };
  const q = (order && order.quote) || {};
  return send([buildEvent('InitiateCheckout', {
    eventId: ctx && ctx.eventId,
    order,
    quote: q,
    value: q.total,
    sourceUrl: ctx && ctx.sourceUrl,
    ctx,
  })]);
}

/* Pull the browser's Meta cookies and client hints off an incoming request.
   _fbp identifies the browser; _fbc carries the ad click id from fbclid. Both
   lift match quality materially, so they are stored with the order for the
   webhook path, which has no request of its own. */
function contextFromRequest(req) {
  const cookie = (req && req.headers && req.headers.cookie) || '';
  const pick = (n) => {
    const m = cookie.match(new RegExp('(?:^|;\\s*)' + n + '=([^;]+)'));
    return m ? decodeURIComponent(m[1]) : '';
  };
  const fwd = (req && req.headers && req.headers['x-forwarded-for']) || '';
  return {
    fbp: pick('_fbp'),
    fbc: pick('_fbc'),
    ip: String(fwd).split(',')[0].trim(),
    ua: (req && req.headers && req.headers['user-agent']) || '',
  };
}

module.exports = {
  isConfigured, onPurchase, onInitiateCheckout, contextFromRequest,
  // exported for tests
  hashed, hashedPhone, userData, contentsOf, buildEvent,
};
