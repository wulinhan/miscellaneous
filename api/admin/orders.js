// GET  /api/admin/orders[?status=&limit=]  — list orders (newest first)
// PATCH /api/admin/orders  { id, status?, staff_notes?, delivery_date?, slot_or_window? }
// Gated by the shared ADMIN_PASSWORD (x-admin-password header). Reads/writes use
// the Supabase service key inside _lib/orders — it never reaches the browser.
const { checkAdmin } = require('../_lib/admin-auth');
const orders = require('../_lib/orders');

module.exports = async (req, res) => {
  const auth = checkAdmin(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });

  if (!orders.isConfigured()) {
    return res.status(503).json({ error: 'Order storage is not configured (set SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).' });
  }

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const list = await orders.listOrders({
        status: url.searchParams.get('status') || undefined,
        limit: url.searchParams.get('limit') || undefined,
      });
      return res.status(200).json({ orders: list });
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id) return res.status(400).json({ error: 'Missing order id' });
      const by = (req.headers['x-operator'] || '').toString().slice(0, 60).trim() || null;
      const updated = await orders.updateOrder(body.id, body, { by });
      if (!updated) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json({ order: updated });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
