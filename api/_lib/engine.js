// Server-side order engine. Reuses the EXACT same catalog, settings and
// discount codes as the storefront (data/products.js), so the total computed
// here always matches what the customer saw. This is the authoritative money.

const store = require('../../data/products.js');
const PRODUCTS = store.PRODUCTS || [];
const ADDONS = store.ADDONS || {};
const SETTINGS = store.SETTINGS || {};
const DISCOUNT_CODES = store.DISCOUNT_CODES || {};

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

function sizePrice(product, sizeLabel) {
  if (product.sizes && product.sizes.length) {
    const s = product.sizes.find((x) => x.label === sizeLabel);
    if (s) return s.price;
    return product.sizes[0].price;
  }
  return product.price || 0;
}

function unitPrice(line, product) {
  let p = sizePrice(product, line.size);
  for (const id of line.addOns || line.addons || []) {
    if (ADDONS[id]) p += ADDONS[id].price;
  }
  return round2(p);
}

function isFresh(product) {
  if (!product) return false;
  if (product.fresh === true) return true;
  const fresh = SETTINGS.freshCategories || ['Bubble Tea'];
  return (product.tags || []).some((t) => fresh.includes(t));
}

function orderIsFresh(lines) {
  return lines.some((l) => isFresh(getProduct(l.productId)));
}

function surchargeFor(postal) {
  const prefixes = SETTINGS.surchargePrefixes || [];
  const p = (postal || '').slice(0, 2);
  return p.length === 2 && prefixes.includes(p) ? (SETTINGS.surchargeFee || 0) : 0;
}

/**
 * Recompute the order total from the cart. Mirrors checkout.html's
 * computeStandardShip / computeSurcharge / computeSpecificTime / computeDiscount.
 */
function priceOrder({ lines, fulfilment = 'delivery', postal, code, specificTimeOn = false }) {
  const items = [];
  for (const l of lines) {
    const product = getProduct(l.productId);
    if (!product) throw new Error(`Unknown product "${l.productId}"`);
    const unit = unitPrice(l, product);
    items.push({
      productId: l.productId,
      title: product.title,
      size: l.size,
      qty: l.qty,
      unitPrice: unit,
      lineTotal: round2(unit * l.qty),
    });
  }
  const subtotal = round2(items.reduce((s, i) => s + i.lineTotal, 0));

  // Discount
  const appliedCode = code ? String(code).trim().toUpperCase() : null;
  const c = appliedCode ? DISCOUNT_CODES[appliedCode] : null;
  let discount = 0;
  if (c) {
    if (c.type === 'percent') discount = round2((subtotal * c.value) / 100);
    else if (c.type === 'fixed') discount = round2(Math.min(subtotal, c.value));
  }
  const discountedSubtotal = round2(Math.max(0, subtotal - discount));

  // Delivery, surcharge, specific-time
  const fresh = orderIsFresh(lines);
  let standardShip = 0;
  let surcharge = 0;
  let specificTime = 0;
  let freeDeliveryApplied = false;

  if (fulfilment === 'delivery') {
    const threshold = SETTINGS.freeDeliveryThreshold ?? 150;
    const fee = SETTINGS.deliveryFee ?? 30;
    freeDeliveryApplied = subtotal >= threshold || appliedCode === 'FREESHIP';
    standardShip = subtotal === 0 || freeDeliveryApplied ? 0 : fee;

    surcharge = surchargeFor(postal);

    const addon = SETTINGS.specificTimeAddon || { fee: 30 };
    if (specificTimeOn && !fresh) specificTime = addon.fee;
  }

  const total = round2(discountedSubtotal + standardShip + surcharge + specificTime);

  return {
    items,
    subtotal,
    discountCode: c ? appliedCode : null,
    discount,
    discountedSubtotal,
    deliveryFee: standardShip,
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

module.exports = { priceOrder, orderIsFresh, getProduct, isFresh, SETTINGS };
