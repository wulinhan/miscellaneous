/* =========================================================================
   CART
   A tiny localStorage-backed cart shared across all three pages.
   A "line" is keyed by product id + chosen size + sorted add-on ids so the
   same product with different options stacks separately.
   ========================================================================= */

const CART_KEY = 'boba_cart_v1';

function _readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function _writeCart(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  document.dispatchEvent(new CustomEvent('cart:changed'));
}

function _lineKey(productId, size, addons, sugar, flavour, bucket, bucketTopping, choices) {
  // Newer options are appended only when present, so keys for lines without
  // them stay byte-identical to the ones already in customers' carts.
  let key = [productId, size || '', sugar || '', (addons || []).slice().sort().join(',')].join('|');
  if (flavour) key += '|' + flavour;
  if (bucket) key += '|b:' + bucket + (bucketTopping ? ':' + bucketTopping : '');
  if (choices && choices.length) key += '|c:' + choices.slice().sort().join(',');
  return key;
}

const Cart = {
  all() {
    return _readCart();
  },

  count() {
    return _readCart().reduce((n, l) => n + l.qty, 0);
  },

  /* unit price for a line = size price + flavour surcharge + add-on prices.
     Dispenser sizes are flat for any flavour: no surcharge, no per-cup
     toppings — just the optional shared topping bucket. */
  unitPrice(line) {
    const product = getProduct(line.productId);
    let price = product ? sizePrice(product, line.size) : 0;
    if (typeof isDispenserSize === 'function' && isDispenserSize(line.size)) {
      const b = (typeof DISPENSER_BUCKETS !== 'undefined') && DISPENSER_BUCKETS[line.bucket];
      if (b) price += b.price;
      return price;
    }
    if (product) price += flavourDelta(product, line.flavour) + optionDelta(product, line.choices);
    (line.addons || []).forEach(id => {
      const a = ADDONS[id];
      if (a) price += a.price;
    });
    return price;
  },

  subtotal() {
    return _readCart().reduce((sum, l) => sum + this.unitPrice(l) * l.qty, 0);
  },

  add(productId, qty = 1, size = '', addons = [], sugar = '', flavour = '', bucket = '', bucketTopping = '', choices = []) {
    const lines = _readCart();
    const key = _lineKey(productId, size, addons, sugar, flavour, bucket, bucketTopping, choices);
    const existing = lines.find(l => l.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      lines.push({ key, productId, qty, size, addons: addons.slice(), sugar, flavour, bucket, bucketTopping, choices: (choices || []).slice() });
    }
    _writeCart(lines);
    document.dispatchEvent(new CustomEvent('cart:added'));
  },

  setQty(key, qty) {
    let lines = _readCart();
    const line = lines.find(l => l.key === key);
    if (!line) return;
    line.qty = qty;
    if (line.qty <= 0) lines = lines.filter(l => l.key !== key);
    _writeCart(lines);
  },

  remove(key) {
    _writeCart(_readCart().filter(l => l.key !== key));
  },

  clear() {
    _writeCart([]);
  }
};

/* Keep any element with [data-cart-count] in sync on every page. */
function refreshCartBadges() {
  const n = Cart.count();
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = n;
    el.classList.toggle('is-empty', n === 0);
  });
}

document.addEventListener('cart:changed', refreshCartBadges);
document.addEventListener('DOMContentLoaded', refreshCartBadges);
