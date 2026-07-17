// GET  /api/admin/orders[?status=&limit=]  — list orders (newest first)
// PATCH /api/admin/orders  { id, status?, staff_notes?, delivery_date?, slot_or_window? }
// Gated by the shared ADMIN_PASSWORD (x-admin-password header). Reads/writes use
// the Supabase service key inside _lib/orders — it never reaches the browser.
const { checkAdmin } = require('../_lib/admin-auth');
const orders = require('../_lib/orders');
const invoice = require('../_lib/invoice');

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
        archived: url.searchParams.get('archived') || undefined,
      });
      // Tokenized customer-invoice link per order, for the "View invoice" action.
      list.forEach((o) => { o.invoice_url = invoice.invoiceUrl(o.id); });
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

    if (req.method === 'DELETE') {
      // Permanent delete. The client must echo the order id in the body as a
      // confirmation guard (matches the typed-confirmation UI).
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const id = body.id || new URL(req.url, 'http://localhost').searchParams.get('id');
      if (!id) return res.status(400).json({ error: 'Missing order id' });
      if (body.confirm !== undefined && body.confirm !== id) {
        return res.status(400).json({ error: 'Confirmation does not match the order id' });
      }
      const deleted = await orders.deleteOrder(id);
      if (!deleted) return res.status(404).json({ error: 'Order not found' });
      return res.status(200).json({ deleted: true, id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
