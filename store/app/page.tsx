import Link from 'next/link';
import { getCatalog } from '@/lib/catalog';
import { getSettings } from '@/lib/settings';
import { orderNowMessage } from '@/lib/schedule';

export default async function Home() {
  const [products, settings] = await Promise.all([getCatalog(), getSettings()]);
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
        <h1 style={{ margin: '0 0 8px', whiteSpace: 'pre-line' }}>{settings.heroTitle}</h1>
        {settings.heroSubtitle && (
          <p style={{ margin: '0 0 8px', color: '#e6eefc' }}>{settings.heroSubtitle}</p>
        )}
        <p style={{ margin: 0, color: '#fecd08', fontWeight: 600 }}>{message}</p>
      </section>

      <div className="grid">
        {products.map((p) => {
          const from = Math.min(...p.sizes.map((s) => s.price));
          return (
            <Link key={p.id} href={`/product/${p.id}`} className="card">
              <div className="thumb">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  p.emoji ?? '🛍️'
                )}
              </div>
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
