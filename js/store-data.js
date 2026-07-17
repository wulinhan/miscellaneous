/* =========================================================================
   STORE DATA LAYER
   Fetches the catalog + settings from Sanity (if configured in js/config.js)
   and feeds it to the page via applyStore(). If Sanity is not configured, or a
   fetch fails, the site silently keeps its built-in catalog so it never breaks.

   Pages call:  loadStore().then(render)
   ========================================================================= */

(function () {
  const cfg = window.SANITY_CONFIG || {};
  const configured = cfg.projectId && cfg.projectId !== 'YOUR_PROJECT_ID';

  /* Build a Sanity image CDN URL from an asset reference like
     "image-abc123-1100x1100-jpg". */
  function imageUrl(ref) {
    if (!ref || typeof ref !== 'string') return null;
    const m = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
    if (!m) return null;
    return `https://cdn.sanity.io/images/${cfg.projectId}/${cfg.dataset}/${m[1]}-${m[2]}.${m[3]}`;
  }

  /* GROQ query: pull everything the storefront needs in one request. */
  const QUERY = `{
    "settings": *[_type == "siteSettings"][0]{
      brandName, heroTitle, heroSubtitle, "heroImage": heroImage.asset._ref,
      deliveryFee, freeDeliveryThreshold,
      pickupEnabled, leadBusinessDays, timeSlots[]{value, label, sub}
    },
    "categories": *[_type == "category"] | order(order asc){ "title": title, "hidden": hidden == true, "isOccasion": isOccasion == true },
    "toppings": *[_type == "topping"]{ "id": slug.current, title, price },
    "discounts": *[_type == "discountCode"]{ "code": upper(code), type, value, label },
    "products": *[_type == "product"] | order(order asc){
      "id": slug.current, title, unit, shortDesc, longDesc, section,
      "bestseller": bestseller == true,
      "categories": categories[]->title,
      "primary": primaryCategory->title,
      sizes[]{label, price},
      "upsell": toppings[]->slug.current,
      "alsoBought": alsoBought[]->slug.current,
      allergens,
      "images": images[].asset._ref
    }
  }`;

  /* Map one raw CMS product into the storefront shape. tags carry the product's
     category names, primary first. Categories in `hiddenCats` are dropped; a
     product whose every category is hidden returns null (off the store). */
  function mapProduct(p, hiddenCats) {
    if (!p || !p.id) return null;
    const rawCats = (p.categories || []).filter(Boolean);
    const cats = rawCats.filter(c => !hiddenCats.has(c));
    if (rawCats.length && !cats.length) return null;
    const primary = (p.primary && !hiddenCats.has(p.primary)) ? p.primary : cats[0];
    const tags = primary ? [primary].concat(cats.filter(c => c !== primary)) : cats;
    const sizes = (p.sizes && p.sizes.length) ? p.sizes : [{ label: 'One size', price: 0 }];
    const images = (p.images || []).map(imageUrl).filter(Boolean);
    // If no CMS photos yet, reuse a bundled photo when the id matches.
    const builtin = (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(x => x.id === p.id) : null;
    const mapped = {
      id: p.id,
      title: p.title,
      bestseller: p.bestseller === true,
      unit: p.unit || '',
      shortDesc: p.shortDesc || '',
      longDesc: p.longDesc || p.shortDesc || '',
      tags: tags,
      // Sub-section (e.g. "Fusion Teas") drives the sub-category filter. Use the
      // CMS value if set, else fall back to the bundled product's section so the
      // sub-filters keep working until sections are managed in the CMS.
      section: p.section || (builtin ? builtin.section : undefined),
      sizes: sizes,
      price: sizes[0].price,
      upsell: (p.upsell || []).filter(Boolean),
      alsoBought: (p.alsoBought || []).filter(Boolean),
      allergens: p.allergens || []
    };
    if (images.length) mapped.images = images;
    else if (builtin && builtin.imageCount) mapped.imageCount = builtin.imageCount;
    return mapped;
  }

  function mapStore(data) {
    const allCats = (data.categories || []).filter(c => c && c.title);
    const hiddenCats = new Set(allCats.filter(c => c.hidden).map(c => c.title));
    // Visible categories (occasions included) drive chips/breadcrumbs; the
    // occasion subset feeds the separate "Shop by occasion" ribbon.
    const categories = allCats.filter(c => !c.hidden).map(c => c.title);
    const occasions = allCats.filter(c => !c.hidden && c.isOccasion).map(c => c.title);

    const addons = {};
    (data.toppings || []).forEach(t => { if (t.id) addons[t.id] = { id: t.id, title: t.title, price: t.price || 0 }; });

    const discountCodes = {};
    (data.discounts || []).forEach(d => {
      if (d.code) discountCodes[d.code] = { type: d.type, value: d.value, label: d.label };
    });

    const products = (data.products || []).map(p => mapProduct(p, hiddenCats)).filter(Boolean);

    const settings = {};
    const s = data.settings || {};
    ['brandName', 'heroTitle', 'heroSubtitle', 'pickupEnabled'].forEach(k => {
      if (s[k] !== undefined && s[k] !== null) settings[k] = s[k];
    });
    if (s.heroImage) { const u = imageUrl(s.heroImage); if (u) settings.heroImage = u; }
    if (typeof s.deliveryFee === 'number') settings.deliveryFee = s.deliveryFee;
    if (typeof s.freeDeliveryThreshold === 'number') settings.freeDeliveryThreshold = s.freeDeliveryThreshold;
    if (typeof s.leadBusinessDays === 'number') settings.leadBusinessDays = s.leadBusinessDays;
    if (Array.isArray(s.timeSlots) && s.timeSlots.length) settings.timeSlots = s.timeSlots;

    return { products, addons, discountCodes, categories, occasions, settings };
  }

  async function fetchFromSanity() {
    const q = encodeURIComponent(QUERY);
    // Prefer our same-origin proxy so the catalog loads on any domain. Sanity's
    // CORS allow-list only covers specific origins, so a direct browser request
    // from a custom domain (e.g. sofnade.com) gets a 403 and we'd fall back to
    // the bundled demo catalog. The proxy runs server-side (no CORS) and returns
    // the same Sanity result. If it's unavailable, try Sanity directly.
    // Two attempts through the proxy (a transient hiccup shouldn't demote the
    // whole page to the bundled catalog), then a direct request as a last try.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const pres = await fetch(`/api/catalog?query=${q}`);
        if (pres.ok) {
          const pjson = await pres.json();
          if (pjson && pjson.result) return mapStore(pjson.result);
        }
      } catch (e) { /* retry, then fall through to a direct request */ }
      if (!attempt) await new Promise(r => setTimeout(r, 400));
    }

    const url = `https://${cfg.projectId}.apicdn.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}` +
                `?query=${q}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Sanity HTTP ' + res.status);
    const json = await res.json();
    return mapStore(json.result || {});
  }

  window.loadStore = async function loadStore() {
    if (!configured) return;                 // use the built-in catalog as-is
    try {
      const store = await fetchFromSanity();
      if (store.products && store.products.length) applyStore(store);
    } catch (e) {
      console.warn('[Sofnade] Falling back to built-in catalog:', e.message);
    }
  };

  /* Rescue lookup for the product page: fetch ONE product by slug straight
     from the CMS (via the same-origin proxy). Covers any case where the slug
     is missing from whatever catalog this page ended up with — new products,
     renamed slugs, or a partial load. Returns the mapped product or null. */
  window.fetchProductBySlug = async function fetchProductBySlug(slug) {
    if (!configured || !slug) return null;
    const groq = `{
      "cats": *[_type == "category"]{ "title": title, "hidden": hidden == true },
      "p": *[_type == "product" && slug.current == ${JSON.stringify(String(slug))}][0]{
        "id": slug.current, title, unit, shortDesc, longDesc, section,
        "categories": categories[]->title,
        "primary": primaryCategory->title,
        sizes[]{label, price},
        "upsell": toppings[]->slug.current,
        "alsoBought": alsoBought[]->slug.current,
        allergens,
        "images": images[].asset._ref
      }
    }`;
    try {
      const res = await fetch(`/api/catalog?query=${encodeURIComponent(groq)}`);
      if (!res.ok) return null;
      const json = await res.json();
      const r = (json && json.result) || {};
      if (!r.p) return null;
      const hiddenCats = new Set((r.cats || []).filter(c => c && c.hidden).map(c => c.title));
      const mapped = mapProduct(r.p, hiddenCats);
      // Register it so the cart, upsells and modal resolve it from now on.
      if (mapped && typeof PRODUCTS !== 'undefined' && !PRODUCTS.some(x => x.id === mapped.id)) {
        PRODUCTS.push(mapped);
      }
      return mapped;
    } catch (e) {
      return null;
    }
  };
})();
