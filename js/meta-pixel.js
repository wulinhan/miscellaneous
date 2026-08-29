/* =========================================================================
   META PIXEL
   Base snippet plus typed helpers for the events that matter to the store.
   The id lives in js/config.js; with it empty every call below is a no-op,
   so the storefront behaves exactly as before when no pixel is configured.

   Events that also go through the Conversions API (InitiateCheckout and
   Purchase) pass an eventID. The server sends the SAME id, which is how Meta
   collapses the pair into one conversion instead of counting it twice.
   ========================================================================= */

(function () {
  const CFG = window.META_CONFIG || {};
  const PIXEL_ID = CFG.pixelId || '';

  if (PIXEL_ID) {
    /* Meta's standard loader, verbatim apart from formatting. */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  const on = () => Boolean(PIXEL_ID && window.fbq);

  /* Random id shared with the server copy of the same event. crypto.randomUUID
     is unavailable on http:// origins, hence the fallback. */
  function newEventId(prefix) {
    const rand = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    return (prefix ? prefix + '.' : '') + rand;
  }

  function track(name, params, eventId) {
    if (!on()) return;
    try {
      if (eventId) window.fbq('track', name, params || {}, { eventID: eventId });
      else window.fbq('track', name, params || {});
    } catch (e) {
      /* Analytics must never break a purchase. */
      console.warn('[meta] ' + name + ' failed:', e.message);
    }
  }

  /* content_ids use the product slug so they line up with a Meta catalogue
     feed if one is ever connected. */
  const idsOf = (lines) => lines.map((l) => l.productId || l.id).filter(Boolean);

  /* Relay an event to the Conversions API so it survives ad blockers. Fired
     and forgotten: the shopper never waits on it, and a static host with no
     /api simply 404s, which we swallow. keepalive lets the request finish even
     if the click navigates away. */
  function relay(name, eventId, lines) {
    if (!on()) return;
    try {
      fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ event: name, eventId, lines, sourceUrl: location.href }),
      }).catch(() => {});
    } catch (e) { /* never let analytics break the cart */ }
  }

  const Meta = {
    enabled: on,
    newEventId,
    track,

    viewContent(product, price) {
      if (!product) return;
      track('ViewContent', {
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
        value: Number(price || product.price || 0),
        currency: 'SGD',
      });
    },

    /* Fired on both sides. The cart never touches the server, so the server
       copy has to be relayed through /api/meta-event under the same event id.
       `line` is the cart line in /api/checkout's shape, which lets the server
       re-price it from the catalog instead of trusting the browser. */
    addToCart(product, qty, price, line) {
      if (!product) return;
      const eventId = newEventId('atc');
      track('AddToCart', {
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
        contents: [{ id: product.id, quantity: Number(qty || 1), item_price: Number(price || 0) }],
        value: Number(price || 0) * Number(qty || 1),
        currency: 'SGD',
      }, eventId);
      relay('AddToCart', eventId, line ? [line] : [{ productId: product.id, qty: Number(qty || 1) }]);
    },

    /* Returns the event id so the caller can hand it to /api/checkout, which
       replays the same event server-side under that id. */
    initiateCheckout(lines, value) {
      const eventId = newEventId('ic');
      track('InitiateCheckout', {
        content_ids: idsOf(lines || []),
        content_type: 'product',
        contents: (lines || []).map((l) => ({
          id: l.productId, quantity: Number(l.qty || 1), item_price: Number(l.unitPrice || 0),
        })),
        num_items: (lines || []).reduce((n, l) => n + Number(l.qty || 0), 0),
        value: Number(value || 0),
        currency: 'SGD',
      }, eventId);
      return eventId;
    },

    /* The order id doubles as the event id: unique per sale, and known to the
       server without having to pass anything back. */
    purchase(orderId, value, lines) {
      track('Purchase', {
        content_ids: idsOf(lines || []),
        content_type: 'product',
        contents: (lines || []).map((l) => ({
          id: l.productId, quantity: Number(l.qty || 1), item_price: Number(l.unitPrice || 0),
        })),
        num_items: (lines || []).reduce((n, l) => n + Number(l.qty || 0), 0),
        value: Number(value || 0),
        currency: 'SGD',
        order_id: orderId || undefined,
      }, orderId || newEventId('pur'));
    },
  };

  window.Meta = Meta;
})();
