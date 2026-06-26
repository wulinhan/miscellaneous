'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import type { Fulfilment } from '@/lib/types';

interface QuoteResp {
  schedule: {
    earliestDate: string;
    message: string;
    orderType: 'fresh' | 'shelf';
    needsSlot: boolean;
    specificTimeEligible: boolean;
    slots: string[];
    window: string | null;
  };
  quote: {
    subtotal: number;
    discount: number;
    discountCode: string | null;
    deliveryFee: number;
    surcharge: number;
    specificTimeFee: number;
    total: number;
    currency: string;
    freeDeliveryApplied: boolean;
    surchargeApplied: boolean;
  };
}

export default function CheckoutPage() {
  const { items, setQty, remove, clear } = useCart();

  const [fulfilment, setFulfilment] = useState<Fulfilment>('delivery');
  const [code, setCode] = useState('');
  const [specificTime, setSpecificTime] = useState(false);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [customer, setCustomer] = useState({
    name: '', phone: '', email: '', business: '',
    address1: '', address2: '', postal: '', notes: '',
  });

  const [data, setData] = useState<QuoteResp | null>(null);
  const [placing, setPlacing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const upd = (k: keyof typeof customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setCustomer((c) => ({ ...c, [k]: e.target.value }));

  const lines = items.map((i) => ({
    productId: i.productId,
    size: i.size,
    qty: i.qty,
    addOns: i.addOns.map((a) => a.id),
  }));

  const refreshQuote = useCallback(async () => {
    if (items.length === 0) {
      setData(null);
      return;
    }
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines, fulfilment, postal: customer.postal, code, specificTimeSelected: specificTime }),
    });
    if (res.ok) setData(await res.json());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(lines), fulfilment, customer.postal, code, specificTime]);

  useEffect(() => {
    const t = setTimeout(refreshQuote, 300);
    return () => clearTimeout(t);
  }, [refreshQuote]);

  // Default the date to the earliest available once known.
  useEffect(() => {
    if (data?.schedule.earliestDate && !date) setDate(data.schedule.earliestDate);
  }, [data?.schedule.earliestDate, date]);

  async function placeOrder() {
    setPlacing(true);
    setResult(null);
    try {
      const body = {
        lines,
        customer,
        fulfilment,
        deliveryDate: date,
        slotOrWindow: data?.schedule.needsSlot ? slot : data?.schedule.window ?? undefined,
        code,
        specificTimeSelected: specificTime,
      };
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setResult(`Error: ${json.error ?? res.status}`);
        return;
      }
      if (json.payment?.configured) {
        openRazorpay(json);
      } else {
        setResult(`Order ${json.orderId} placed (test mode, no payment). Total $${json.quote.total.toFixed(2)}.`);
        clear();
      }
    } catch (e) {
      setResult(`Error: ${(e as Error).message}`);
    } finally {
      setPlacing(false);
    }
  }

  function openRazorpay(json: {
    payment: { razorpayOrderId: string; keyId: string; amount: number; currency: string };
    orderId: string;
  }) {
    const open = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RZ = (window as any).Razorpay;
      const rz = new RZ({
        key: json.payment.keyId,
        order_id: json.payment.razorpayOrderId,
        amount: json.payment.amount,
        currency: json.payment.currency,
        name: 'Sofnade',
        description: json.orderId,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        handler: () => {
          setResult(`Payment submitted for ${json.orderId}. Confirmation will follow by email.`);
          clear();
        },
      });
      rz.open();
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) return open();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = open;
    document.body.appendChild(s);
  }

  if (items.length === 0 && !result) {
    return (
      <main className="wrap" style={{ paddingTop: 40, paddingBottom: 48 }}>
        <h1>Your cart is empty</h1>
        <p>
          <Link className="btn" href="/">Browse the shop</Link>
        </p>
      </main>
    );
  }

  const q = data?.quote;
  const sc = data?.schedule;

  return (
    <main className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <h1 style={{ color: 'var(--navy)' }}>Checkout</h1>

      {result && (
        <div className="panel" style={{ borderColor: 'var(--teal)' }}>
          <strong>{result}</strong>
          <p className="note" style={{ marginBottom: 0 }}>
            <Link href="/">Continue shopping</Link>
          </p>
        </div>
      )}

      {items.length > 0 && (
        <>
          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Your items</h2>
            {items.map((i) => (
              <div key={i.key} className="line-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{i.title}</div>
                  <div className="note">
                    {i.size}
                    {i.sugar ? ` · ${i.sugar}` : ''}
                    {i.addOns.length ? ` · ${i.addOns.map((a) => a.title).join(', ')}` : ''}
                  </div>
                </div>
                <button className="qtybtn" onClick={() => setQty(i.key, i.qty - 1)}>−</button>
                <span style={{ width: 24, textAlign: 'center' }}>{i.qty}</span>
                <button className="qtybtn" onClick={() => setQty(i.key, i.qty + 1)}>+</button>
                <div style={{ width: 70, textAlign: 'right', fontWeight: 600 }}>
                  ${(i.unitPrice * i.qty).toFixed(2)}
                </div>
                <button className="qtybtn" onClick={() => remove(i.key)} aria-label="Remove">×</button>
              </div>
            ))}
          </div>

          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Delivery</h2>
            <div className="field" style={{ display: 'flex', gap: 10 }}>
              <button
                className={`pill ${fulfilment === 'delivery' ? 'active' : ''}`}
                onClick={() => setFulfilment('delivery')}
              >
                Islandwide delivery
              </button>
              <button
                className={`pill ${fulfilment === 'pickup' ? 'active' : ''}`}
                onClick={() => setFulfilment('pickup')}
              >
                Self-pickup (free)
              </button>
            </div>

            {sc && <p className="note">{sc.message}</p>}

            <div className="row2">
              <div className="field">
                <label>{fulfilment === 'pickup' ? 'Pickup date' : 'Delivery date'}</label>
                <input
                  type="date"
                  value={date}
                  min={sc?.earliestDate}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              {sc?.needsSlot ? (
                <div className="field">
                  <label>Time slot (30 min)</label>
                  <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                    <option value="">Select a slot</option>
                    {sc.slots.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="field">
                  <label>Delivery window</label>
                  <input value={sc?.window ?? '9:00 AM to 5:00 PM'} readOnly />
                </div>
              )}
            </div>

            {fulfilment === 'delivery' && sc?.specificTimeEligible && (
              <label style={{ fontWeight: 500, display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="checkbox"
                  style={{ width: 'auto' }}
                  checked={specificTime}
                  onChange={(e) => setSpecificTime(e.target.checked)}
                />
                Specific Time Delivery (+$30) — choose a preferred time
              </label>
            )}
          </div>

          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Your details</h2>
            <div className="row2">
              <div className="field"><label>Name *</label><input value={customer.name} onChange={upd('name')} /></div>
              <div className="field"><label>Business (optional)</label><input value={customer.business} onChange={upd('business')} /></div>
            </div>
            <div className="row2">
              <div className="field"><label>Phone *</label><input value={customer.phone} onChange={upd('phone')} /></div>
              <div className="field"><label>Email *</label><input value={customer.email} onChange={upd('email')} /></div>
            </div>
            {fulfilment === 'delivery' && (
              <>
                <div className="field"><label>Address line 1 *</label><input value={customer.address1} onChange={upd('address1')} /></div>
                <div className="row2">
                  <div className="field"><label>Address line 2</label><input value={customer.address2} onChange={upd('address2')} /></div>
                  <div className="field"><label>Postal code *</label><input value={customer.postal} onChange={upd('postal')} maxLength={6} /></div>
                </div>
              </>
            )}
            <div className="field"><label>Order notes</label><textarea value={customer.notes} onChange={upd('notes')} rows={2} /></div>
          </div>

          <div className="panel">
            <h2 style={{ marginTop: 0 }}>Summary</h2>
            <div className="field" style={{ maxWidth: 280 }}>
              <label>Discount code</label>
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SOFNADE50" />
            </div>
            {q && (
              <div className="totals">
                <div><span>Subtotal</span><span>${q.subtotal.toFixed(2)}</span></div>
                {q.discount > 0 && (
                  <div><span>Discount {q.discountCode ? `(${q.discountCode})` : ''}</span><span>−${q.discount.toFixed(2)}</span></div>
                )}
                {fulfilment === 'delivery' && (
                  <div>
                    <span>Delivery {q.freeDeliveryApplied ? '(free over $150)' : ''}</span>
                    <span>{q.deliveryFee ? `$${q.deliveryFee.toFixed(2)}` : 'Free'}</span>
                  </div>
                )}
                {q.surcharge > 0 && (
                  <div><span>Transport surcharge</span><span>${q.surcharge.toFixed(2)}</span></div>
                )}
                {q.specificTimeFee > 0 && (
                  <div><span>Specific time delivery</span><span>${q.specificTimeFee.toFixed(2)}</span></div>
                )}
                <div className="grand"><span>Total</span><span>${q.total.toFixed(2)}</span></div>
              </div>
            )}

            <button
              className="btn btn-navy"
              style={{ marginTop: 16 }}
              disabled={placing || !q}
              onClick={placeOrder}
            >
              {placing ? 'Placing…' : q ? `Place order — $${q.total.toFixed(2)}` : 'Place order'}
            </button>
            <p className="note" style={{ marginTop: 10 }}>
              Items, prices and rules are a working setup. Payment runs through Razorpay once keys are connected.
            </p>
          </div>
        </>
      )}
    </main>
  );
}
