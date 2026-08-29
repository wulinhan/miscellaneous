// POST /api/meta-event — relay a browser event to the Conversions API.
//
// Cart actions never reach the server: the cart lives in localStorage, so
// "add to cart" is a purely client-side act. Without this endpoint AddToCart
// could only ever exist as a browser pixel event, and would vanish for anyone
// running an ad blocker. The browser sends the event id it already gave fbq(),
// and Meta deduplicates the pair on that id.
//
// The value is RE-PRICED here from the catalog rather than trusted from the
// request, the same rule /api/checkout follows. A spoofed body should not be
// able to write fictional revenue into an ad account's optimisation data.

const meta = require('./_lib/meta');
const { getStore, priceOrder } = require('./_lib/engine');

// Only events the storefront actually sends. Without this, the endpoint is an
// open relay into the ad account for anyone who finds the URL.
const ALLOWED = new Set(['AddToCart', 'ViewContent']);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Never block or slow the shopper: this endpoint answers 200 for anything
  // it cannot act on, and the browser fires it without awaiting the result.
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const name = String(body.event || '');
    if (!ALLOWED.has(name)) return res.status(400).json({ error: 'Unsupported event' });
    if (!meta.isConfigured()) return res.status(200).json({ ok: true, sent: false, reason: 'not configured' });

    // Re-price from the catalog. Falls back to a contents-only event if the
    // line cannot be priced (a stale cart, or a product needing options the
    // listing-card quick-add does not collect) rather than dropping the event.
    let quote = null;
    let value = null;
    const lines = Array.isArray(body.lines) ? body.lines : [];
    if (lines.length) {
      try {
        const store = await getStore();
        quote = await priceOrder(store, { lines, fulfilment: 'pickup' });
        value = quote.subtotal;
      } catch (e) {
        quote = {
          currency: 'SGD',
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty, unitPrice: 0 })),
        };
        value = 0;
      }
    }

    const ctx = meta.contextFromRequest(req);
    await meta.onClientEvent(name, {
      eventId: body.eventId,
      quote,
      value,
      sourceUrl: body.sourceUrl || req.headers.referer || undefined,
      ctx,
    });
    return res.status(200).json({ ok: true, sent: true, value });
  } catch (e) {
    console.error('[meta-event] relay failed:', e.message);
    return res.status(200).json({ ok: false, error: e.message });
  }
};
