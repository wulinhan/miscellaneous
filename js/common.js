/* =========================================================================
   COMMON UI — shared header, footer and toast.
   Injected via JS so we keep a single source of truth and the site runs
   straight off the filesystem (no server / no includes needed).
   ========================================================================= */

function renderChrome(active) {
  const header = `
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="index.html">Boba&nbsp;<span class="dot">&amp;</span>&nbsp;Co.</a>
      <nav class="main-nav">
        <a href="index.html" class="${active === 'shop' ? 'active' : ''}">Shop</a>
        <a href="index.html?cat=Bubble%20Tea">Bubble Tea</a>
        <a href="index.html?cat=Cookies">Cookies</a>
        <a href="index.html?cat=Snacks">Snacks</a>
      </nav>
      <div class="header-actions">
        <a class="cart-link" href="checkout.html">
          🛒 Cart <span class="cart-badge" data-cart-count>0</span>
        </a>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div>© ${new Date().getFullYear()} Boba &amp; Co. — Freshly shaken, freshly baked.</div>
      <div>Bubble tea · Cookies · Snacks · Delivered across Singapore</div>
    </div>
  </footer>`;

  const headerMount = document.getElementById('header');
  const footerMount = document.getElementById('footer');
  if (headerMount) headerMount.outerHTML = header;
  if (footerMount) footerMount.outerHTML = footer;

  if (!document.querySelector('.toast')) {
    const t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  refreshCartBadges();
}

let _toastTimer;
function toast(msg) {
  const el = document.querySelector('.toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

function money(n) {
  return '$' + n.toFixed(2);
}

function param(name) {
  return new URLSearchParams(location.search).get(name);
}
