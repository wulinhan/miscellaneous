// GET /api/invoice?id=<orderId>&t=<token> — the customer's downloadable
// invoice (print-ready HTML; the Download button saves it as PDF). The token
// is an HMAC over the order id (see _lib/invoice.js), so only someone holding
// the emailed link — or staff, via the admin dashboard — can open it.
const orders = require('./_lib/orders');
const invoice = require('./_lib/invoice');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const url = new URL(req.url, 'http://localhost');
    const id = url.searchParams.get('id') || '';
    const t = url.searchParams.get('t') || '';
    if (!id || !invoice.verifyToken(id, t)) {
      return res.status(403).json({ error: 'Invalid or missing invoice link' });
    }
    const order = await orders.getOrder(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(200).send(invoice.invoiceHtml(order));
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
