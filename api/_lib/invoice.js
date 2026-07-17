// Customer-facing invoice: a print-perfect HTML document served by
// GET /api/invoice?id=<orderId>&t=<token>. The layout mirrors the official
// Sofnade tax invoice (header + bill-to/meta/seller, item table with
// Qty/Unit Price/Disc%/Tax/Total SGD, totals block, payment methods footer).
// Browsers save it as a PDF via the Download button (window.print).
//
// The token is an HMAC over the order id so invoice links can be shared with
// the customer without exposing other orders. Same helper builds the links
// embedded in emails and in the admin dashboard.
const crypto = require('crypto');

const STORE = require('../../data/products.js');
const CONF = (STORE && STORE.SETTINGS) || {};
const SELLER = CONF.seller || {
  name: 'SOFNADE CATERING PTE. LTD.', uen: '202314539M',
  address: '8A Admiralty Street, #03-12, Food Xchange @ Admiralty, Singapore 757437',
  email: 'sales@sofnade.com', phone: '8930 9756',
};
const GSTCFG = CONF.gst || { registered: false, rate: 0, inclusive: true, regNo: '' };

const NAVY = '#1f3a8a';

function secret() {
  return process.env.INVOICE_SECRET
    || process.env.RAZORPAY_KEY_SECRET
    || process.env.ADMIN_PASSWORD
    || 'sofnade-dev-invoice';
}

function invoiceToken(orderId) {
  return crypto.createHmac('sha256', secret()).update('invoice:' + String(orderId)).digest('hex').slice(0, 24);
}

function verifyToken(orderId, token) {
  const want = invoiceToken(orderId);
  const got = String(token || '');
  if (got.length !== want.length) return false;
  return crypto.timingSafeEqual(Buffer.from(want), Buffer.from(got));
}

function baseUrl() {
  return (process.env.PUBLIC_BASE_URL || 'https://shop.sofnade.com').replace(/\/+$/, '');
}

function invoiceUrl(orderId) {
  return `${baseUrl()}/api/invoice?id=${encodeURIComponent(orderId)}&t=${invoiceToken(orderId)}`;
}

// ---- Rendering --------------------------------------------------------------

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
const fmt = (n) => '$' + round2(n).toFixed(2);
const inclGst = (amount) =>
  GSTCFG.registered && GSTCFG.inclusive ? round2((Number(amount || 0) * GSTCFG.rate) / (100 + GSTCFG.rate)) : 0;

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return esc(iso);
  return d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Singapore' });
}

// One item row: title bold, every chosen option (size / sugar / toppings) as
// description lines beneath it — mirroring the sample's descriptive cells.
function itemRow(i) {
  const descLines = [];
  if (i.size) descLines.push('Size: ' + esc(i.size));
  if (i.sugar) descLines.push('Sweetness: ' + esc(i.sugar));
  (i.addons || []).forEach((a) => descLines.push('Topping: ' + esc(a)));
  const qty = Number(i.qty || 0);
  return `<tr>
    <td class="desc"><b>${esc(i.title)}</b>${descLines.length ? '<br>' + descLines.join('<br>') : ''}</td>
    <td class="num">${qty.toFixed(2)}</td>
    <td class="num">${fmt(i.unitPrice)}</td>
    <td class="num"></td>
    <td class="num">${GSTCFG.registered ? fmt(inclGst(i.lineTotal)) : ''}</td>
    <td class="num">${fmt(i.lineTotal)}</td>
  </tr>`;
}

function feeRow(label, amount) {
  return `<tr>
    <td class="desc"><b>${esc(label)}</b></td>
    <td class="num">1.00</td>
    <td class="num">${fmt(amount)}</td>
    <td class="num"></td>
    <td class="num">${GSTCFG.registered ? fmt(inclGst(amount)) : ''}</td>
    <td class="num">${fmt(amount)}</td>
  </tr>`;
}

