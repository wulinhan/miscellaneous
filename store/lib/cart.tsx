'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface CartAddOn {
  id: string;
  title: string;
  price: number;
}

export interface CartItem {
  key: string; // unique per product+size+addons+sugar
  productId: string;
  title: string;
  size: string;
  sugar?: string;
  unitPrice: number; // display only; server recomputes authoritative price
  qty: number;
  addOns: CartAddOn[];
}

interface CartContextValue {
  items: CartItem[];
  add: (item: Omit<CartItem, 'key'>) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'sofnade-cart-v1';

function makeKey(i: Omit<CartItem, 'key'>): string {
  const addons = i.addOns.map((a) => a.id).sort().join(',');
  return [i.productId, i.size, i.sugar ?? '', addons].join('|');
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add: CartContextValue['add'] = (item) => {
    const key = makeKey(item);
    setItems((prev) => {
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, { ...item, key }];
    });
  };

  const setQty: CartContextValue['setQty'] = (key, qty) =>
    setItems((prev) =>
      prev.flatMap((p) => (p.key === key ? (qty <= 0 ? [] : [{ ...p, qty }]) : [p])),
    );

  const remove: CartContextValue['remove'] = (key) =>
    setItems((prev) => prev.filter((p) => p.key !== key));

  const clear = () => setItems([]);

  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = Math.round(items.reduce((s, i) => s + i.unitPrice * i.qty, 0) * 100) / 100;

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
