/* =========================================================================
   PRODUCT DETAIL (PDP) RENDERER — shared by product.html (full page) and the
   desktop quick-view modal on the listing. Renders into #pdp / #crumb /
   #also-bought (whatever container holds those ids). Relies on globals from
   data/products.js, store-data.js, images.js, cart.js, common.js.
   ========================================================================= */
    function chip(t, cat) {
      return `<span class="tag-chip ${cat ? 'cat' : ''}">${t}</span>`;
    }

    /* ---------- Inline SVG icons (stroke = currentColor) ---------- */
    const ICONS = {
      clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      list:     '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6l1.5 1.5L8 4M4 12l1.5 1.5L8 10M4 18l1.5 1.5L8 16"/>',
      expand:   '<path d="M9 4H4v5M4 4l6 6M15 20h5v-5M20 20l-6-6"/>',
      bookmark: '<path d="M7 4h10v16l-5-4-5 4z"/>',
      truck:    '<path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z"/><circle cx="7" cy="17" r="1.6"/><circle cx="17.5" cy="17" r="1.6"/>',
      info:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="7.6" r="0.6" fill="currentColor"/>'
    };
    function icon(name) {
      return `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
    }

    /* ---------- Per-product copy generators ---------- */

    function whatsIncluded(p) {
      const size = hasSizeChoice(p) ? 'your chosen size' : (p.sizes[0] ? p.sizes[0].label : '');
      if (p.id === 'festive-drinks') return 'One sharing party bucket (1.5L) of your chosen festive drink, with serving cups, lids and wide straws for the table.';
      if (p.id === 'chocolate-gift-bag') return 'An assortment of our hand-finished chocolates and truffles, arranged in a kraft gift box, tied with a ribbon and finished with a personalised greeting card.';
      if (p.id === 'festive-gift-bag') return 'Sealed pouches of our Premium Mixed Nuts and Trail Mix, packed into a reusable printed festive tote, ready to gift.';
      if (p.category === 'Drinks') return `One freshly shaken ${p.title} (${size}), served over ice with a sealed dome lid and a wide boba straw. Any toppings you add are prepared fresh in store.`;
      if (p.category === 'Snacks') return `${p.title} sealed fresh in a resealable ${size.toLowerCase()}, ready to snack on or share.`;
      return `${size} of our freshly made ${p.title}, arranged and packed in our signature kraft packaging.`;
    }

    function portionsText(p) {
      if (p.category === 'Drinks') {
        if (p.id === 'festive-drinks') return 'The party bucket holds about 1.5L, enough to pour 4 to 6 cups. Built for sharing at gatherings.';
        return 'Regular is 500ml and Large is 700ml. Each cup serves one, so size up if you are extra thirsty.';
      }
      const list = p.sizes.map(s => s.label).join(' or ');
      if (p.id === 'cookies') return `Available as a ${list}. A box of 8 is perfect for 3 to 4 to share, while a box of 16 suits groups or gifting.`;
      if (p.id === 'chocolate-truffles') return `Available as a ${list}. The box of 9 is a lovely treat for two; the box of 16 makes a generous gift.`;
      if (p.category === 'Snacks') return `Available as a ${list}. The pouch is a personal snack size; the tub is built for sharing.`;
      if (!hasSizeChoice(p)) return `Comes as one ${p.sizes[0].label.toLowerCase()}, ready to gift or enjoy.`;
      return `Available as a ${list}. Choose the larger size for sharing or gifting.`;
    }

    function storageText(p) {
      if (p.category === 'Drinks') return 'Best enjoyed within 2 to 3 hours of pickup or delivery. Keep chilled and give it a gentle shake before sipping; pearls and toppings are at their best fresh.';
      if (p.id === 'chocolate-truffles' || p.id === 'chocolate-gift-bag') return 'Store in a cool, dry place away from direct sunlight and enjoy within 2 weeks. Avoid the fridge, which can dull the shine and flavour of the chocolate.';
      if (p.category === 'Snacks' || p.id === 'festive-gift-bag') return 'Reseal the pack after opening and keep in a cool, dry place. Best enjoyed within 4 weeks.';
      return 'Keeps for up to 5 days in an airtight container at room temperature. A few seconds in a warm oven brings back that just-baked texture.';
    }

    function trustBadgesHTML() {
      return [
        { c: 'tb-teal',   t: 'estd',  b: '2015' },
        { c: 'tb-purple', t: 'HAND',  b: 'CRAFTED' },
        { c: 'tb-dark',   t: 'ISO',   b: '22000' },
        { c: 'tb-green',  t: 'HALAL', b: 'SG' }
      ].map(x => `<div class="trust-badge ${x.c}"><span>${x.t}</span><span>${x.b}</span></div>`).join('');
    }

    function deliveryFaqHTML(p) {
      const fresh = isFreshProduct(p);
      const window = (typeof SETTINGS !== 'undefined' && SETTINGS.shelfWindowLabel) || '9:00 AM – 5:00 PM';
      const addon = (typeof SETTINGS !== 'undefined' && SETTINGS.specificTimeAddon) || { fee: 30 };
      const sched = fresh
        ? `<p><strong>FRESH FOOD &mdash; choose a 30-minute slot.</strong><br>
            Freshly made items are delivered in a 30-minute window you pick at checkout (${window}),
            so everything arrives at its best.</p>`
        : `<p><strong>SHELF-STABLE &mdash; pick a date.</strong><br>
            Delivered any time within our standard window (${window}); no time slot needed. Want a
            specific time? Add <strong>Specific Time Delivery (+${money(addon.fee)})</strong> at checkout.</p>`;
      return `
        <p><strong>STORE PICK-UP &mdash; always free.</strong><br>
        Collect from our shop on your chosen date.</p>
        <p><strong>ISLANDWIDE DELIVERY &mdash; ${money(SETTINGS.deliveryFee)}, free over ${money(SETTINGS.freeDeliveryThreshold)}.</strong><br>
        We deliver across Singapore. The earliest date is the 3rd business day from your order; weekends
        and Singapore public holidays are not counted. A ${money(SETTINGS.surchargeFee)} transport surcharge
        applies to a few restricted postal areas.</p>
        ${sched}
        <p>Need to change an order? Reach us at least 48 hours before your chosen date and we will do our best to help.</p>`;
    }

    function allergenBadge(name) {
      const icons = {
        Dairy:  '<path d="M8 8V4h8v4l1 3v9H7v-9z"/><path d="M8 8h8"/>',
        Gluten: '<path d="M12 21V8"/><path d="M12 8l-3-3M12 8l3-3M12 12l-3-2M12 12l3-2M12 16l-3-2M12 16l3-2"/>',
        Nuts:   '<ellipse cx="9.5" cy="12" rx="3.5" ry="5"/><ellipse cx="14.5" cy="12" rx="3.5" ry="5"/>',
        Eggs:   '<path d="M12 3c3 0 5.5 5 5.5 9a5.5 5.5 0 0 1-11 0c0-4 2.5-9 5.5-9z"/>',
        Soy:    '<ellipse cx="10" cy="9" rx="3" ry="4" transform="rotate(-30 10 9)"/><ellipse cx="14" cy="15" rx="3" ry="4" transform="rotate(-30 14 15)"/>'
      };
      const ic = icons[name] || '<circle cx="12" cy="12" r="7"/>';
      return `<div class="allergen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ic}</svg><span>${name}</span></div>`;
    }

    function allergensFaqHTML(p) {
      const list = productAllergens(p);
      const intro = list.length
        ? 'We want everyone to enjoy our freshly made treats. Please be aware that this product contains the following allergens:'
        : 'We want everyone to enjoy our freshly made treats. This product is made without the major allergens.';
      const badges = list.length ? `<div class="allergens">${list.map(allergenBadge).join('')}</div>` : '';
      return `<p>${intro}</p>${badges}
        <p>Our kitchen is not allergen-free. We handle dairy, gluten, nuts and other common allergens,
        so there is a chance of cross-contact. If you are dealing with a severe allergy, please exercise
        caution and reach out to us for details. Your well-being is our priority.</p>`;
    }

    function renderPDP(p) {
      const cat = primaryCategory(p);
      const gallery = productGallery(p);
      const fromPrice = p.sizes[0].price;
      const earliestStr = Schedule.formatDate(Schedule.earliest());
      const orderByMsg = Schedule.orderByMessage();
      const freshItem = isFreshProduct(p);

      document.getElementById('crumb').innerHTML =
        `<a href="/">Shop</a> / <a href="/?cat=${encodeURIComponent(cat)}">${cat}</a> / ${p.title}`;

      const isDrink = p.tags.includes('Drinks');

      // Size selector (custom pills) only when there's a genuine choice of sizes.
      const sizeField = hasSizeChoice(p) ? `
            <div class="field">
              <label>Size</label>
              <div class="opt-pills" id="size-pills">
                ${p.sizes.map((s, i) => `<button type="button" class="opt-pill ${i === 0 ? 'active' : ''}" data-size="${s.label}">${s.label} <small>${money(s.price)}</small></button>`).join('')}
              </div>
            </div>` : '';

      // Flavour — one listing can carry a whole menu section, so this is the
      // first choice on the page. Sold-out flavours stay visible but unpickable.
      const flavours = productFlavours(p);
      // A long flavour list can be grouped into series (e.g. every milk tea).
      // The customer then picks the series first and only sees that handful of
      // flavours, instead of the whole menu at once.
      // A listing sold only as dispensers is flat-priced whatever the flavour,
      // so a surcharge inherited from a source listing must not be advertised.
      const flatPriced = (p.sizes || []).length > 0 &&
        (p.sizes || []).every(s => isDispenserSize(s.label));
      const seriesList = [...new Set(flavours.map(f => f.group).filter(Boolean))];
      const useSeries = seriesList.length > 1;
      const firstSeries = seriesList.find(s => flavours.some(f => f.group === s && !f.soldOut)) || seriesList[0];
      // Within the opening series when grouped, else across the whole list.
      const firstPickable = flavours.findIndex(f =>
        !f.soldOut && (!useSeries || f.group === firstSeries));

      const seriesField = useSeries ? `
            <div class="field">
              <label>Drink series</label>
              <div class="opt-pills" id="series-pills">
                ${seriesList.map(s => {
                  const active = s === firstSeries ? ' active' : '';
                  return `<button type="button" class="opt-pill${active}" data-series="${s}">${s}</button>`;
                }).join('')}
              </div>
            </div>` : '';

      const flavourField = flavours.length ? `
            <div class="field">
              <label>Flavour</label>
              <div class="opt-pills" id="flavour-pills">
                ${flavours.map((f, i) => {
                  const extra = (!flatPriced && f.priceDelta > 0) ? ` <small>+${money(f.priceDelta)}</small>` : '';
                  const cls = f.soldOut ? 'opt-pill sold-out' : `opt-pill ${i === firstPickable ? 'active' : ''}`;
                  const hide = useSeries && f.group !== firstSeries ? ' style="display:none"' : '';
                  return `<button type="button" class="${cls}" data-flavour="${f.label}" data-series="${f.group || ''}"${f.soldOut ? ' disabled aria-disabled="true"' : ''}${hide}>${f.label}${f.soldOut ? ' <small>sold out</small>' : extra}</button>`;
                }).join('')}
              </div>
            </div>` : '';

      // Sugar level (drinks only) — single-select, first option active by default.
      const sugarField = (isDrink && typeof SUGAR_LEVELS !== 'undefined') ? `
            <div class="field" id="sugar-field">
              <label>Sugar level</label>
              <div class="opt-pills" id="sugar-pills">
                ${SUGAR_LEVELS.map((s, i) => `<button type="button" class="opt-pill ${i === 0 ? 'active' : ''}" data-sugar="${s}">${s}</button>`).join('')}
              </div>
            </div>` : '';

      // Dispenser mode (catering): shown instead of sugar/per-cup toppings when
      // a Dispenser size is picked. One shared topping bucket, its topping
      // included, plus a note of everything provided with the dispenser.
      const hasDispenser = (p.sizes || []).some(s => isDispenserSize(s.label));
      const bucketTops = (p.upsell || []).map(id => {
        const a = ADDONS[id];
        return a ? `<button type="button" class="opt-pill" data-addon="${a.id}">${a.title}</button>` : '';
      }).join('');
      const dispenserFields = hasDispenser ? `
            <div class="field" id="bucket-field" style="display:none">
              <label>Toppings</label>
              <div class="opt-pills" id="bucket-pills">
                <button type="button" class="opt-pill active" data-bucket="">None</button>
                ${Object.values(DISPENSER_BUCKETS).map(b =>
                  `<button type="button" class="opt-pill" data-bucket="${b.id}">${b.title} <small>+${money(b.price)}</small></button>`).join('')}
              </div>
            </div>
            <div class="field" id="bucket-topping-field" style="display:none">
              <label>Bucket topping <span class="field-note">included with the bucket</span></label>
              <div class="opt-pills" id="bucket-topping-pills">${bucketTops}</div>
            </div>
            <div class="notice" id="disp-provided" style="display:none">
              <b>Provided with every dispenser:</b>
              <ul>${DISPENSER_PROVIDED.map(x =>
                `<li${x.withToppingOnly ? ' data-topping-only="1"' : ''}>${x.text}</li>`).join('')}</ul>
            </div>` : '';

      // Toppings as multi-select pills.
      const upsells = (p.upsell || []).map(id => {
        const a = ADDONS[id];
        if (!a) return '';
        const suffix = a.price > 0 ? ` <small>+${money(a.price)}</small>` : '';
        return `<button type="button" class="opt-pill" data-addon="${a.id}">${a.title}${suffix}</button>`;
      }).join('');

      const labels = productCategories(p)
        .map((c, i) => chip(c, i === 0))
        .join('');

      // Thumbnail row only when there is more than one photo.
      const thumbs = gallery.length > 1 ? `
            <div class="gallery-thumbs" id="gallery-thumbs">
              ${gallery.map((src, i) =>
                `<button class="${i === 0 ? 'active' : ''}" data-i="${i}">
                   <img src="${src}" alt="${p.title} view ${i + 1}">
                 </button>`).join('')}
            </div>` : '';

      document.getElementById('pdp').innerHTML = `
        <div class="pdp">
          <!-- Gallery: active image on top, square thumbnail row underneath -->
          <div class="gallery">
            <div class="gallery-main">
              <img id="gallery-main-img" src="${gallery[0]}" alt="${p.title}">
            </div>
            ${thumbs}
          </div>

          <!-- Details -->
          <div class="pdp-info">
            <div class="pdp-labels">${labels}</div>
            <h1>${p.title}</h1>
            <div class="pdp-price"><span id="pdp-price">${money(fromPrice)}</span> <span class="from" style="font-size:14px;color:var(--muted);font-weight:500">/ <span id="pdp-unit">${p.unit}</span></span></div>
            <p class="pdp-desc">${p.longDesc}</p>

            ${seriesField}

            ${flavourField}

            ${sizeField}

            ${sugarField}

            ${upsells ? `
            <div class="field" id="topping-field">
              <label>Add toppings <span class="field-note">choose up to ${typeof MAX_TOPPINGS !== 'undefined' ? MAX_TOPPINGS : 2}</span></label>
              <div class="opt-pills" id="topping-pills">${upsells}</div>
            </div>` : ''}

            ${dispenserFields}

            <div class="field">
              <label>Quantity</label>
              <div class="qty" id="qty">
                <button type="button" data-step="-1">−</button>
                <input type="number" id="qty-input" value="1" min="1">
                <button type="button" data-step="1">+</button>
              </div>
            </div>

            <div class="add-row">
              <button class="btn block" id="add-to-cart"><span class="btn-label">Add to cart · <span id="add-price">${money(fromPrice)}</span></span></button>
              <a class="btn block btn-wa pdp-wa" href="${waUrl(`Hi Sofnade! I have a question about ${String(p.title || '').trim()}.`)}"
                 target="_blank" rel="noopener">${WA_ICON}<span>Chat with us on WhatsApp</span></a>
            </div>

            <div class="notice">Free islandwide delivery on orders over ${money(SETTINGS.freeDeliveryThreshold)}, or choose free self pick-up. Earliest delivery is the 3rd business day.</div>

            <div class="info-accordion">
              <details open>
                <summary><span class="acc-head">${icon('clock')}<span class="acc-accent">Order now, get it by ${earliestStr}</span></span></summary>
                <div class="acc-body">
                  ${orderByMsg} The earliest delivery is the 3rd business day; weekends and Singapore
                  public holidays are not counted. ${freshItem
                    ? 'As a freshly made item, you will pick your exact date and a 30-minute time slot at checkout.'
                    : 'Pick your delivery date at checkout (delivered within our standard ' + ((typeof SETTINGS !== 'undefined' && SETTINGS.shelfWindowLabel) || '9:00 AM – 5:00 PM') + ' window), or collect it free from our shop.'}
                </div>
              </details>
              <details>
                <summary><span class="acc-head">${icon('list')}What's included?</span></summary>
                <div class="acc-body">${whatsIncluded(p)}</div>
              </details>
              <details>
                <summary><span class="acc-head">${icon('expand')}About portions and sizes</span></summary>
                <div class="acc-body">${portionsText(p)}</div>
              </details>
              <details>
                <summary><span class="acc-head">${icon('bookmark')}Storage and serving tips</span></summary>
                <div class="acc-body">${storageText(p)}</div>
              </details>
              <details>
                <summary><span class="acc-head">${icon('truck')}Islandwide delivery &amp; pickup options</span></summary>
                <div class="acc-body">${deliveryFaqHTML(p)}</div>
              </details>
              <details>
                <summary><span class="acc-head">${icon('info')}About allergens</span></summary>
                <div class="acc-body">${allergensFaqHTML(p)}</div>
              </details>
            </div>
          </div>
        </div>

        <!-- Mobile mini card: appears after scrolling past the gallery -->
        <div class="pdp-mini" id="pdp-mini">
          <img src="${gallery[0]}" alt="${p.title}">
          <div class="pdp-mini-info">
            <span class="pdp-mini-title">${p.title}</span>
            <span class="pdp-mini-price" id="mini-price">${money(fromPrice)}</span>
          </div>
        </div>

        <!-- Mobile-only sticky CTA -->
        <div class="pdp-sticky" id="pdp-sticky">
          <div class="info">
            <div class="title">${p.title}</div>
            <div class="price" id="sticky-price">${money(fromPrice)}</div>
          </div>
          <button class="btn" id="sticky-add"><span class="btn-label">Add to cart</span></button>
        </div>`;

      wireGallery(gallery);
      wireOptions(p);
      wireAlsoBought(p);
      wireMiniCard();
    }

    // Mobile mini card: show once the gallery has scrolled out of view.
    function wireMiniCard() {
      const mini = document.getElementById('pdp-mini');
      const gallery = document.querySelector('.gallery');
      if (!mini || !gallery || !('IntersectionObserver' in window)) return;
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => mini.classList.toggle('show', !e.isIntersecting));
      }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 });
      obs.observe(gallery);
    }

    // Photos for the product currently on screen, so picking a flavour can
    // bring its photo forward.
    let _gallery = [];

    function showGalleryImage(i) {
      const mainImg = document.getElementById('gallery-main-img');
      if (!mainImg || !_gallery[i]) return;
      mainImg.src = _gallery[i];
      document.querySelectorAll('#gallery-thumbs button').forEach(b => {
        b.classList.toggle('active', +b.dataset.i === i);
      });
    }

    function wireGallery(gallery) {
      _gallery = gallery;
      document.querySelectorAll('#gallery-thumbs button').forEach(btn => {
        btn.addEventListener('click', () => showGalleryImage(+btn.dataset.i));
      });
    }

    function selectedAddons() {
      return Array.from(document.querySelectorAll('#topping-pills .opt-pill.active')).map(b => b.dataset.addon);
    }

    function selectedSize(p) {
      const active = document.querySelector('#size-pills .opt-pill.active');
      return active ? active.dataset.size : (p.sizes[0] ? p.sizes[0].label : '');
    }

    function selectedSugar() {
      const active = document.querySelector('#sugar-pills .opt-pill.active');
      return active ? active.dataset.sugar : '';
    }

    function selectedFlavour(p) {
      const active = document.querySelector('#flavour-pills .opt-pill.active');
      if (active) return active.dataset.flavour;
      const first = productFlavours(p).find(f => !f.soldOut);
      return first ? first.label : '';
    }

    function selectedBucket() {
      const active = document.querySelector('#bucket-pills .opt-pill.active');
      return active ? active.dataset.bucket : '';
    }

    function selectedBucketTopping() {
      const active = document.querySelector('#bucket-topping-pills .opt-pill.active');
      return active ? active.dataset.addon : '';
    }

    // Size + flavour make up the headline price; toppings are added on top.
    // Dispensers are flat for any flavour — no surcharge, bucket instead.
    function basePrice(p) {
      const size = selectedSize(p);
      if (isDispenserSize(size)) return sizePrice(p, size);
      return sizePrice(p, size) + flavourDelta(p, selectedFlavour(p));
    }

    function currentUnitPrice(p) {
      let price = basePrice(p);
      if (isDispenserSize(selectedSize(p))) {
        const b = DISPENSER_BUCKETS[selectedBucket()];
        if (b) price += b.price;
      } else {
        selectedAddons().forEach(id => { if (ADDONS[id]) price += ADDONS[id].price; });
      }
      return price;
    }

    function flashAdded(btn) {
      // Quick press animation + transient "Added" state on the button.
      const label = btn.querySelector('.btn-label');
      const original = label ? label.innerHTML : null;
      btn.classList.remove('pop');
      void btn.offsetWidth;               // restart the CSS animation
      btn.classList.add('pop', 'added');
      if (label) label.textContent = 'Added ✓';
      clearTimeout(btn._t);
      btn._t = setTimeout(() => {
        btn.classList.remove('added');
        if (label && original !== null) label.innerHTML = original;
      }, 1100);
    }

    function wireOptions(p) {
      const qtyInput = document.getElementById('qty-input');
      const setText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
      // The displayed unit follows the chosen size: "Petite Pack (45g)" -> pack,
      // "Bottle (150g)" -> bottle, "Regular cup (500ml)" -> cup. Falls back to
      // the product's own unit when the size label doesn't name a container
      // (e.g. "One size", "Pack of 4").
      const unitForSize = (label) => {
        const clean = String(label || '').replace(/\(.*?\)/g, '').trim().toLowerCase();
        if (!clean || clean === 'one size') return p.unit || '';
        const last = clean.split(/\s+/).pop();
        if (/^\d+$/.test(last)) return p.unit || '';
        return last === 'packet' ? 'pack' : last;
      };
      // Dispenser mode swaps the per-cup choices (sugar, toppings) for the
      // bucket choice and the what's-provided note.
      const show = (id, on) => {
        const el = document.getElementById(id);
        if (el) el.style.display = on ? '' : 'none';
      };
      const refreshDispenser = () => {
        const disp = isDispenserSize(selectedSize(p));
        show('sugar-field', !disp);
        show('topping-field', !disp);
        show('bucket-field', disp);
        show('disp-provided', disp);
        const bucketOn = disp && !!selectedBucket();
        show('bucket-topping-field', bucketOn);
        // No topping, no topping scoop.
        document.querySelectorAll('#disp-provided li[data-topping-only]')
          .forEach(li => { li.style.display = bucketOn ? '' : 'none'; });
        // A bucket needs a topping in it — default to the first.
        if (bucketOn && !selectedBucketTopping()) {
          const first = document.querySelector('#bucket-topping-pills .opt-pill');
          if (first) first.classList.add('active');
        }
      };

      // With a grouped flavour list, only the chosen series' flavours are on
      // screen, and exactly one of them stays selected. The active flavour is
      // only reassigned when it belongs to a different series, so clicking a
      // flavour is never undone.
      const refreshSeries = () => {
        const active = document.querySelector('#series-pills .opt-pill.active');
        if (!active) return;
        const series = active.dataset.series;
        const pills = Array.from(document.querySelectorAll('#flavour-pills .opt-pill'));
        pills.forEach(b => { b.style.display = b.dataset.series === series ? '' : 'none'; });
        const activeFlavour = document.querySelector('#flavour-pills .opt-pill.active');
        if (!activeFlavour || activeFlavour.dataset.series !== series) {
          pills.forEach(b => b.classList.remove('active'));
          const first = pills.find(b => b.dataset.series === series && !b.classList.contains('sold-out'));
          if (first) first.classList.add('active');
        }
      };

      const updatePrice = () => {
        refreshSeries();
        refreshDispenser();
        setText('pdp-price', money(basePrice(p)));
        setText('mini-price', money(basePrice(p)));
        setText('pdp-unit', unitForSize(selectedSize(p)));
        const total = currentUnitPrice(p) * Math.max(1, +qtyInput.value || 1);
        setText('add-price', money(total));   // may be absent mid-animation
        setText('sticky-price', money(total));
      };

      const addToCart = (btn) => {
        const qty = Math.max(1, +qtyInput.value || 1);
        const disp = isDispenserSize(selectedSize(p));
        Cart.add(p.id, qty, selectedSize(p),
          disp ? [] : selectedAddons(),
          disp ? '' : selectedSugar(),
          selectedFlavour(p),
          disp ? selectedBucket() : '',
          (disp && selectedBucket()) ? selectedBucketTopping() : '');
        qtyInput.value = 1;               // reset quantity after adding
        updatePrice();                    // reflect reset before the flash
        flashAdded(btn);
      };

      document.querySelectorAll('#qty button').forEach(b => {
        b.addEventListener('click', () => {
          qtyInput.value = Math.max(1, (+qtyInput.value || 1) + (+b.dataset.step));
          updatePrice();
        });
      });
      qtyInput.addEventListener('input', updatePrice);

      // Size, sugar, flavour, bucket + bucket-topping pills: single-select
      // within their group
      ['#size-pills', '#sugar-pills', '#series-pills', '#flavour-pills',
       '#bucket-pills', '#bucket-topping-pills'].forEach(group => {
        document.querySelectorAll(`${group} .opt-pill`).forEach(pill => {
          pill.addEventListener('click', () => {
            if (pill.classList.contains('sold-out')) return;
            document.querySelectorAll(`${group} .opt-pill`).forEach(b => b.classList.remove('active'));
            pill.classList.add('active');
            updatePrice();
          });
        });
      });

      // Picking an option brings its photo to the front of the gallery: a
      // flavour shows that drink, a size shows that packaging (e.g. the tin).
      // Flavours fall back to the first untagged photo — the shared bottle shot
      // — rather than showing a different flavour's drink. Sizes have no such
      // fallback: an untagged photo says nothing about the packaging, so an
      // untagged size just leaves the gallery where it is.
      const wireGalleryTo = (group, attr, tagLists, fallback) => {
        if (!tagLists || !tagLists.length) return null;
        const indexOf = (label) => {
          const exact = tagLists.findIndex(list => (list || []).includes(label));
          if (exact >= 0) return exact;
          return fallback ? tagLists.findIndex(list => !(list || []).length) : -1;
        };
        document.querySelectorAll(`${group} .opt-pill`).forEach(pill => {
          pill.addEventListener('click', () => {
            if (pill.classList.contains('sold-out')) return;
            const i = indexOf(pill.dataset[attr]);
            if (i >= 0) showGalleryImage(i);
          });
        });
        return indexOf;
      };

      const flavourIndex = wireGalleryTo('#flavour-pills', 'flavour', p.imageFlavours, true);
      wireGalleryTo('#size-pills', 'size', p.imageSizes, false);

      // Switching series changes which flavour is selected, so the gallery
      // follows it too. Registered after the single-select handler above, so
      // the new flavour is already active by the time this runs.
      if (flavourIndex) {
        document.querySelectorAll('#series-pills .opt-pill').forEach(pill => {
          pill.addEventListener('click', () => {
            const i = flavourIndex(selectedFlavour(p));
            if (i >= 0) showGalleryImage(i);
          });
        });
        // Open on the photo for the flavour that starts selected.
        const start = flavourIndex(selectedFlavour(p));
        if (start > 0) showGalleryImage(start);
      }
      // Topping pills: multi-select toggle, capped at MAX_TOPPINGS
      const maxTop = (typeof MAX_TOPPINGS !== 'undefined') ? MAX_TOPPINGS : 2;
      const toppingPills = Array.from(document.querySelectorAll('#topping-pills .opt-pill'));
      const refreshToppingState = () => {
        const atMax = document.querySelectorAll('#topping-pills .opt-pill.active').length >= maxTop;
        toppingPills.forEach(b => { b.classList.toggle('disabled', atMax && !b.classList.contains('active')); });
      };
      toppingPills.forEach(pill => {
        pill.addEventListener('click', () => {
          if (!pill.classList.contains('active') &&
              document.querySelectorAll('#topping-pills .opt-pill.active').length >= maxTop) return;
          pill.classList.toggle('active');
          refreshToppingState();
          updatePrice();
        });
      });

      document.getElementById('add-to-cart').addEventListener('click', e => addToCart(e.currentTarget));
      document.getElementById('sticky-add').addEventListener('click', e => addToCart(e.currentTarget));

      updatePrice();
    }

    function alsoCard(p) {
      return `
        <article class="card">
          <a class="card-media" href="/product/${p.id}" data-pslug="${p.id}">
            <img src="${productImage(p, 0)}" alt="${p.title}" loading="lazy">
          </a>
          <div class="card-body">
            <h3><a href="/product/${p.id}" data-pslug="${p.id}">${p.title}</a></h3>
            <p class="card-desc">${p.shortDesc}</p>
            <div class="card-foot">
              <span class="price">${hasSizeChoice(p) ? '<span class="from">from </span>' : ''}${money(p.price)}</span>
              <a class="btn ghost" href="/product/${p.id}" data-pslug="${p.id}">View</a>
            </div>
          </div>
        </article>`;
    }

    function wireAlsoBought(p) {
      const items = (p.alsoBought || [])
        .map(id => getProduct(id))
        .filter(x => x && x.tags);
      if (!items.length) return;
      document.getElementById('also-bought-section').style.display = 'block';
      document.getElementById('also-bought').innerHTML = items.map(alsoCard).join('');
    }

// Read the product slug from a /product/<slug> path, falling back to ?id=
function currentSlug() {
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts[0] === 'product' && parts[1]) return decodeURIComponent(parts[1]);
  return param('id');
}
