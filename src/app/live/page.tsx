import { createClient } from '@/lib/supabase/server';
import { LiveDrop, Product } from '@/types';
import LivePageClient from './LivePageClient';
import ProductCard from '@/components/ui/ProductCard';

export const revalidate = 0;

export default async function LivePage() {
  const supabase = await createClient();

  const { data: liveDrop } = await supabase
    .from('live_drops')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  // If DB date is in the past (expired), compute next Sunday instead
  function nextSundayISO() {
    const d = new Date();
    const daysUntilSunday = (7 - d.getUTCDay()) % 7 || 7;
    d.setUTCDate(d.getUTCDate() + daysUntilSunday);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
  }

  const dropNextAt = liveDrop?.next_drop_at && new Date(liveDrop.next_drop_at) > new Date()
    ? liveDrop.next_drop_at
    : nextSundayISO();

  const fallbackDrop = liveDrop ? { ...liveDrop, next_drop_at: dropNextAt } : {
    id: 'fallback',
    is_active: false,
    next_drop_at: dropNextAt,
    stream_url: 'https://www.whatnot.com/user/chinglegrumpus',
    created_at: new Date().toISOString(),
  };

  const { data: liveProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_live_drop', true);

  const { data: recentProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div style={{ background: 'var(--color-light)', minHeight: '100vh' }}>
      <LivePageClient liveDrop={fallbackDrop as LiveDrop} liveProducts={(liveProducts ?? []) as Product[]} />

      {/* From last drop */}
      {recentProducts && recentProducts.length > 0 && !fallbackDrop.is_active && (
        <section className="py-12 px-6" style={{ borderTop: '4px solid #000' }}>
          <div className="max-w-6xl mx-auto">
            <h2
              className="text-3xl mb-8"
              style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em', color: 'var(--color-dark)' }}
            >
              FROM LAST DROP
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProducts.map((p) => (
                <ProductCard key={p.id} product={p as Product} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
