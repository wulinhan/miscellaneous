// Best-effort fulfilment notifications: mirror an order into a Notion database
// (for staff) and email the customer via Resend. No SDKs — plain fetch. Each
// channel no-ops when its env vars are missing, and the on* helpers never throw,
// so a notification failure can never fail the webhook/verify/checkout call.

// Seller / GST / corporate details for the invoice (built-in defaults).
const invoice = require('./invoice');
const xero = require('./xero');
const STORE = require('../../data/products.js');
const CONF = (STORE && STORE.SETTINGS) || {};
const SELLER = CONF.seller || { name: 'SOFNADE CATERING PTE. LTD.', uen: '202314539M', address: '', email: 'sales@sofnade.com', phone: '8930 9756' };
const GSTCFG = CONF.gst || { registered: false, rate: 0, inclusive: true, regNo: '' };
const CORP = CONF.corporate || { notice: 'THIS ORDER IS NOT CONFIRMED UNTIL YOU RECEIVE AN OFFICIAL INVOICE' };

function money(n, ccy) {
  return `${ccy || 'SGD'} ${Number(n || 0).toFixed(2)}`;
}

// Inclusive-GST amount contained in a total.
function gstAmountOf(total) {
  return GSTCFG.registered && GSTCFG.inclusive
    ? Math.round((Number(total || 0) * GSTCFG.rate) / (100 + GSTCFG.rate) * 100) / 100
    : 0;
}

// One line of "everything chosen" for an item: size · sugar level · toppings.
function itemOptions(i) {
  const bits = [];
  if (i.size) bits.push(i.size);
  if (i.sugar) bits.push(`Sugar ${i.sugar}`);
  (i.addons || []).forEach((a) => bits.push(`+ ${a}`));
  return bits.join(' · ');
}

