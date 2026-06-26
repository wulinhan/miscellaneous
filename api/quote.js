// POST /api/quote — server-validated totals preview for the current cart.
const { getStore, priceOrder } = require('./_lib/engine');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { lines, fulfilment, postal, code, specificTimeOn } = body;
    if (!Array.isArray(lines) || lines.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const store = await getStore();
    const quote = priceOrder(store, { lines, fulfilment, postal, code, specificTimeOn });
    return res.status(200).json({ quote });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};
