// Sanity content client (products, toppings, discount codes, site settings).
// Read-only HTTP access to the Sanity query API — no SDK dependency. The data
// modules (catalog.ts, coupons.ts, settings.ts) call sanityQuery() and fall
// back to their built-in samples when Sanity is not configured or unreachable.
//
// Project id mkxfjwwf is already provisioned for Sofnade.

export function isSanityConfigured(): boolean {
  return Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
}

/**
 * Build a public CDN URL from a Sanity image asset reference, e.g.
 *   image-abc123-800x800-jpg  ->  https://cdn.sanity.io/images/<proj>/<ds>/abc123-800x800.jpg
 * Returns undefined when the ref is missing/unparseable or Sanity is unset, so
 * callers can fall back to an emoji/placeholder.
 */
export function imageUrl(ref?: string | null, opts: { width?: number } = {}): string | undefined {
  if (!ref) return undefined;
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) return undefined;
  const m = /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!m) return undefined;
  const [, asset, dims, fmt] = m;
  const base = `https://cdn.sanity.io/images/${projectId}/${dataset}/${asset}-${dims}.${fmt}`;
  const params = new URLSearchParams({ auto: 'format' });
  if (opts.width) params.set('w', String(opts.width));
  return `${base}?${params.toString()}`;
}

const API_VERSION = '2024-01-01';

export async function sanityQuery<T>(groq: string, params: Record<string, unknown> = {}): Promise<T> {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !dataset) {
    throw new Error('Sanity is not configured (SANITY_PROJECT_ID / SANITY_DATASET).');
  }
  const url = new URL(
    `https://${projectId}.apicdn.sanity.io/v${API_VERSION}/data/query/${dataset}`,
  );
  url.searchParams.set('query', groq);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(`$${k}`, JSON.stringify(v));
  }
  const res = await fetch(url, {
    headers: process.env.SANITY_READ_TOKEN
      ? { Authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` }
      : {},
    // Next.js extends RequestInit with `next` for ISR caching.
    next: { revalidate: 60 },
  } as RequestInit & { next: { revalidate: number } });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { result: T };
  return body.result;
}