function summaryLines(order) {
  const q = order.quote || {};
  const lines = (q.items || []).map((i) => {
    const opts = itemOptions(i);
    return `- ${i.qty} x ${i.title}${opts ? ` (${opts})` : ''} = ${money(i.lineTotal, q.currency)}`;
  });
  lines.push('');
  lines.push(`Subtotal: ${money(q.subtotal, q.currency)}`);
  if (q.discount) lines.push(`Discount${q.discountCode ? ` (${q.discountCode})` : ''}: -${money(q.discount, q.currency)}`);
  if (q.deliveryFee) lines.push(`Delivery: ${money(q.deliveryFee, q.currency)}`);
  if (q.surcharge) lines.push(`Transport surcharge: ${money(q.surcharge, q.currency)}`);
  if (q.specificTimeFee) lines.push(`Specific-time add-on: ${money(q.specificTimeFee, q.currency)}`);
  lines.push(`Total: ${money(q.total, q.currency)}`);
  return lines;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// ---- Notion ----------------------------------------------------------------

const NOTION_VERSION = '2022-06-28';

async function notionTitleProp(dbId, h) {
  const res = await fetch(`https://api.notion.com/v1/databases/${dbId}`, { headers: h });
  if (!res.ok) throw new Error(`Notion db ${res.status}: ${await res.text()}`);
  const db = await res.json();
  const entry = Object.entries(db.properties || {}).find(([, v]) => v.type === 'title');
  return entry ? entry[0] : 'Name';
}

async function mirrorToNotion(order) {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!token || !dbId) return; // not configured
  const h = {
    Authorization: `Bearer ${token}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
  const titleProp = await notionTitleProp(dbId, h);
  const c = order.customer || {};
  const where =
    order.fulfilment === 'delivery'
      ? `Deliver to: ${[c.address1, c.address2, order.postal].filter(Boolean).join(', ')}`
      : 'Self pick-up';
  const when = order.delivery_date
    ? `When: ${order.delivery_date}${order.slot_or_window ? ` (${order.slot_or_window})` : ''}`
    : '';
  // Put everything in the page body so this works with ANY database that has a
  // title property — no fragile property-name coupling.
  const text = [
    `Customer: ${c.name || ''} - ${c.phone || ''} - ${c.email || ''}`,
    where,
    when,
    c.notes ? `Notes: ${c.notes}` : '',
    order.payment_method === 'vendors_sg'
      ? 'Payment: Corporate Booking - order created UNPAID. Follow up with an official invoice to confirm and arrange payment.'
      : '',
    '',
    ...summaryLines(order),
    '',
    order.payment_method === 'vendors_sg'
      ? ''
      : `Razorpay: ${order.razorpay_order_id || ''} / ${order.razorpay_payment_id || ''}`,
  ].filter((t) => t !== '');
  const children = text.map((t) => ({
    object: 'block',
    type: 'paragraph',
    paragraph: { rich_text: t ? [{ type: 'text', text: { content: String(t) } }] : [] },
  }));
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: h,
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: { [titleProp]: { title: [{ text: { content: `${order.id} - ${c.name || 'Order'}` } }] } },
      children,
    }),
  });
  if (!res.ok) throw new Error(`Notion page ${res.status}: ${await res.text()}`);
}

// ---- Resend ----------------------------------------------------------------

// Brand palette (kept in sync with css/styles.css :root).
const NAVY = '#1f3a8a';
const GOLD = '#ffc629';
const WA_GREEN = '#25d366';

// Support WhatsApp number — digits only, no '+'. Configurable; defaults to the
// Sofnade line. Used for the "Message us on WhatsApp" CTA in the emails.
function supportWa() {
  return (process.env.SUPPORT_WHATSAPP || '6589309756').replace(/\D/g, '');
}
function supportWaPretty() {
  const d = supportWa();
  const m = d.match(/^65(\d{4})(\d{4})$/);
  return m ? `+65 ${m[1]} ${m[2]}` : `+${d}`;
}
function waHref(order) {
  const msg = `Hi Sofnade! I have a question about my order ${order.id}.`;
  return `https://wa.me/${supportWa()}?text=${encodeURIComponent(msg)}`;
}

function firstName(order) {
  return escapeHtml(((order.customer && order.customer.name) || '').split(' ')[0] || 'there');
}

// Branded, email-client-safe order email: table layout + inline styles only (no
// <style> blocks / flexbox / external CSS, which many clients strip). `opts`
// swaps the badge/heading/intro/footer so the same layout serves both a paid
// receipt and an unpaid "request received" confirmation.
function orderEmailHtml(order, opts) {
  const q = order.quote || {};
  const ccy = q.currency || 'SGD';
  const c = order.customer || {};

  const itemRows = (q.items || [])
    .map((i) => {
      const qty = Number(i.qty || 0);
      const unit = i.unitPrice != null ? Number(i.unitPrice) : (qty ? Number(i.lineTotal || 0) / qty : 0);
      const opts = itemOptions(i);
      return `<tr>
        <td width="68%" style="width:68%;padding:10px 8px 10px 0;border-bottom:1px solid #e6e7ec;font:14px/1.4 Arial,sans-serif;color:#1b2330;vertical-align:top;">
          <strong>${escapeHtml(i.title || '')}</strong>${opts ? `<br><span style="color:#6b7280;font-size:13px;">${escapeHtml(opts)}</span>` : ''}<br>
          <span style="color:#6b7280;font-size:13px;">${qty} &times; ${money(unit, ccy)}</span>
        </td>
        <td width="32%" align="right" style="width:32%;padding:10px 0;border-bottom:1px solid #e6e7ec;font:14px/1.4 Arial,sans-serif;color:#1b2330;text-align:right;vertical-align:top;white-space:nowrap;">${money(i.lineTotal, ccy)}</td>
      </tr>`;
    })
    .join('');

  const totalRow = (label, val, bold) => `<tr>
      <td width="60%" style="width:60%;padding:4px 8px 4px 0;font:${bold ? 'bold ' : ''}14px/1.4 Arial,sans-serif;color:${bold ? '#1b2330' : '#6b7280'};">${escapeHtml(label)}</td>
      <td width="40%" align="right" style="width:40%;padding:4px 0;font:${bold ? 'bold ' : ''}14px/1.4 Arial,sans-serif;color:${bold ? '#1b2330' : '#6b7280'};text-align:right;white-space:nowrap;">${val}</td>
    </tr>`;

  const totals = [
    totalRow('Subtotal', money(q.subtotal, ccy)),
    q.discount ? totalRow(`Discount${q.discountCode ? ` (${q.discountCode})` : ''}`, `-${money(q.discount, ccy)}`) : '',
    q.deliveryFee ? totalRow('Delivery', money(q.deliveryFee, ccy)) : (order.fulfilment === 'delivery' ? totalRow('Delivery', 'Free') : ''),
    q.surcharge ? totalRow('Transport surcharge', money(q.surcharge, ccy)) : '',
    q.specificTimeFee ? totalRow('Specific-time add-on', money(q.specificTimeFee, ccy)) : '',
    totalRow('Total', money(q.total, ccy), true),
    GSTCFG.registered ? totalRow(`Inclusive of ${GSTCFG.rate}% GST`, money(gstAmountOf(q.total), ccy)) : '',
  ].join('');

  const where =
    order.fulfilment === 'delivery'
      ? `Delivery to ${escapeHtml([c.address1, c.address2, order.postal ? 'Singapore ' + order.postal : ''].filter(Boolean).join(', '))}`
      : 'Self pick-up';
  const when = order.delivery_date
    ? `${escapeHtml(order.delivery_date)}${order.slot_or_window ? ` &middot; ${escapeHtml(order.slot_or_window)}` : ''}`
    : '';

  return `<!doctype html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  </head><body style="margin:0;padding:0;background:#eef1f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f7;padding:24px 0;">
   <tr><td align="center" style="padding:0 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(27,35,48,.08);">
      <tr><td style="background:${NAVY};padding:24px 28px;">
        <span style="font:bold 22px Arial,sans-serif;color:#ffffff;letter-spacing:.5px;">Sofnade</span>
        <span style="display:inline-block;margin-left:10px;font:bold 11px Arial,sans-serif;color:${NAVY};background:${GOLD};padding:3px 10px;border-radius:999px;">${escapeHtml(opts.badge)}</span>
      </td></tr>
      <tr><td style="padding:28px;">
        ${opts.topBanner || ''}
        <h1 style="margin:0 0 6px;font:bold 20px Arial,sans-serif;color:#1b2330;">${opts.heading}</h1>
        <p style="margin:0 0 18px;font:14px/1.6 Arial,sans-serif;color:#6b7280;">${opts.intro}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-top:2px solid ${NAVY};padding-top:8px;">${totals}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 0;background:#f7f8fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;font:14px/1.5 Arial,sans-serif;color:#1b2330;">
            <strong style="color:${NAVY};">${order.fulfilment === 'delivery' ? 'Delivery' : 'Pick-up'}</strong><br>${where}${when ? `<br>${when}` : ''}
          </td></tr>
        </table>
        ${opts.infoBox || ''}
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 6px;">
          <tr><td align="center">
            <a href="${invoice.invoiceUrl(order.id)}" style="display:inline-block;background:${NAVY};color:#ffffff;font:bold 15px Arial,sans-serif;text-decoration:none;padding:14px 26px;border-radius:999px;">Download invoice (PDF)</a>
          </td></tr>
          <tr><td align="center" style="padding-top:10px;">
            <a href="${waHref(order)}" style="display:inline-block;background:${WA_GREEN};color:#ffffff;font:bold 15px Arial,sans-serif;text-decoration:none;padding:14px 26px;border-radius:999px;">Message us on WhatsApp</a>
          </td></tr>
        </table>
        <p style="margin:6px 0 0;font:13px/1.5 Arial,sans-serif;color:#6b7280;text-align:center;">Questions about your order? Reach us anytime at ${supportWaPretty()}.</p>
      </td></tr>
      <tr><td style="background:#f7f8fb;padding:18px 28px;border-top:1px solid #e6e7ec;">
        <p style="margin:0;font:12px/1.6 Arial,sans-serif;color:#9aa1ad;">${opts.footerLine}<br>
        ${escapeHtml(SELLER.name)} &middot; UEN ${escapeHtml(SELLER.uen || '')}${GSTCFG.registered ? ' &middot; GST Reg No ' + escapeHtml(GSTCFG.regNo || SELLER.uen || '') : ''}<br>
        ${escapeHtml(SELLER.address || '')}<br>
        &copy; ${new Date().getFullYear()} Sofnade &middot; MUIS Halal Certified &middot; SFA Licensed Central Kitchen</p>
      </td></tr>
    </table>
   </td></tr>
  </table>
  </body></html>`;
}

function receiptHtml(order) {
  return orderEmailHtml(order, {
    badge: 'TAX INVOICE',
    heading: `Thanks for your order, ${firstName(order)}!`,
    intro: `Order <strong style="color:#1b2330;">${escapeHtml(order.id)}</strong> is confirmed and paid. Here is your summary.`,
    footerLine: `Payment ref: ${escapeHtml(order.razorpay_payment_id || order.razorpay_order_id || '-')}`,
  });
}

function requestHtml(order) {
  const topBanner = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#fff4f4;border:1px solid #c0272d;border-radius:8px;">
          <tr><td align="center" style="padding:12px 16px;font:bold 14px Arial,sans-serif;color:#c0272d;">${escapeHtml(CORP.notice || 'THIS ORDER IS NOT CONFIRMED UNTIL YOU RECEIVE AN OFFICIAL INVOICE')}</td></tr>
        </table>`;
  const infoBox = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:12px 0 0;background:#fff8e1;border:1px solid ${GOLD};border-radius:10px;">
          <tr><td style="padding:14px 16px;font:14px/1.5 Arial,sans-serif;color:#1b2330;">
            <strong style="color:${NAVY};">Payment: Corporate Booking</strong><br>Vendors@Gov / Sesami / Ariba / Coupa / Credit Terms. No payment has been taken yet &mdash; a Sofnade team member will follow up shortly with an official invoice to confirm your order.
          </td></tr>
        </table>`;
  return orderEmailHtml(order, {
    badge: 'PROFORMA INVOICE',
    topBanner,
    heading: `Thank you, ${firstName(order)}!`,
    intro: `We have received your Corporate Booking order request <strong style="color:#1b2330;">${escapeHtml(order.id)}</strong>. A team member from Sofnade will be in touch shortly with an official invoice to confirm the details and arrange payment. This is a proforma summary of your request.`,
    footerLine: `Order ref: ${escapeHtml(order.id)} &middot; Corporate Booking`,
    infoBox,
  });
}

// Plain-text alternative (improves deliverability and accessibility).
function orderEmailText(order, headingText, introText) {
  const lines = [headingText, introText, '', ...summaryLines(order), ''];
  if (order.delivery_date) {
    lines.push(
      `${order.fulfilment === 'delivery' ? 'Delivery' : 'Pick-up'}: ${order.delivery_date}${order.slot_or_window ? ` (${order.slot_or_window})` : ''}`,
    );
    lines.push('');
  }
  lines.push(`Download your invoice (PDF): ${invoice.invoiceUrl(order.id)}`);
  lines.push(`Questions? WhatsApp us at ${supportWaPretty()}: ${waHref(order)}`);
  lines.push('- Sofnade');
  return lines.join('\n');
}
function receiptText(order) {
  const c = order.customer || {};
  return orderEmailText(order, `Thanks for your order, ${c.name || ''}!`.trim(), `Order ${order.id} is confirmed and paid.`);
}
function requestText(order) {
  const c = order.customer || {};
  return orderEmailText(
    order,
    `Thank you, ${c.name || ''}!`.trim(),
    `${CORP.notice || 'THIS ORDER IS NOT CONFIRMED UNTIL YOU RECEIVE AN OFFICIAL INVOICE'}\n\nWe have received your Corporate Booking order request ${order.id}. No payment has been taken yet. A Sofnade team member will follow up shortly with an official invoice to confirm the details and arrange payment.`,
  );
}

async function sendEmail(order, subject, html, text) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RECEIPT_FROM;
  const c = order.customer || {};
  if (!key || !from || !c.email) return; // not configured / no recipient
  const payload = { from, to: [c.email], subject, html, text };
  if (process.env.ORDER_NOTIFY_EMAIL) payload.bcc = [process.env.ORDER_NOTIFY_EMAIL];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
async function sendReceipt(order) {
  return sendEmail(order, `Your Sofnade order ${order.id} is confirmed`, receiptHtml(order), receiptText(order));
}
async function sendRequestEmail(order) {
  return sendEmail(order, `Your Sofnade order ${order.id} — proforma invoice (payment to follow)`, requestHtml(order), requestText(order));
}

// Run both channels independently; never throws. Returns a small status array
// so callers can log what happened.
async function settleChannels(tasks, names) {
  const settled = await Promise.allSettled(tasks);
  return settled.map((r, i) => {
    if (r.status === 'rejected') console.error(`[notify] ${names[i]} failed:`, r.reason && r.reason.message);
    return { channel: names[i], ok: r.status === 'fulfilled' };
  });
}
async function onPaid(order) {
  return settleChannels(
    [mirrorToNotion(order), sendReceipt(order), xero.onPaid(order)],
    ['notion', 'resend', 'xero'],
  );
}
// Unpaid "Corporate Booking" flow: confirm the request was received (no payment
// taken); Xero gets an awaiting-payment invoice.
async function onOrderRequested(order) {
  return settleChannels(
    [mirrorToNotion(order), sendRequestEmail(order), xero.onRequested(order)],
    ['notion', 'resend', 'xero'],
  );
}

module.exports = { onPaid, onOrderRequested, mirrorToNotion, sendReceipt, sendRequestEmail };
