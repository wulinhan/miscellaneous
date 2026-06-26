// Sanity content client (products, settings, holidays). Stubbed for the
// scaffold; wire this up and have catalog.ts call it once configured.
//
// Project id mkxfjwwf is already provisioned for Sofnade.

export function isSanityConfigured(): boolean {
  return Boolean(process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET);
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
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`);
  const body = (await res.json()) as { result: T };
  return body.result;
}
