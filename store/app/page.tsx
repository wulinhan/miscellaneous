import Link from 'next/link';
import { getCatalog } from '@/lib/catalog';
import { orderNowMessage } from '@/lib/schedule';

export default async function Home() {
  const products = await getCatalog();
  const message = orderNowMessage(new Date());

  return (
    <main className="wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
      <section
        style={{
          background: 'var(--navy)',
          color: '#fff',
          borderRadius: 16,
          padding: '28px 24px',
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: '0 0 8px' }}>Order Sofnade</h1>
        <p style={{ margin: 0, color: '#fecd08', fontWeight: 600 }}>{message}</p>
      </section>

      <div className="grid">
        {products.map((p) => {
          const from = Math.min(...p.sizes.map((s) => s.price));
          return (
            <Link key={p.id} href={`/product/${p.id}`} className="card">
              <div className="thumb">{p.emoji ?? '🛍️'}</div>
              <div className="body">
                {p.category && <span className="cat">{p.category}</span>}
                <span className="title">{p.title}</span>
                {p.shortDesc && <span className="note">{p.shortDesc}</span>}
                <span className="price">from ${from.toFixed(2)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
