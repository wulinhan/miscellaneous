import type { ReactNode } from 'react';
import './globals.css';
import { CartProvider } from '@/lib/cart';
import Header from '@/components/Header';

export const metadata = {
  title: 'Sofnade',
  description: 'Bubble tea, house-baked cookies, snacks and festive gift sets.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
