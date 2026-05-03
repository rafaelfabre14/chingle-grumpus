import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import Image from 'next/image';

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-16 px-6" style={{ background: 'var(--color-light)', borderBottom: '4px solid #000' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '3px solid #000', boxShadow: '2px 2px 0 #000' }}>
            <Image src="/mascot.jpeg" alt="" width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '3rem', letterSpacing: '0.04em', color: 'var(--color-dark)' }}>
            CHINGLE&apos;S PICKS
          </h2>
        </div>
        <p className="text-sm text-gray-500 font-semibold mb-8 uppercase tracking-widest">
          Hand-picked by the Grumpus himself
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} badge="FEATURED" />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block px-8 py-4 text-xl btn-comic"
            style={{
              background: 'var(--color-dark)',
              color: '#fff',
              fontFamily: 'var(--font-bebas), serif',
              letterSpacing: '0.08em',
              borderRadius: '4px',
            }}
          >
            VIEW ALL CARDS →
          </Link>
        </div>
      </div>
    </section>
  );
}
