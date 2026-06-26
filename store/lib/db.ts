// Supabase (Postgres) access: the single source of truth for orders.
// Falls back to a no-op in-memory store when not configured, so the API
// routes are demonstrable locally without a database.

import type { Quote } from './pricing';
import type { CustomerDetails, Fulfilment, OrderType } from './types';

export interface OrderRecord {
  id: string;
  status: 'created' | 'paid' | 'preparing' | 'out_for_delivery' | 'fulfilled' | 'cancelled' | 'refunded';
  customer: CustomerDetails;
  fulfilment: Fulfilment;
  orderType: OrderType;
  deliveryDate?: string;
  slotOrWindow?: string;
  quote: Quote;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  notionPageId?: string;
  createdAt: string;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Local fallback store (process memory) used only when Supabase is unset.
const memory = new Map<string, OrderRecord>();

async function supabaseRequest(path: string, init: RequestInit) {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function insertOrder(order: OrderRecord): Promise<void> {
  if (!isDbConfigured()) {
    memory.set(order.id, order);
    return;
  }
  await supabaseRequest('orders', { method: 'POST', body: JSON.stringify(order) });
}

export async function markOrderPaid(razorpayOrderId: string, razorpayPaymentId: string): Promise<void> {
  if (!isDbConfigured()) {
    for (const o of memory.values()) {
      if (o.razorpayOrderId === razorpayOrderId) {
        o.status = 'paid';
        o.razorpayPaymentId = razorpayPaymentId;
      }
    }
    return;
  }
  await supabaseRequest(`orders?razorpay_order_id=eq.${razorpayOrderId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'paid', razorpay_payment_id: razorpayPaymentId }),
  });
}
