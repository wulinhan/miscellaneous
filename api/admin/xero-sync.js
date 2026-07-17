// POST /api/admin/xero-sync — staff-triggered Xero sync.
//   { id: "SOF-..." }   sync one order (invoice + payment if the order is paid)
//   { backfill: true }  sync every non-cancelled order (newest 100), idempotent
// Gated by the shared ADMIN_PASSWORD like the other admin routes.
const { checkAdmin } = require('../_lib/admin-auth');
const orders = require('../_lib/orders');
const xero = require('../_lib/xero');

const PAID_STATUSES = ['paid', 'preparing', 'out_for_delivery', 'completed'];

module.exports = async (req, res) => {
  const auth = checkAdmin(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!xero.isConfigured()) {
    return res.status(503).json({ error: 'Xero is not configured (set XERO_CLIENT_ID / XERO_CLIENT_SECRET).' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    if (body.id) {
      const order = await orders.getOrder(body.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      const msg = await xero.syncOrder(order, PAID_STATUSES.includes(order.status));
      return res.status(200).json({ ok: true, result: msg });
    }

    if (body.backfill) {
      const list = await orders.listOrders({ limit: 100, archived: 'all' });
      const results = [];
      for (const o of list) {
        if (o.status === 'cancelled') continue;
        try {
          const msg = await xero.syncOrder(o, PAID_STATUSES.includes(o.status));
          results.push({ id: o.id, ok: true, result: msg });
        } catch (e) {
          results.push({ id: o.id, ok: false, error: e.message });
        }
      }
      const failed = results.filter((r) => !r.ok).length;
      return res.status(200).json({ ok: true, synced: results.length - failed, failed, results });
    }

    return res.status(400).json({ error: 'Pass { id } or { backfill: true }' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
