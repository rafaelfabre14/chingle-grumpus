import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { Product } from '@/types';
import ProductDetail from './ProductDetail';
import ProductCard from '@/components/ui/ProductCard';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) notFound();

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', product.id)
    .limit(3);

  return (
    <div style={{ background: 'var(--color-light)', minHeight: '100vh' }}>
      <ProductDetail product={product as Product} />

      {/* Related products */}
      {related && related.length > 0 && (
        <section style={{ borderTop: '4px solid #000', background: 'var(--color-light)' }} className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-4xl mb-8"
              style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.04em', color: 'var(--color-dark)' }}
            >
              YOU MIGHT ALSO LIKE
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p as Product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
