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

function _lineKey(productId, size, addons, sugar, flavour) {
  // The flavour is appended only when there is one, so keys for flavourless
  // products stay byte-identical to the ones already in customers' carts.
  const base = [productId, size || '', sugar || '', (addons || []).slice().sort().join(',')].join('|');
  return flavour ? base + '|' + flavour : base;
}

const Cart = {
  all() {
    return _readCart();
  },

  count() {
    return _readCart().reduce((n, l) => n + l.qty, 0);
  },

  /* unit price for a line = size price + flavour surcharge + add-on prices */
  unitPrice(line) {
    const product = getProduct(line.productId);
    let price = product ? sizePrice(product, line.size) : 0;
    if (product) price += flavourDelta(product, line.flavour);
    (line.addons || []).forEach(id => {
      const a = ADDONS[id];
      if (a) price += a.price;
    });
    return price;
  },

  subtotal() {
    return _readCart().reduce((sum, l) => sum + this.unitPrice(l) * l.qty, 0);
  },

  add(productId, qty = 1, size = '', addons = [], sugar = '', flavour = '') {
    const lines = _readCart();
    const key = _lineKey(productId, size, addons, sugar, flavour);
    const existing = lines.find(l => l.key === key);
    if (existing) {
      existing.qty += qty;
    } else {
      lines.push({ key, productId, qty, size, addons: addons.slice(), sugar, flavour });
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
