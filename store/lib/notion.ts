// Mirror each paid order into the Notion "Orders" database so staff get a
// friendly fulfilment board. Notion is a VIEW, never the source of truth.

import type { OrderRecord } from './db';

export function isNotionConfigured(): boolean {
  return Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DB_ID);
}

export async function mirrorOrderToNotion(order: OrderRecord): Promise<string | null> {
  if (!isNotionConfigured()) return null;

  const itemsSummary = order.quote.lines
    .map((l) => `${l.qty}x ${l.title} (${l.size})`)
    .join(', ');

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        Order: { title: [{ text: { content: order.id } }] },
        Status: { select: { name: 'Paid' } },
        Customer: { rich_text: [{ text: { content: order.customer.name } }] },
        Phone: { phone_number: order.customer.phone },
        Email: { email: order.customer.email },
        Fulfilment: { select: { name: order.fulfilment === 'pickup' ? 'Pickup' : 'Delivery' } },
        'Order type': { select: { name: order.orderType === 'fresh' ? 'Fresh' : 'Shelf-stable' } },
        'Delivery date': order.deliveryDate
          ? { date: { start: order.deliveryDate } }
          : { date: null },
        'Slot or window': { rich_text: [{ text: { content: order.slotOrWindow ?? '' } }] },
        Items: { rich_text: [{ text: { content: itemsSummary.slice(0, 1900) } }] },
        Total: { number: order.quote.total },
        Currency: { rich_text: [{ text: { content: order.quote.currency } }] },
        'Razorpay payment id': {
          rich_text: [{ text: { content: order.razorpayPaymentId ?? '' } }],
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`Notion mirror failed: ${res.status} ${await res.text()}`);
  const page = (await res.json()) as { id: string };
  return page.id;
}
