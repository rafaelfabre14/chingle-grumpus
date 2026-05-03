import Link from 'next/link';
import StarburstBadge from '@/components/ui/StarburstBadge';

const categories = [
  {
    label: 'SEALED PRODUCT',
    slug: 'sealed',
    color: 'var(--color-electric)',
    textColor: '#000',
    desc: 'Booster boxes, ETBs, bundles — rip open your next hit.',
    starburst: 'electric' as const,
    badge: 'FRESH',
  },
  {
    label: 'SINGLES',
    slug: 'singles',
    color: 'var(--color-yellow)',
    textColor: '#000',
    desc: 'Chase cards, staples, secret rares — fill your binder.',
    starburst: 'yellow' as const,
    badge: 'HOT',
  },
  {
    label: 'GRADED SLABS',
    slug: 'graded',
    color: 'var(--color-gold)',
    textColor: '#000',
    desc: 'PSA, BGS, CGC certified — investment-grade collectibles.',
    starburst: 'red' as const,
    badge: 'RARE',
  },
];

export default function ShopByCategory() {
  return (
    <section style={{ borderBottom: '4px solid #000' }}>
      <div
        className="px-6 py-8"
        style={{ background: 'var(--color-dark)', borderBottom: '4px solid #000' }}
      >
        <h2
          className="text-center text-white"
          style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '3rem', letterSpacing: '0.05em' }}
        >
          SHOP BY CATEGORY
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ background: 'var(--color-light)' }}>
        {categories.map((cat, i) => (
          <div
            key={cat.slug}
            className="relative flex flex-col items-center justify-center gap-6 px-8 py-20 pt-24 text-center halftone"
            style={{
              background: cat.color,
              borderRight: i < categories.length - 1 ? '4px solid #000' : undefined,
              borderBottom: '0',
            }}
          >
            <div className="absolute top-4 right-4">
              <StarburstBadge text={cat.badge} color={cat.starburst} size={110} />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-bebas), serif',
                fontSize: '2.5rem',
                letterSpacing: '0.05em',
                color: cat.textColor,
                textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
              }}
            >
              {cat.label}
            </h3>
            <p
              className="text-sm font-semibold max-w-xs"
              style={{ fontFamily: 'var(--font-nunito), sans-serif', color: cat.textColor, opacity: 0.8 }}
            >
              {cat.desc}
            </p>
            <Link
              href={`/shop?category=${cat.slug}`}
              className="px-6 py-3 text-lg btn-comic"
              style={{
                background: 'var(--color-dark)',
                color: '#fff',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.08em',
                borderRadius: '4px',
              }}
            >
              SHOP {cat.label.split(' ')[0]} →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
