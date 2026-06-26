// Authoritative catalog access. In production this reads from Sanity (see
// sanity.ts). For local scaffolding it falls back to an in-memory sample so
// the storefront and API routes work end to end without external services.
//
// `kind` ('fresh' | 'shelf') drives delivery deconfliction. Map your Sanity
// categories to this when wiring Sanity in:
//   fresh  = Bubble Tea (cups), snack platters, briyani, bento, buffet
//   shelf  = snack packets, cookie packets, bottled drinks

import type { AddOn, CatalogProduct, ProductKind } from './types';
import { imageUrl, isSanityConfigured, sanityQuery } from './sanity';
import { SCHEDULE_CONFIG } from './schedule';

const DRINK_ADDONS = ['pearls', 'taro-balls', 'aiyu-jelly', 'brown-sugar-jelly', 'grass-jelly'];

const SAMPLE_PRODUCTS: CatalogProduct[] = [
  {
    id: 'signature-classic-milk-tea',
    title: 'Signature Classic Milk Tea',
    kind: 'fresh',
    category: 'Bubble Tea',
    emoji: '🧋',
    shortDesc: 'A special blend of Assam tea leaves from Taiwan. Fragrant and addictive.',
    sizes: [
      { label: 'Regular cup (500ml)', price: 3.2 },
      { label: 'Bottle (650ml)', price: 5.7 },
    ],
    addOnIds: DRINK_ADDONS,
  },
  {
    id: 'mango-green-tea',
    title: 'Mango Green Tea',
    kind: 'fresh',
    category: 'Bubble Tea',
    emoji: '🧋',
    shortDesc: 'Tropical mango sweetness with the fragrance of green tea.',
    sizes: [
      { label: 'Regular cup (500ml)', price: 3.1 },
      { label: 'Bottle (650ml)', price: 5.6 },
    ],
    addOnIds: DRINK_ADDONS,
  },
  {
    id: 'chocolate-chip-cookies',
    title: 'Chocolate Chip Cookies',
    kind: 'shelf',
    category: 'Housebake Cookies',
    emoji: '🍪',
    shortDesc: 'Buttery cookies loaded with chocolate chips and toasted almond.',
    sizes: [
      { label: 'Petite Pack (45g)', price: 2.8 },
      { label: 'Bottle (150g)', price: 9.8 },
    ],
  },
  {
    id: 'pineapple-tart',
    title: 'Pineapple Tart',
    kind: 'shelf',
    category: 'Housebake Cookies',
    emoji: '🍪',
    shortDesc: 'Buttery tarts with sweet, tangy pineapple jam.',
    sizes: [{ label: 'Bottle (19 pcs)', price: 9.8 }],
  },
  {
    id: 'ribbon-murukku',
    title: 'Ribbon Murukku',
    kind: 'shelf',
    category: 'Deepavali',
    emoji: '🪔',
    shortDesc: 'Crispy ribbon murukku with warm curry spice and chilli.',
    sizes: [
      { label: 'Petite Pack (30g)', price: 1.8 },
      { label: 'Regular Pack (100g)', price: 5.0 },
      { label: 'Bottle (100g)', price: 6.8 },
    ],
  },
  {
    id: 'kerepek-singkong',
    title: 'Kerepek Singkong',
    kind: 'shelf',
    category: 'Hari Raya',
    emoji: '🌙',
    shortDesc: 'Crunchy cassava crisps with a spicy belado kick.',
    sizes: [
      { label: 'Petite Pack (30g)', price: 1.8 },
      { label: 'Regular Pack (70g)', price: 5.0 },
      { label: 'Bottle (60g)', price: 6.8 },
    ],
  },
];

const SAMPLE_ADDONS: AddOn[] = [
  { id: 'pearls', title: 'Pearls', price: 0.5 },
  { id: 'taro-balls', title: 'Signature Mini Chewy Taro Balls', price: 0.8 },
  { id: 'aiyu-jelly', title: 'Aiyu Jelly (Housemade)', price: 0.5 },
  { id: 'brown-sugar-jelly', title: 'Brown Sugar Jelly Balls', price: 0.7 },
  { id: 'grass-jelly', title: 'Grass Jelly', price: 0.5 },
];

export const MAX_TOPPINGS = 2;
export const SUGAR_LEVELS = ['100% sugar', '75% sugar', '50% sugar', '25% sugar', '0% sugar'];