function invoiceHtml(order) {
  const q = order.quote || {};
  const c = order.customer || {};
  const paid = order.status && order.status !== 'created' && order.status !== 'cancelled';
  const title = paid ? 'TAX INVOICE' : 'PROFORMA INVOICE';
  const total = Number(q.total != null ? q.total : order.amount_total || 0);
  const gst = inclGst(total);
  const paidAmt = paid ? total : 0;

  const rows = (q.items || []).map(itemRow).join('');
  const feeRows = [
    q.deliveryFee ? feeRow('Delivery Charge', q.deliveryFee) : '',
    q.surcharge ? feeRow('Transport Surcharge', q.surcharge) : '',
    q.specificTimeFee ? feeRow('Specific-Time Delivery', q.specificTimeFee) : '',
  ].join('');

  const addr = [c.address1, c.address2, order.postal ? 'Singapore ' + order.postal : ''].filter(Boolean);
  const deliveryDetails = `<tr>
    <td class="desc"><b>${order.fulfilment === 'delivery' ? 'Delivery Details' : 'Self Pick-up'}</b><br>
      ${order.fulfilment === 'delivery'
        ? `Delivery Date: ${esc(order.delivery_date || '-')}<br>Delivery Time: ${esc(order.slot_or_window || '-')}<br>Delivery Address: ${addr.map(esc).join(', ') || '-'}`
        : `Collection Date: ${esc(order.delivery_date || '-')}<br>Collection Time: ${esc(order.slot_or_window || '-')}<br>Collect at: ${esc(SELLER.address || '')}`}
    </td>
    <td class="num">1.00</td><td class="num">$0.00</td><td class="num"></td><td class="num">$0.00</td><td class="num">$0.00</td>
  </tr>`;

  const billTo = [c.business, c.name, c.phone, c.email].filter(Boolean).map(esc).join('<br>');

  return `<!doctype html><html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${title} ${esc(order.id)} — Sofnade</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #eef1f7; font: 13px/1.5 Arial, Helvetica, sans-serif; color: #1b2330; }
  .sheet { max-width: 820px; margin: 24px auto; background: #fff; padding: 40px 44px 28px; box-shadow: 0 6px 24px rgba(27,35,48,.12); }
  .top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
  .logo img { height: 56px; }
  h1 { margin: 8px 0 0; font-size: 22px; letter-spacing: .02em; color: ${NAVY}; text-align: right; }
  .paidstamp { display: inline-block; margin-top: 6px; padding: 3px 12px; border: 2px solid #1a7f4b; color: #1a7f4b; font-weight: 800; font-size: 13px; border-radius: 6px; letter-spacing: .08em; }
  .meta { display: flex; justify-content: space-between; gap: 24px; margin-bottom: 26px; }
  .meta h4 { margin: 0 0 4px; font-size: 12px; color: ${NAVY}; }
  .meta .block { font-size: 12.5px; }
  .meta .k { color: ${NAVY}; font-weight: 700; margin-top: 8px; }
  .meta .k:first-child { margin-top: 0; }
  table.items { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  table.items th { background: ${NAVY}; color: #fff; font-size: 11.5px; padding: 8px 9px; text-align: left; }
  table.items th.num, table.items td.num { text-align: right; white-space: nowrap; }
  table.items td { border: 1px solid #d9dce6; padding: 9px; vertical-align: top; font-size: 12.5px; }
  table.items td.desc { width: 52%; overflow-wrap: break-word; }
  .totals { width: 320px; margin-left: auto; margin-top: 10px; font-size: 12.5px; }
  .totals .row { display: flex; justify-content: space-between; padding: 3px 0; }
  .totals .strong { font-weight: 800; font-size: 14px; border-top: 2px solid ${NAVY}; margin-top: 6px; padding-top: 8px; }
  .thanks { margin: 26px 0 18px; font-weight: 700; }
  .pay { border-top: 2px solid ${NAVY}; padding-top: 12px; margin-top: 26px; }
  .pay h4 { margin: 0 0 8px; color: #c0272d; font-size: 12.5px; }
  .pay .cols { display: flex; gap: 26px; flex-wrap: wrap; font-size: 11.5px; }
  .pay .cols > div { flex: 1 1 200px; }
  .pay b { color: ${NAVY}; }
  .foot { display: flex; justify-content: space-between; gap: 14px; border-top: 1px solid #d9dce6; margin-top: 22px; padding-top: 12px; font-size: 11.5px; color: #5a6b8c; flex-wrap: wrap; }
  .dl { position: fixed; top: 16px; right: 16px; background: ${NAVY}; color: #fff; border: none; font: bold 14px Arial; padding: 12px 20px; border-radius: 999px; cursor: pointer; box-shadow: 0 6px 18px rgba(27,35,48,.25); }
  .dl:hover { background: #16224a; }
  .tablewrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  /* Phone layout: stack the header blocks, tighten padding, and let the item
     table scroll sideways inside the sheet instead of overflowing it. */
  @media (max-width: 640px) {
    .sheet { margin: 0; padding: 18px 14px 20px; box-shadow: none; }
    .top { flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 20px; }
    .top > div { text-align: left !important; }
    h1 { text-align: left; font-size: 19px; }
    .logo img { height: 44px; }
    .meta { flex-direction: column; gap: 16px; margin-bottom: 20px; }
    table.items { min-width: 560px; }
    table.items td.desc { min-width: 200px; }
    .totals { width: 100%; }
    .pay .cols { flex-direction: column; gap: 12px; }
    .dl { top: auto; bottom: 16px; right: 16px; }
    .foot { flex-direction: column; gap: 4px; }
  }
  @media print {
    body { background: #fff; }
    .sheet { margin: 0; max-width: none; box-shadow: none; padding: 18px 8px; }
    .dl { display: none; }
    .tablewrap { overflow: visible; }
    table.items { min-width: 0; }
    .top { flex-direction: row; }
    .meta { flex-direction: row; }
  }
  @page { size: A4; margin: 12mm; }
</style></head><body>
<button class="dl" onclick="window.print()">⬇ Download PDF</button>
<div class="sheet">
  <div class="top">
    <div class="logo"><img src="${baseUrl()}/assets/logo/Sofnade%20logo.png" alt="Sofnade"></div>
    <div style="text-align:right">
      <h1>${title}</h1>
      ${paid ? '<span class="paidstamp">PAID</span>' : ''}
    </div>
  </div>

  <div class="meta">
    <div class="block" style="flex:1.2">
      <h4>Bill to</h4>
      ${billTo || 'Customer'}
    </div>
    <div class="block" style="flex:1">
      <div class="k">Invoice Number</div>${esc(order.id)}
      <div class="k">Invoice Date</div>${fmtDate(order.created_at || new Date().toISOString())}
      ${paid
        ? `<div class="k">Payment Date</div>${fmtDate(order.paid_at || order.created_at)}`
        : `<div class="k">Due Date</div>${fmtDate(order.created_at || new Date().toISOString())}`}
      ${order.razorpay_payment_id ? `<div class="k">Payment Reference</div>${esc(order.razorpay_payment_id)}` : ''}
    </div>
    <div class="block" style="flex:1.1">
      <b style="color:${NAVY}">${esc(SELLER.name)}</b><br>
      ${esc(SELLER.address || '').split(',').map((s) => s.trim()).filter(Boolean).join('<br>')}<br>
      Phone: +65 ${esc(SELLER.phone || '')}<br>
      Email: ${esc(SELLER.email || '')}<br>
      <b>UEN/GST No: ${esc(GSTCFG.regNo || SELLER.uen || '')}</b>
    </div>
  </div>

  <div class="tablewrap">
  <table class="items">
    <thead><tr>
      <th>Description</th><th class="num">Quantity</th><th class="num">Unit Price</th>
      <th class="num">Disc%</th><th class="num">Tax</th><th class="num">Total SGD</th>
    </tr></thead>
    <tbody>
      ${rows}
      ${deliveryDetails}
      ${feeRows}
    </tbody>
  </table>
  </div>

  <div class="totals">
    ${q.discount ? `<div class="row"><span>Total Discount${q.discountCode ? ` (${esc(q.discountCode)})` : ''}</span><span>-${fmt(q.discount)}</span></div>` : ''}
    <div class="row"><span>Subtotal (after discount)</span><span>${fmt(total)}</span></div>
    ${GSTCFG.registered ? `<div class="row"><span>Includes ${GSTCFG.rate}% GST — local supply of goods and services</span><span>${fmt(gst)}</span></div>` : ''}
    <div class="row strong"><span>Invoice Total SGD</span><span>${fmt(total)}</span></div>
    <div class="row"><span>Less Total Paid SGD</span><span>${fmt(paidAmt)}</span></div>
    <div class="row strong"><span>Amount Due SGD</span><span>${fmt(total - paidAmt)}</span></div>
  </div>

  <div class="thanks">Thank you for ordering with Sofnade!</div>

  <div class="pay">
    <h4>Payment Methods:</h4>
    <div class="cols">
      <div><b>1) Online Payment</b><br>Card payment at ${baseUrl().replace('https://', '')}</div>
      <div><b>2) Bank Transfer</b><br>${esc(SELLER.name)}<br>OCBC Current Account 595410226001</div>
      <div><b>3) Paynow/Paylah!</b><br>UEN No: ${esc(SELLER.uen || '')}</div>
      <div><b>4) Vendors@Gov</b><br>(Kindly submit your sub-BU code to us)</div>
    </div>
  </div>

  <div class="foot">
    <span>📞 +65 ${esc(SELLER.phone || '')}</span>
    <span>✉️ ${esc(SELLER.email || '')}</span>
    <span>🌐 www.sofnade.com</span>
    <span>@sofnade | Follow us on social media</span>
  </div>
</div>
</body></html>`;
}

module.exports = { invoiceToken, verifyToken, invoiceUrl, invoiceHtml, baseUrl };
