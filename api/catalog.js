// GET /api/catalog?query=<groq>
// Same-origin proxy to Sanity's public query API. The browser calls THIS
// endpoint instead of Sanity directly, so the catalog loads on any domain —
// Sanity's CORS allow-list only covers specific origins (e.g. the *.vercel.app
// URL), so a custom domain like sofnade.com would otherwise get a 403 and the
// storefront would silently fall back to the bundled demo catalog.
//
// Read-only. It relays the storefront's own GROQ (the query already ships in
// js/store-data.js, and the dataset is publicly readable), with a short CDN
// cache. No secrets are exposed; a read token is only attached if configured.
const PROJECT_ID = process.env.SANITY_PROJECT_ID || 'mkxfjwwf';
const DATASET = process.env.SANITY_DATASET || 'production';
const API_VERSION = process.env.SANITY_API_VERSION || '2023-10-01';
const READ_TOKEN = process.env.SANITY_READ_TOKEN || '';

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const query = new URL(req.url, 'http://localhost').searchParams.get('query') || '';
  if (!query) return res.status(400).json({ error: 'Missing query' });
  if (query.length > 6000) return res.status(413).json({ error: 'Query too large' });
  try {
    const api =
      `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}` +
      `?query=${encodeURIComponent(query)}`;
    const r = await fetch(api, {
      headers: READ_TOKEN ? { Authorization: `Bearer ${READ_TOKEN}` } : undefined,
    });
    const body = await r.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=300');
    return res.status(r.status).send(body);
  } catch (e) {
    return res.status(502).json({ error: 'Catalog fetch failed: ' + e.message });
  }
};
