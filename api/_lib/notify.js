// Best-effort fulfilment notifications for a PAID order: mirror it into a Notion
// database (for staff) and email the customer a receipt via Resend. No SDKs —
// plain fetch. Each channel no-ops when its env vars are missing, and onPaid()
// never throws, so a notification failure can never fail the webhook/verify call.

function money(n, ccy) {
  return `${ccy || 'SGD'} ${Number(n || 0).toFixed(2)}`;
}

function summaryLines(order) {
  const q = order.quote || {};
  const lines = (q.items || []).map(
    (i) => `- ${i.qty} x ${i.title} (${i.size}) = ${money(i.lineTotal, q.currency)}`,
  );
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
    '',
    ...summaryLines(order),
    '',
    `Razorpay: ${order.razorpay_order_id || ''} / ${order.razorpay_payment_id || ''}`,
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
// Sofnade line. Used for the "Message us on WhatsApp" CTA in receipts.
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

// Branded, email-client-safe receipt: table layout + inline styles only (no
// <style> blocks / flexbox / external CSS, which many clients strip).
function receiptHtml(order) {
  const q = order.quote || {};
  const ccy = q.currency || 'SGD';
  const c = order.customer || {};

  const itemRows = (q.items || [])
    .map((i) => {
      const qty = Number(i.qty || 0);
      const unit = i.unitPrice != null ? Number(i.unitPrice) : (qty ? Number(i.lineTotal || 0) / qty : 0);
      return `<tr>
        <td width="68%" style="width:68%;padding:10px 8px 10px 0;border-bottom:1px solid #e6e7ec;font:14px/1.4 Arial,sans-serif;color:#1b2330;vertical-align:top;">
          <strong>${escapeHtml(i.title || '')}</strong>${i.size ? ` <span style="color:#6b7280;">(${escapeHtml(i.size)})</span>` : ''}<br>
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
        <span style="display:inline-block;margin-left:10px;font:bold 11px Arial,sans-serif;color:${NAVY};background:${GOLD};padding:3px 10px;border-radius:999px;">PAID</span>
      </td></tr>
      <tr><td style="padding:28px;">
        <h1 style="margin:0 0 6px;font:bold 20px Arial,sans-serif;color:#1b2330;">Thanks for your order, ${escapeHtml((c.name || '').split(' ')[0] || 'there')}!</h1>
        <p style="margin:0 0 18px;font:14px/1.6 Arial,sans-serif;color:#6b7280;">Order <strong style="color:#1b2330;">${escapeHtml(order.id)}</strong> is confirmed and paid. Here is your summary.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemRows}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-top:2px solid ${NAVY};padding-top:8px;">${totals}</table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 0;background:#f7f8fb;border-radius:10px;">
          <tr><td style="padding:14px 16px;font:14px/1.5 Arial,sans-serif;color:#1b2330;">
            <strong style="color:${NAVY};">${order.fulfilment === 'delivery' ? 'Delivery' : 'Pick-up'}</strong><br>${where}${when ? `<br>${when}` : ''}
          </td></tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 6px;">
          <tr><td align="center">
            <a href="${waHref(order)}" style="display:inline-block;background:${WA_GREEN};color:#ffffff;font:bold 15px Arial,sans-serif;text-decoration:none;padding:14px 26px;border-radius:999px;">Message us on WhatsApp</a>
          </td></tr>
        </table>
        <p style="margin:6px 0 0;font:13px/1.5 Arial,sans-serif;color:#6b7280;text-align:center;">Questions about your order? Reach us anytime at ${supportWaPretty()}.</p>
      </td></tr>
      <tr><td style="background:#f7f8fb;padding:18px 28px;border-top:1px solid #e6e7ec;">
        <p style="margin:0;font:12px/1.6 Arial,sans-serif;color:#9aa1ad;">Payment ref: ${escapeHtml(order.razorpay_payment_id || order.razorpay_order_id || '-')}<br>
        &copy; ${new Date().getFullYear()} Sofnade &middot; Crafted fresh &middot; Delivered across Singapore</p>
      </td></tr>
    </table>
   </td></tr>
  </table>
  </body></html>`;
}

// Plain-text alternative (improves deliverability and accessibility).
function receiptText(order) {
  const c = order.customer || {};
  const lines = [
    `Thanks for your order, ${c.name || ''}!`.trim(),
    `Order ${order.id} is confirmed and paid.`,
    '',
    ...summaryLines(order),
    '',
  ];
  if (order.delivery_date) {
    lines.push(
      `${order.fulfilment === 'delivery' ? 'Delivery' : 'Pick-up'}: ${order.delivery_date}${order.slot_or_window ? ` (${order.slot_or_window})` : ''}`,
    );
    lines.push('');
  }
  lines.push(`Questions? WhatsApp us at ${supportWaPretty()}: ${waHref(order)}`);
  lines.push('- Sofnade');
  return lines.join('\n');
}

async function sendReceipt(order) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RECEIPT_FROM;
  const c = order.customer || {};
  if (!key || !from || !c.email) return; // not configured / no recipient
  const payload = {
    from,
    to: [c.email],
    subject: `Your Sofnade order ${order.id} is confirmed`,
    html: receiptHtml(order),
    text: receiptText(order),
  };
  if (process.env.ORDER_NOTIFY_EMAIL) payload.bcc = [process.env.ORDER_NOTIFY_EMAIL];
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

// Run both channels independently; never throws. Returns a small status array
// so callers can log what happened.
async function onPaid(order) {
  const settled = await Promise.allSettled([mirrorToNotion(order), sendReceipt(order)]);
  const names = ['notion', 'resend'];
  return settled.map((r, i) => {
    if (r.status === 'rejected') console.error(`[notify] ${names[i]} failed:`, r.reason && r.reason.message);
    return { channel: names[i], ok: r.status === 'fulfilled' };
  });
}

module.exports = { onPaid, mirrorToNotion, sendReceipt };
