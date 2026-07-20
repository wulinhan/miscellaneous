/* =========================================================================
   IMAGE HELPERS
   Real product photos live at assets/<id>/<id>-<n>.jpg, where <n> runs from 1
   to product.imageCount. productImage() returns one photo (variant index) and
   productGallery() returns the full set for the product-page gallery.
   A generated SVG placeholder is kept as a fallback for any item without
   photos (e.g. add-on toppings, which are only ever shown as text + emoji).
   ========================================================================= */

/* Ask Sanity's image CDN for a right-sized, modern-format rendition instead of
   the raw original: `w` caps the width (fit=max never upscales, so small
   sources are unchanged), auto=format serves WebP/AVIF where supported. */
function sanitySized(url, w) {
  if (typeof url !== 'string' || url.indexOf('cdn.sanity.io/images/') === -1) return url;
  return url + (url.indexOf('?') === -1 ? '?' : '&') + 'w=' + w + '&fit=max&auto=format&q=85';
}

function productImage(product, variant = 0) {
  // 1) CMS-provided image URLs, 2) bundled asset files, 3) SVG placeholder.
  if (product && Array.isArray(product.images) && product.images.length) {
    // ~800px covers 2x-DPR product cards and cart thumbs.
    return sanitySized(product.images[Math.min(Math.max(0, variant), product.images.length - 1)], 800);
  }
  if (product && product.id && product.imageCount) {
    const n = Math.min(Math.max(0, variant), product.imageCount - 1) + 1;
    return `/assets/${product.id}/${product.id}-${n}.jpg`;
  }
  return placeholderImage(product, variant);
}

function productGallery(product) {
  if (product && Array.isArray(product.images) && product.images.length) {
    // ~1400px covers the 2x-DPR gallery main image.
    return product.images.map(u => sanitySized(u, 1400));
  }
  if (product && product.id && product.imageCount) {
    const out = [];
    for (let i = 1; i <= product.imageCount; i++) {
      out.push(`/assets/${product.id}/${product.id}-${i}.jpg`);
    }
    return out;
  }
  return [placeholderImage(product, 0)];
}

/* ---------------------------- SVG fallback ----------------------------- */
function _shade(hex, percent) {
  const num = parseInt((hex || '#c89b6a').replace('#', ''), 16);
  let r = (num >> 16) & 0xff, g = (num >> 8) & 0xff, b = num & 0xff;
  r = Math.min(255, Math.max(0, Math.round(r + (255 - r) * percent)));
  g = Math.min(255, Math.max(0, Math.round(g + (255 - g) * percent)));
  b = Math.min(255, Math.max(0, Math.round(b + (255 - b) * percent)));
  return `rgb(${r},${g},${b})`;
}

function placeholderImage(product, variant = 0) {
  const emoji = (product && product.emoji) || '🛍️';
  const base = (product && product.color) || '#c89b6a';
  const tints = [0.18, 0.42, 0.05, 0.62, 0.30];
  const top = _shade(base, tints[variant % tints.length]);
  const bottom = _shade(base, tints[(variant + 2) % tints.length] - 0.1);
  const gid = `g${(product && product.id) || 'x'}-${variant}`.replace(/[^a-z0-9-]/gi, '');
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
  <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/>
  </linearGradient></defs>
  <rect width="100" height="100" fill="url(#${gid})"/>
  <circle cx="50" cy="46" r="30" fill="rgba(255,255,255,0.16)"/>
  <text x="50" y="46" font-size="34" text-anchor="middle" dominant-baseline="central">${emoji}</text>
</svg>`.trim();
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
