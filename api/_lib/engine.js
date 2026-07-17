// Server-side order engine. Prices from the SAME content the customer sees:
// Sanity CMS when reachable, otherwise the bundled data/products.js. Both are
// merged so checkout totals can never drift from the storefront.

const builtin = require('../../data/products.js'); // { PRODUCTS, ADDONS, SETTINGS, DISCOUNT_CODES }
const sanity = require('./sanity.js');

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// ---- Store loading (Sanity with built-in fallback, cached) ----------------

let _cache = null;
let _cacheAt = 0;
const TTL_MS = 60000;

async function getStore() {
  const now = Date.now();
  if (_cache && now - _cacheAt < TTL_MS) return _cache;

  let store = {
    PRODUCTS: builtin.PRODUCTS || [],
    ADDONS: builtin.ADDONS || {},
    SETTINGS: builtin.SETTINGS || {},
    DISCOUNT_CODES: builtin.DISCOUNT_CODES || {},
  };

  try {
    const s = await sanity.fetchStore();
    if (s && Array.isArray(s.products) && s.products.length) {
      store = {
        PRODUCTS: s.products,
        ADDONS: Object.keys(s.addons || {}).length ? s.addons : store.ADDONS,
        // Keep built-in surcharge / fresh / specific-time config; let the CMS
        // override the basic editable fields (fees, threshold, lead time).
        SETTINGS: Object.assign({}, store.SETTINGS, s.settings || {}),
        DISCOUNT_CODES: Object.keys(s.discountCodes || {}).length ? s.discountCodes : store.DISCOUNT_CODES,
      };
    }
  } catch (e) {
    // Sanity not configured / private / empty / unreachable: use built-in.
  }

  _cache = store;
  _cacheAt = now;
  return store;
}

// ---- Pricing (pure; mirrors checkout.html) --------------------------------

function priceOrder(store, { lines, fulfilment = 'delivery', postal, code, specificTimeOn = false }) {
  const { PRODUCTS, ADDONS, SETTINGS, DISCOUNT_CODES } = store;

  const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || null;

  const sizePrice = (product, label) => {
    if (product.sizes && product.sizes.length) {
      const s = product.sizes.find((x) => x.label === label);
      return s ? s.price : product.sizes[0].price;
    }
    return product.price || 0;
  };

  const unitPrice = (line, product) => {
    let p = sizePrice(product, line.size);
    for (const id of line.addOns || line.addons || []) if (ADDONS[id]) p += ADDONS[id].price;
    return round2(p);
  };

  const isFresh = (product) => {
    if (!product) return false;
    if (product.fresh === true) return true;
    const fresh = SETTINGS.freshCategories || ['Bubble Tea'];
    return (product.tags || []).some((t) => fresh.includes(t));
  };

  const surchargeFor = (pc) => {
    const prefixes = SETTINGS.surchargePrefixes || [];
    const p = (pc || '').slice(0, 2);
    return p.length === 2 && prefixes.includes(p) ? (SETTINGS.surchargeFee || 0) : 0;
  };

  const items = [];
  for (const l of lines) {
    const product = getProduct(l.productId);
    if (!product) throw new Error(`Unknown product "${l.productId}"`);
    const unit = unitPrice(l, product);
    // Carry every chosen option so receipts/admin can show the full line.
    const addonTitles = (l.addOns || l.addons || [])
      .map((id) => (ADDONS[id] ? ADDONS[id].title : null))
      .filter(Boolean);
    items.push({
      productId: l.productId,
      title: product.title,
      size: l.size,
      sugar: l.sugar || '',
      addons: addonTitles,
      qty: l.qty,
      unitPrice: unit,
      lineTotal: round2(unit * l.qty),
    });
  }
  const subtotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));

  const appliedCode = code ? String(code).trim().toUpperCase() : null;
  const c = appliedCode ? DISCOUNT_CODES[appliedCode] : null;
  let discount = 0;
  if (c) {
    if (c.type === 'percent') discount = round2((subtotal * c.value) / 100);
    else if (c.type === 'fixed') discount = round2(Math.min(subtotal, c.value));
  }
  const discountedSubtotal = round2(Math.max(0, subtotal - discount));

  const fresh = lines.some((l) => isFresh(getProduct(l.productId)));
  let deliveryFee = 0;
  let surcharge = 0;
  let specificTime = 0;
  let freeDeliveryApplied = false;

  if (fulfilment === 'delivery') {
    const threshold = SETTINGS.freeDeliveryThreshold ?? 150;
    const fee = SETTINGS.deliveryFee ?? 30;
    freeDeliveryApplied = subtotal >= threshold || appliedCode === 'FREESHIP';
    deliveryFee = subtotal === 0 || freeDeliveryApplied ? 0 : fee;
    surcharge = surchargeFor(postal);
    const addon = SETTINGS.specificTimeAddon || { fee: 30 };
    if (specificTimeOn && !fresh) specificTime = addon.fee;
  }

  const total = round2(discountedSubtotal + deliveryFee + surcharge + specificTime);

  return {
    items,
    subtotal,
    discountCode: c ? appliedCode : null,
    discount,
    discountedSubtotal,
    deliveryFee,
    surcharge,
    specificTimeFee: specificTime,
    total,
    currency: 'SGD',
    amountMinor: Math.round(total * 100),
    orderType: fresh ? 'fresh' : 'shelf',
    freeDeliveryApplied,
    surchargeApplied: surcharge > 0,
  };
}

module.exports = { getStore, priceOrder };
