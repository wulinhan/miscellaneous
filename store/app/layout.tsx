import type { ReactNode } from 'react';

export const metadata = {
  title: 'Sofnade',
  description: 'Bubble tea, house-baked cookies, snacks and festive gift sets.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
