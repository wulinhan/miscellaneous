// studio/scripts/apply-drink-photos.mjs
//
// Uploads the hi-res drink photos in assets/sofnade-drink-photos/ to Sanity and
// REPLACES each matching product's low-res photos with them. The generic
// "bubble-tea-bottle.png" render (the 650 ml bottle shot) is kept as the LAST
// gallery image where present. Products the photos don't map to are listed at
// the end so nothing is silently skipped.
//
// Run from the studio/ folder (uses your `sanity login` session, same as
// import-seed — no token to paste):
//
//   npx sanity exec scripts/apply-drink-photos.mjs --with-user-token
//
// Add DRY=1 in front to preview without writing:
//
//   DRY=1 npx sanity exec scripts/apply-drink-photos.mjs --with-user-token
//
// Originals are uploaded as-is: the site already requests CDN-resized
// renditions (w=800/1400&auto=format), so hi-res sources cost nothing on page
// load and keep the gallery sharp on zoom.

import { getCliClient } from 'sanity/cli';
import { createReadStream, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const PHOTO_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'assets', 'sofnade-drink-photos');
const DRY = !!process.env.DRY;

// Photo base name (extension and trailing " 2" stripped) → CMS product title.
// Name differences are deliberate:
//   • "Classic Milk Tea"                → the product is "Signature Classic Milk Tea"
//   • "Brown Sugar Fresh Milk w/Pearls" → the product is "Brown Sugar Jelly Fresh Milk"
//   • "Strawberry Lemonade"             → the product is "Pink Lemonade" (strawberry + lemon)
//   • "Classic Lemoande"                → typo in the filename, maps to "Classic Lemonade"
const MAP = {
  'Brown Sugar Fresh Milk with Pearls': 'Brown Sugar Jelly Fresh Milk',
  'Classic Lemoande': 'Classic Lemonade',
  'Classic Milk Tea': 'Signature Classic Milk Tea',
  'Classic Milk Tea with Pearls': 'Signature Classic Milk Tea',
  'Jasmine Green Milk Tea': 'Jasmine Green Milk Tea',
  'Jasmine Green Milk Tea with Pearls': 'Jasmine Green Milk Tea',
  'Lychee Mint Tea': 'Lychee Mint Tea',
  'Mango Fresh Milk': 'Mango Fresh Milk',
  'Mango Green Tea': 'Mango Green Tea',
  'Strawberry Fresh Milk': 'Strawberry Fresh Milk',
  'Strawberry Green Tea': 'Strawberry Green Tea',
  'Strawberry Lemonade': 'Pink Lemonade',
};

const key = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const client = getCliClient({ apiVersion: '2023-10-01' });

const files = readdirSync(PHOTO_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
if (!files.length) { console.error(`No photos found in ${PHOTO_DIR}`); process.exit(1); }

// Group photos by target product title. Order within a product: plain shot
// first, then "… 2", then the "with Pearls" variants — the first image is the
// product-card photo.
const groups = new Map(); // title → [{file, order}]
const unmatched = [];
for (const f of files) {
  const base = f.replace(/\.(jpe?g|png|webp)$/i, '').replace(/ 2$/, '');
  const title = MAP[base];
  if (!title) { unmatched.push(f); continue; }
  const pearls = / with Pearls/.test(base) ? 1 : 0;
  const second = / 2$/.test(f.replace(/\.(jpe?g|png|webp)$/i, '')) ? 1 : 0;
  if (!groups.has(title)) groups.set(title, []);
  groups.get(title).push({ file: f, order: pearls * 2 + second });
}
for (const list of groups.values()) list.sort((a, b) => a.order - b.order || a.file.localeCompare(b.file));

const products = await client.fetch(
  '*[_type == "product"]{ _id, title, "imgs": images[]{ _key, asset, "fname": asset->originalFilename } }'
);
const byTitle = new Map(products.map((p) => [p.title, p]));

let uploaded = 0;
for (const [title, photos] of groups) {
  const product = byTitle.get(title);
  if (!product) { console.warn(`SKIP: no CMS product titled "${title}"`); continue; }

  console.log(`${title}  ←  ${photos.map((p) => p.file).join(', ')}`);
  if (DRY) continue;

  const entries = [];
  for (const p of photos) {
    const asset = await client.assets.upload('image', createReadStream(join(PHOTO_DIR, p.file)), { filename: p.file });
    uploaded++;
    entries.push({ _type: 'image', _key: key(), asset: { _type: 'reference', _ref: asset._id } });
  }
  // Keep the generic bottle render (shows the 650 ml option) as the last shot.
  const bottle = (product.imgs || []).filter((i) => /bubble-tea-bottle/i.test(i.fname || ''))
    .map((i) => ({ _type: 'image', _key: key(), asset: i.asset }));
  await client.patch(product._id).set({ images: [...entries, ...bottle] }).commit();
  console.log(`  → replaced ${((product.imgs || []).length)} old image(s) with ${entries.length} new + ${bottle.length} bottle render`);
}

console.log(`\n${DRY ? '[DRY RUN] would upload' : 'Uploaded'} ${DRY ? files.length - unmatched.length : uploaded} photo(s) across ${groups.size} product(s).`);
if (unmatched.length) {
  console.log('\nNot applied — no matching product in the CMS yet (create the product, then re-run or use the Bulk Images tool):');
  unmatched.forEach((f) => console.log('  •', f));
}
