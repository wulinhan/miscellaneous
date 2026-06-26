'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { MAX_TOPPINGS, SUGAR_LEVELS } from '@/lib/catalog';
import type { AddOn, CatalogProduct } from '@/lib/types';

export default function ProductDetail({
  product,
  allAddOns,
}: {
  product: CatalogProduct;
  allAddOns: AddOn[];
}) {
  const { add } = useCart();
  const router = useRouter();

  const isFresh = product.kind === 'fresh';
  const toppings = useMemo(
    () => allAddOns.filter((a) => (product.addOnIds ?? []).includes(a.id)),
    [allAddOns, product.addOnIds],
  );

  const [sizeLabel, setSizeLabel] = useState(product.sizes[0].label);
  const [sugar, setSugar] = useState(SUGAR_LEVELS[0]);
  const [selected, setSelected] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const size = product.sizes.find((s) => s.label === sizeLabel)!;
  const addOnObjs = toppings.filter((t) => selected.includes(t.id));
  const unitPrice =
    Math.round((size.price + addOnObjs.reduce((s, a) => s + a.price, 0)) * 100) / 100;

  function toggleTopping(id: string) {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_TOPPINGS
          ? prev
          : [...prev, id],
    );
  }

  function addToCart() {
    add({
      productId: product.id,
      title: product.title,
      size: sizeLabel,
      sugar: isFresh ? sugar : undefined,
      unitPrice,
      qty,
      addOns: addOnObjs.map((a) => ({ id: a.id, title: a.title, price: a.price })),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <main className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <p className="note">
        <Link href="/">← Back to shop</Link>
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,360px) 1fr', gap: 28 }}>
        <div
          className="thumb"
          style={{ borderRadius: 16, fontSize: '6rem', minHeight: 320, overflow: 'hidden' }}
        >
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            (product.emoji ?? '🛍️')
          )}
        </div>
        <div>
          {product.category && <span className="cat">{product.category}</span>}
          <h1 style={{ margin: '4px 0 8px', color: 'var(--navy)' }}>{product.title}</h1>
          {product.shortDesc && <p className="note">{product.shortDesc}</p>}
          <p style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--navy)' }}>
            ${unitPrice.toFixed(2)}
          </p>

          {product.sizes.length > 1 && (
            <div className="field">
              <label>Size</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    className={`pill ${s.label === sizeLabel ? 'active' : ''}`}
                    onClick={() => setSizeLabel(s.label)}
                  >
                    {s.label} — ${s.price.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isFresh && (
            <div className="field">
              <label>Sugar level</label>
              <select value={sugar} onChange={(e) => setSugar(e.target.value)}>
                {SUGAR_LEVELS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {isFresh && toppings.length > 0 && (
            <div className="field">
              <label>Toppings (up to {MAX_TOPPINGS})</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {toppings.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`pill ${selected.includes(t.id) ? 'active' : ''}`}
                    onClick={() => toggleTopping(t.id)}
                  >
                    {t.title} +${t.price.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="qtybtn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span style={{ fontWeight: 700 }}>{qty}</span>
            <button className="qtybtn" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn" onClick={addToCart}>
              {added ? 'Added ✓' : `Add to cart — $${(unitPrice * qty).toFixed(2)}`}
            </button>
            <button className="btn btn-navy" onClick={() => router.push('/checkout')}>
              Go to checkout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
