// Authoritative catalog access. In production this reads from Sanity (see
// sanity.ts). For local scaffolding it falls back to a small in-memory sample
// so the API routes work end to end without external services.
//
// Each product carries `kind` ('fresh' | 'shelf') which drives the delivery
// deconfliction. Map your Sanity categories to this when wiring Sanity in:
//   fresh  = Bubble Tea (cups), snack platters, briyani, bento, buffet
//   shelf  = snack packets, cookie packets, bottled drinks

import type { AddOn, CatalogProduct } from './types';

const SAMPLE_PRODUCTS: CatalogProduct[] = [
  {
    id: 'signature-classic-milk-tea',
    title: 'Signature Classic Milk Tea',
    kind: 'fresh',
    sizes: [
      { label: 'Regular cup (500ml)', price: 3.2 },
      { label: 'Bottle (650ml)', price: 5.7 },
    ],
  },
  {
    id: 'chocolate-chip-cookies',
    title: 'Chocolate Chip Cookies',
    kind: 'shelf',
    sizes: [
      { label: 'Petite Pack (45g)', price: 2.8 },
      { label: 'Bottle (150g)', price: 9.8 },
    ],
  },
  {
    id: 'ribbon-murukku',
    title: 'Ribbon Murukku',
    kind: 'shelf',
    sizes: [
      { label: 'Petite Pack (30g)', price: 1.8 },
      { label: 'Regular Pack (100g)', price: 5.0 },
      { label: 'Bottle (100g)', price: 6.8 },
    ],
  },
];

const SAMPLE_ADDONS: AddOn[] = [
  { id: 'pearls', title: 'Pearls', price: 0.5 },
  { id: 'taro-balls', title: 'Signature Mini Chewy Taro Balls', price: 0.8 },
];

export async function getCatalog(): Promise<CatalogProduct[]> {
  // TODO: replace with Sanity fetch (see sanity.ts) when configured.
  return SAMPLE_PRODUCTS;
}

export async function getCatalogById(): Promise<Record<string, CatalogProduct>> {
  const all = await getCatalog();
  return Object.fromEntries(all.map((p) => [p.id, p]));
}

export async function getAddOnsById(): Promise<Record<string, AddOn>> {
  return Object.fromEntries(SAMPLE_ADDONS.map((a) => [a.id, a]));
}
