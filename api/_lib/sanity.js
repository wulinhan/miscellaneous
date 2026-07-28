// Server-side Sanity reader. Mirrors the browser's js/store-data.js query so
// the checkout engine prices from the same CMS content the customer sees.
// Defaults to the same project as js/config.js; overridable via env. If the
// dataset is private/empty/unreachable, the caller falls back to built-in data.

const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'mkxfjwwf';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2023-10-01';
const READ_TOKEN = process.env.SANITY_READ_TOKEN || '';

const QUERY = `{
  "settings": *[_type == "siteSettings"][0]{
    deliveryFee, freeDeliveryThreshold, pickupEnabled, leadBusinessDays
  },
  "toppings": *[_type == "topping"]{ "id": slug.current, title, price },
  "discounts": *[_type == "discountCode"]{ "code": upper(code), type, value, label },
  "products": *[_type == "product"]{
    "id": slug.current, title, unit, allergens, "hidden": hidden == true,
    "categories": categories[]->title, "primary": primaryCategory->title,
    sizes[]{label, price},
    flavours[]{label, priceDelta, "soldOut": soldOut == true}
  }
}`;

function mapStore(data) {
  const addons = {};
  (data.toppings || []).forEach((t) => {
    if (t.id) addons[t.id] = { id: t.id, title: t.title, price: t.price || 0 };
  });

  const discountCodes = {};
  (data.discounts || []).forEach((d) => {
    if (d.code) discountCodes[d.code] = { type: d.type, value: d.value, label: d.label };
  });

  const products = (data.products || []).filter((p) => p.hidden !== true).map((p) => {
    const cats = (p.categories || []).filter(Boolean);
    const primary = p.primary || cats[0];
    const tags = primary ? [primary].concat(cats.filter((c) => c !== primary)) : cats;
    const sizes = p.sizes && p.sizes.length ? p.sizes : [{ label: 'One size', price: 0 }];
    return {
      id: p.id,
      title: p.title,
      unit: p.unit || '',
      tags,
      sizes,
      flavours: (p.flavours || []).filter((f) => f && f.label),
      price: sizes[0].price,
      allergens: p.allergens || [],
    };
  });

  const settings = {};
  const s = data.settings || {};
  if (typeof s.deliveryFee === 'number') settings.deliveryFee = s.deliveryFee;
  if (typeof s.freeDeliveryThreshold === 'number') settings.freeDeliveryThreshold = s.freeDeliveryThreshold;
  if (typeof s.leadBusinessDays === 'number') settings.leadBusinessDays = s.leadBusinessDays;
  if (s.pickupEnabled !== undefined && s.pickupEnabled !== null) settings.pickupEnabled = s.pickupEnabled;

  return { products, addons, discountCodes, settings };
}

async function fetchStore() {
  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2500);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : undefined,
    });
    if (!res.ok) throw new Error(`Sanity HTTP ${res.status}`);
    const json = await res.json();
    return mapStore(json.result || {});
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { fetchStore };
