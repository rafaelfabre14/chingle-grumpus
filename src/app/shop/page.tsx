import { createClient } from '@/lib/supabase/server';
import { Product, Category } from '@/types';
import ProductCard from '@/components/ui/ProductCard';
import ShopFilters from './ShopFilters';

interface SearchParams {
  category?: string;
  sort?: string;
  sets?: string | string[];
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('products').select('*');

  const cat = params.category as Category | undefined;
  if (cat && ['sealed', 'singles', 'graded'].includes(cat)) {
    query = query.eq('category', cat);
  }

  const sets = params.sets
    ? Array.isArray(params.sets)
      ? params.sets
      : [params.sets]
    : [];
  if (sets.length > 0) {
    query = query.in('set_name', sets);
  }

  const sort = params.sort ?? 'newest';
  if (sort === 'price-asc') query = query.order('price', { ascending: true });
  else if (sort === 'price-desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: products } = await query;

  // Fetch all set names for filter sidebar
  const { data: setRows } = await supabase
    .from('products')
    .select('set_name')
    .not('set_name', 'is', null);
  const allSets = [...new Set((setRows ?? []).map((r) => r.set_name as string))].sort();

  return (
    <div style={{ background: 'var(--color-light)', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        className="py-10 px-6 text-center"
        style={{ background: 'var(--color-electric)', borderBottom: '4px solid #000' }}
      >
        <h1
          className="text-6xl md:text-8xl text-white"
          style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.04em', textShadow: '4px 4px 0 #000' }}
        >
          THE CARD SHOP
        </h1>
        <p className="mt-2 font-semibold text-sm text-white/80 uppercase tracking-widest">
          Singles · Sealed · Graded — New inventory added weekly
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8 items-start">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 shrink-0 sticky top-36">
          <ShopFilters allSets={allSets} />
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {/* Mobile filter button rendered inside ShopFilters */}
          <div className="md:hidden mb-4">
            <ShopFilters allSets={allSets} mobile />
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p as Product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2rem', color: 'var(--color-dark)' }}>
                No cards found.
              </p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
