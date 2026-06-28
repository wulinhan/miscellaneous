// GET  /api/admin/staff           — list active staff names
// POST /api/admin/staff { name }  — add a name, returns the refreshed list
// Gated by ADMIN_PASSWORD (same as the orders endpoint).
const { checkAdmin } = require('../_lib/admin-auth');
const orders = require('../_lib/orders');

module.exports = async (req, res) => {
  const auth = checkAdmin(req);
  if (!auth.ok) return res.status(auth.code).json({ error: auth.error });
  if (!orders.isConfigured()) {
    return res.status(503).json({ error: 'Order storage is not configured.' });
  }
  try {
    if (req.method === 'GET') {
      return res.status(200).json({ staff: await orders.listStaff() });
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const name = (body.name || '').toString().trim();
      if (!name) return res.status(400).json({ error: 'Missing name' });
      if (name.length > 60) return res.status(400).json({ error: 'Name too long' });
      return res.status(200).json({ staff: await orders.addStaff(name) });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
