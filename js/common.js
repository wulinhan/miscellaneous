/* =========================================================================
   COMMON UI — shared header, footer and toast.
   Injected via JS so we keep a single source of truth and the site runs
   straight off the filesystem (no server / no includes needed).
   ========================================================================= */

function renderChrome(active) {
  const header = `
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="index.html"><img src="assets/logo/Sofnade%20logo.png" alt="Sofnade"></a>
      <nav class="main-nav" id="main-nav">
        <a href="index.html" class="${active === 'shop' ? 'active' : ''}">Shop</a>
        <a href="index.html?cat=Bubble%20Tea">Bubble Tea</a>
        <a href="index.html?cat=Sweets">Sweets</a>
        <a href="index.html?cat=Snacks">Snacks</a>
        <a href="index.html?cat=Gift%20Sets">Gift Sets</a>
      </nav>
      <div class="header-actions">
        <a class="cart-link" href="checkout.html">
          🛒 Cart <span class="cart-badge" data-cart-count>0</span>
        </a>
        <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="main-nav">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div>© ${new Date().getFullYear()} Sofnade — Crafted fresh since 2015.</div>
      <div>Bubble tea · Sweets · Snacks · Gift sets · Delivered across Singapore</div>
    </div>
  </footer>`;

  const headerMount = document.getElementById('header');
  const footerMount = document.getElementById('footer');
  if (headerMount) headerMount.outerHTML = header;
  if (footerMount) footerMount.outerHTML = footer;

  // Mobile hamburger: toggle the nav panel.
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

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
