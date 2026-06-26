// Placeholder home page. The storefront UI (listing, product, checkout) will
// be ported here from the static mock. The delivery/fee engine and the API
// routes (/api/quote, /api/checkout, /api/razorpay-webhook) are already wired.

import { getCatalog } from '@/lib/catalog';
import { orderNowMessage } from '@/lib/schedule';

export default async function Home() {
  const products = await getCatalog();
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '40px auto', padding: '0 20px' }}>
      <h1>Sofnade store (scaffold)</h1>
      <p>{orderNowMessage(new Date())}</p>
      <h2>Sample catalog</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.title} — {p.kind} — from ${Math.min(...p.sizes.map((s) => s.price)).toFixed(2)}
          </li>
        ))}
      </ul>
      <p style={{ color: '#666' }}>
        API: POST /api/quote, POST /api/checkout, POST /api/razorpay-webhook
      </p>
    </main>
  );
}