// A pleasant fallback glyph per category for products without an uploaded photo.
const CATEGORY_EMOJI: Record<string, string> = {
  'Bubble Tea': '🧋',
  'Housebake Cookies': '🍪',
  Sweets: '🧁',
  Snacks: '🍿',
  'Retro Snacks': '🍬',
  'Gift Sets': '🎁',
  'Christmas Festive': '🎄',
  Deepavali: '🪔',
  'Hari Raya': '🌙',
};

// ---- Sanity mapping --------------------------------------------------------

interface RawProduct {
  id: string | null;
  title: string;
  shortDesc: string | null;
  category: string | null;
  categories: (string | null)[] | null;
  imageRef: string | null;
  sizes: { label: string; price: number }[] | null;
  addOnIds: (string | null)[] | null;
}

const PRODUCTS_GROQ = `*[_type == "product" && defined(slug.current) && count(sizes) > 0] | order(order asc, title asc){
  "id": slug.current,
  title,
  shortDesc,
  "category": primaryCategory->title,
  "categories": categories[]->title,
  "imageRef": images[0].asset._ref,
  sizes[]{label, price},
  "addOnIds": toppings[]->slug.current
}`;

const TOPPINGS_GROQ = `*[_type == "topping" && defined(slug.current)] | order(price asc, title asc){
  "id": slug.current,
  title,
  price
}`;

/** Map a raw Sanity product to the storefront's CatalogProduct shape. Exported
 *  for unit testing the kind-derivation and fallbacks. */
export function mapProduct(raw: RawProduct): CatalogProduct {
  const category = raw.category ?? raw.categories?.find(Boolean) ?? undefined;
  const kind: ProductKind =
    category && SCHEDULE_CONFIG.freshCategories.includes(category) ? 'fresh' : 'shelf';
  const addOnIds = (raw.addOnIds ?? []).filter((x): x is string => Boolean(x));
  return {
    id: raw.id as string,
    title: raw.title,
    kind,
    sizes: (raw.sizes ?? []).map((s) => ({ label: s.label, price: s.price })),
    category: category ?? undefined,
    shortDesc: raw.shortDesc ?? undefined,
    emoji: category ? CATEGORY_EMOJI[category] : undefined,
    image: imageUrl(raw.imageRef, { width: 800 }),
    addOnIds: addOnIds.length ? addOnIds : undefined,
  };
}

export async function getCatalog(): Promise<CatalogProduct[]> {
  if (!isSanityConfigured()) return SAMPLE_PRODUCTS;
  try {
    const raw = await sanityQuery<RawProduct[]>(PRODUCTS_GROQ);
    const mapped = (raw ?? []).filter((p) => p.id).map(mapProduct);
    // If the dataset is empty (e.g. seed not yet imported), keep the storefront
    // populated with the built-in sample rather than showing a blank shop.
    return mapped.length ? mapped : SAMPLE_PRODUCTS;
  } catch (err) {
    console.error('[catalog] Sanity products fetch failed, using fallback:', (err as Error).message);
    return SAMPLE_PRODUCTS;
  }
}

export async function getProduct(id: string): Promise<CatalogProduct | undefined> {
  return (await getCatalog()).find((p) => p.id === id);
}

export async function getCatalogById(): Promise<Record<string, CatalogProduct>> {
  const all = await getCatalog();
  return Object.fromEntries(all.map((p) => [p.id, p]));
}

export async function getAddOns(): Promise<AddOn[]> {
  if (!isSanityConfigured()) return SAMPLE_ADDONS;
  try {
    const raw = await sanityQuery<{ id: string | null; title: string; price: number | null }[]>(
      TOPPINGS_GROQ,
    );
    const mapped = (raw ?? [])
      .filter((t) => t.id)
      .map((t) => ({ id: t.id as string, title: t.title, price: t.price ?? 0 }));
    return mapped.length ? mapped : SAMPLE_ADDONS;
  } catch (err) {
    console.error('[catalog] Sanity toppings fetch failed, using fallback:', (err as Error).message);
    return SAMPLE_ADDONS;
  }
}

export async function getAddOnsById(): Promise<Record<string, AddOn>> {
  return Object.fromEntries(SAMPLE_ADDONS.map((a) => [a.id, a]));
}
