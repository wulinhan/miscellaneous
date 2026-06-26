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
        <a href="index.html?cat=Christmas%20Festive">Christmas Festive</a>
        <a href="index.html?cat=Bubble%20Tea">Bubble Tea</a>
        <a href="index.html?cat=Sweets">Sweets</a>
        <a href="index.html?cat=Snacks">Snacks</a>
        <a href="index.html?cat=Gift%20Sets">Gift Sets</a>
      </nav>
      <div class="header-actions">
        <a class="cart-link" href="checkout.html">
          Cart <span class="cart-badge" data-cart-count>0</span>
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

/* =========================================================================
   SCHEDULE — delivery date / slot / fee logic shared by the product page and
   checkout. Every rule reads from SETTINGS so the CMS can drive it. Times use
   the visitor's local clock; a production build should pin to Asia/Singapore.
   ========================================================================= */
const Schedule = {
  _s(k, d) { return (typeof SETTINGS !== 'undefined' && SETTINGS[k] != null) ? SETTINGS[k] : d; },
  cutoffHour() { return this._s('cutoffHour', 16); },
  lead()       { return this._s('leadBusinessDays', 3); },
  _holidays()  { return new Set(this._s('publicHolidays', [])); },

  ymd(d) {
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  },
  isWeekend(d) { const g = d.getDay(); return g === 0 || g === 6; },
  isBusinessDay(d) { return !this.isWeekend(d) && !this._holidays().has(this.ymd(d)); },
  nextBusinessDay(d) {
    const n = new Date(d); n.setHours(0, 0, 0, 0);
    do { n.setDate(n.getDate() + 1); } while (!this.isBusinessDay(n));
    return n;
  },

  /* Earliest delivery date: business-day 1 is the next business day (or the one
     after, if ordered at/after the cut-off), and the earliest is business-day N. */
  earliest(now) {
    now = now || new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    let bd1 = this.nextBusinessDay(today);
    if (now.getHours() >= this.cutoffHour()) bd1 = this.nextBusinessDay(bd1);
    let d = bd1;
    for (let i = 1; i < this.lead(); i++) d = this.nextBusinessDay(d);
    return d;
  },

  /* The next `count` available delivery dates from the earliest. */
  dates(count, now) {
    const out = [];
    let d = this.earliest(now);
    while (out.length < (count || 14)) {
      if (this.isBusinessDay(d)) out.push(new Date(d));
      d = this.nextBusinessDay(d);
    }
    return out;
  },

  _hm(mins) {
    const h = Math.floor(mins / 60), m = mins % 60;
    const ap = h < 12 ? 'AM' : 'PM';
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    const mm = String(m).padStart(2, '0');
    return { v: `${String(h).padStart(2, '0')}:${mm}`, l: `${h12}:${mm} ${ap}` };
  },
  /* 30-minute slots for fresh food, across the configured window. */
  freshSlots() {
    const cfg = this._s('freshSlot', { startHour: 9, endHour: 17, intervalMins: 30 });
    const step = cfg.intervalMins || 30;
    const out = [];
    for (let m = cfg.startHour * 60; m + step <= cfg.endHour * 60; m += step) {
      const a = this._hm(m), b = this._hm(m + step);
      out.push({ value: `${a.v}-${b.v}`, label: `${a.l} – ${b.l}` });
    }
    return out;
  },
  /* Discrete preferred times for the shelf-stable "specific time" add-on. */
  specificTimes() {
    const cfg = this._s('freshSlot', { startHour: 9, endHour: 17, intervalMins: 30 });
    const step = cfg.intervalMins || 30;
    const out = [];
    for (let m = cfg.startHour * 60; m <= cfg.endHour * 60; m += step) {
      const t = this._hm(m); out.push({ value: t.v, label: t.l });
    }
    return out;
  },

  /* $15 transport surcharge when the postal code's first two digits are listed. */
  surchargeFor(postal) {
    const fee = this._s('surchargeFee', 0);
    const prefixes = this._s('surchargePrefixes', []);
    const p = String(postal || '').replace(/\D/g, '').slice(0, 2);
    return (p.length === 2 && prefixes.includes(p)) ? fee : 0;
  },

  formatDate(d) {
    return d.toLocaleDateString('en-SG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  },
  cutoffLabel() {
    const h = this.cutoffHour(); const ap = h < 12 ? 'AM' : 'PM';
    let h12 = h % 12; if (h12 === 0) h12 = 12;
    return `${h12}:00 ${ap}`;
  },
  /* "Order now, get it by …" line for the product page. */
  orderByMessage(now) {
    now = now || new Date();
    const date = this.formatDate(this.earliest(now));
    return (now.getHours() < this.cutoffHour())
      ? `Order before ${this.cutoffLabel()} today to get it by ${date}.`
      : `Order now to get it by ${date}.`;
  }
};
