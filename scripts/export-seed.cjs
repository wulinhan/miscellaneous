/* Generates studio/seed.ndjson from the built-in catalog (data/products.js).
   Import into Sanity with:  cd studio && npm run import-seed
   Note: product photos are NOT seeded (binary). Upload them in the Studio. */
const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'data', 'products.js'), 'utf8');
const M = new Function(code + `
  return { PRODUCTS, ADDONS, DISCOUNT_CODES, CATEGORY_BAR_ORDER,
           SETTINGS, primaryCategory, productCategories, productAllergens };`)();

let k = 0;
const key = () => 'k' + (k++).toString(36);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const catId = title => 'category-' + slug(title);
const docs = [];

// Categories
M.CATEGORY_BAR_ORDER.forEach((title, i) => {
  docs.push({ _id: catId(title), _type: 'category', title, order: i });
});

// Toppings
Object.values(M.ADDONS).forEach(a => {
  docs.push({ _id: 'topping-' + a.id, _type: 'topping', title: a.title,
    slug: { _type: 'slug', current: a.id }, price: a.price });
});

// Discount codes
Object.entries(M.DISCOUNT_CODES).forEach(([code, d]) => {
  docs.push({ _id: 'discount-' + code, _type: 'discountCode', code,
    type: d.type, value: d.value, label: d.label });
});

// Site settings
const s = M.SETTINGS;
docs.push({
  _id: 'siteSettings', _type: 'siteSettings',
  brandName: s.brandName, heroTitle: s.heroTitle, heroSubtitle: s.heroSubtitle,
  deliveryFee: s.deliveryFee, freeDeliveryThreshold: s.freeDeliveryThreshold,
  pickupEnabled: s.pickupEnabled, leadBusinessDays: s.leadBusinessDays,
  timeSlots: s.timeSlots.map(t => Object.assign({ _key: key(), _type: 'object' }, t))
});

// Products
const ref = id => ({ _type: 'reference', _ref: id, _key: key() });
M.PRODUCTS.forEach((p, i) => {
  const cats = M.productCategories(p);
  docs.push({
    _id: 'product-' + p.id, _type: 'product', title: p.title,
    slug: { _type: 'slug', current: p.id }, order: i,
    unit: p.unit, shortDesc: p.shortDesc, longDesc: p.longDesc,
    sizes: p.sizes.map(sz => ({ _key: key(), _type: 'object', label: sz.label, price: sz.price })),
    categories: cats.map(c => ref(catId(c))),
    primaryCategory: { _type: 'reference', _ref: catId(M.primaryCategory(p)) },
    toppings: (p.upsell || []).map(id => ref('topping-' + id)),
    alsoBought: (p.alsoBought || []).map(id => ref('product-' + id)),
    allergens: M.productAllergens(p)
  });
});

const out = docs.map(d => JSON.stringify(d)).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, '..', 'studio', 'seed.ndjson'), out);
console.log('Wrote studio/seed.ndjson with', docs.length, 'documents');
