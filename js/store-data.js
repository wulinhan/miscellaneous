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
      brandName, heroTitle, heroSubtitle, deliveryFee, freeDeliveryThreshold,
      pickupEnabled, leadBusinessDays, timeSlots[]{value, label, sub}
    },
    "categories": *[_type == "category"] | order(order asc){ "title": title },
    "toppings": *[_type == "topping"]{ "id": slug.current, title, price },
    "discounts": *[_type == "discountCode"]{ "code": upper(code), type, value, label },
    "products": *[_type == "product"] | order(order asc){
      "id": slug.current, title, unit, shortDesc, longDesc,
      "categories": categories[]->title,
      "primary": primaryCategory->title,
      sizes[]{label, price},
      "upsell": toppings[]->slug.current,
      "alsoBought": alsoBought[]->slug.current,
      allergens,
      "images": images[].asset._ref
    }
  }`;

  function mapStore(data) {
    const categories = (data.categories || []).map(c => c.title).filter(Boolean);

    const addons = {};
    (data.toppings || []).forEach(t => { if (t.id) addons[t.id] = { id: t.id, title: t.title, price: t.price || 0 }; });

    const discountCodes = {};
    (data.discounts || []).forEach(d => {
      if (d.code) discountCodes[d.code] = { type: d.type, value: d.value, label: d.label };
    });

    const products = (data.products || []).map(p => {
      // tags drive filtering and must contain the product's category names,
      // ordered with the primary category first.
      const cats = (p.categories || []).filter(Boolean);
      const primary = p.primary || cats[0];
      const tags = primary ? [primary].concat(cats.filter(c => c !== primary)) : cats;
      const sizes = (p.sizes && p.sizes.length) ? p.sizes : [{ label: 'One size', price: 0 }];
      return {
        id: p.id,
        title: p.title,
        unit: p.unit || '',
        shortDesc: p.shortDesc || '',
        longDesc: p.longDesc || p.shortDesc || '',
        tags: tags,
        sizes: sizes,
        price: sizes[0].price,
        upsell: (p.upsell || []).filter(Boolean),
        alsoBought: (p.alsoBought || []).filter(Boolean),
        allergens: p.allergens || [],
        images: (p.images || []).map(imageUrl).filter(Boolean)
      };
    });

    const settings = {};
    const s = data.settings || {};
    ['brandName', 'heroTitle', 'heroSubtitle', 'pickupEnabled'].forEach(k => {
      if (s[k] !== undefined && s[k] !== null) settings[k] = s[k];
    });
    if (typeof s.deliveryFee === 'number') settings.deliveryFee = s.deliveryFee;
    if (typeof s.freeDeliveryThreshold === 'number') settings.freeDeliveryThreshold = s.freeDeliveryThreshold;
    if (typeof s.leadBusinessDays === 'number') settings.leadBusinessDays = s.leadBusinessDays;
    if (Array.isArray(s.timeSlots) && s.timeSlots.length) settings.timeSlots = s.timeSlots;

    return { products, addons, discountCodes, categories, settings };
  }

  async function fetchFromSanity() {
    const url = `https://${cfg.projectId}.apicdn.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}` +
                `?query=${encodeURIComponent(QUERY)}`;
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
})();
