'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';

export default function Header() {
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="wrap inner">
        <Link href="/" className="brand">
          sofnade
        </Link>
        <Link href="/checkout" className="cart-link">
          Cart{count > 0 ? ` (${count})` : ''}
        </Link>
      </div>
    </header>
  );
}
