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

async function sendReceipt(order) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RECEIPT_FROM;
  const c = order.customer || {};
  if (!key || !from || !c.email) return; // not configured / no recipient
  const when = order.delivery_date
    ? `<p>${order.fulfilment === 'delivery' ? 'Delivery' : 'Pick-up'} on <strong>${escapeHtml(order.delivery_date)}</strong>${
        order.slot_or_window ? ` (${escapeHtml(order.slot_or_window)})` : ''
      }.</p>`
    : '';
  const html = [
    `<h2>Thanks for your order, ${escapeHtml(c.name || '')}!</h2>`,
    `<p>Order <strong>${escapeHtml(order.id)}</strong> is confirmed and paid.</p>`,
    `<pre style="font:14px/1.5 ui-monospace,monospace">${escapeHtml(summaryLines(order).join('\n'))}</pre>`,
    when,
    `<p>We will be in touch with delivery details. - Sofnade</p>`,
  ].join('\n');
  const payload = {
    from,
    to: [c.email],
    subject: `Your Sofnade order ${order.id}`,
    html,
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
