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

    addToCart(product, qty, price) {
      if (!product) return;
      track('AddToCart', {
        content_ids: [product.id],
        content_name: product.title,
        content_type: 'product',
        contents: [{ id: product.id, quantity: Number(qty || 1), item_price: Number(price || 0) }],
        value: Number(price || 0) * Number(qty || 1),
        currency: 'SGD',
      });
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
