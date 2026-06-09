/* =========================================================================
   IMAGE HELPERS
   Generates inline SVG placeholder images as data URIs so the storefront
   works with zero external assets. Each product has a base colour + emoji;
   gallery variants shift the background shade so the row of thumbnails
   reads as multiple distinct photos.
   ========================================================================= */

function _shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.min(255, Math.max(0, Math.round(r + (255 - r) * percent)));
  g = Math.min(255, Math.max(0, Math.round(g + (255 - g) * percent)));
  b = Math.min(255, Math.max(0, Math.round(b + (255 - b) * percent)));
  return `rgb(${r},${g},${b})`;
}

/* A single SVG "photo" for a product, with an optional variant index. */
function productImage(product, variant = 0) {
  const emoji = product.emoji || '🛍️';
  const base = product.color || '#c89b6a';
  // Variants subtly recolour + reposition so thumbnails look distinct.
  const tints = [0.18, 0.42, 0.05, 0.62, 0.30];
  const top = _shade(base, tints[variant % tints.length]);
  const bottom = _shade(base, tints[(variant + 2) % tints.length] - 0.1);
  const gid = `g${product.id}-${variant}`.replace(/[^a-z0-9-]/gi, '');
  const cx = 50 + (variant % 3 - 1) * 12;
  const cy = 46 + (Math.floor(variant / 3) - 0) * 6;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#${gid})"/>
  <circle cx="${cx}" cy="${cy}" r="30" fill="rgba(255,255,255,0.16)"/>
  <text x="${cx}" y="${cy}" font-size="34" text-anchor="middle" dominant-baseline="central">${emoji}</text>
</svg>`.trim();
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* Returns an array of gallery image data URIs for a product. */
function productGallery(product, count = 4) {
  const out = [];
  for (let i = 0; i < count; i++) out.push(productImage(product, i));
  return out;
}
