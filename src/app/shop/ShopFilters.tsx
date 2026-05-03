'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { Category } from '@/types';

const categories: { value: Category | ''; label: string }[] = [
  { value: '', label: 'All Cards' },
  { value: 'sealed', label: 'Sealed Product' },
  { value: 'singles', label: 'Singles' },
  { value: 'graded', label: 'Graded Slabs' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

interface ShopFiltersProps {
  allSets: string[];
  mobile?: boolean;
}

export default function ShopFilters({ allSets, mobile }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const currentCategory = searchParams.get('category') ?? '';
  const currentSort = searchParams.get('sort') ?? 'newest';
  const currentSets = searchParams.getAll('sets');

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggleSet(setName: string) {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.getAll('sets');
    params.delete('sets');
    if (existing.includes(setName)) {
      existing.filter((s) => s !== setName).forEach((s) => params.append('sets', s));
    } else {
      [...existing, setName].forEach((s) => params.append('sets', s));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
        >
          Category
        </h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat.value}
                checked={currentCategory === cat.value}
                onChange={() => updateParam('category', cat.value)}
                className="accent-black w-4 h-4"
              />
              <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
                {cat.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
        >
          Sort By
        </h3>
        <select
          value={currentSort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="w-full px-3 py-2 text-sm font-semibold"
          style={{
            border: '3px solid #000',
            borderRadius: '4px',
            background: '#fff',
            fontFamily: 'var(--font-nunito), sans-serif',
          }}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Set name */}
      {allSets.length > 0 && (
        <div>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
          >
            Set Name
          </h3>
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
            {allSets.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSets.includes(s)}
                  onChange={() => toggleSet(s)}
                  className="accent-black w-4 h-4"
                />
                <span className="text-sm" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
                  {s}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (mobile) {
    return (
      <>
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold btn-comic"
          style={{
            background: 'var(--color-dark)',
            color: '#fff',
            borderRadius: '4px',
            fontFamily: 'var(--font-nunito), sans-serif',
          }}
        >
          <SlidersHorizontal size={16} />
          FILTER & SORT
        </button>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--color-light)' }}>
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: '3px solid #000' }}
            >
              <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
                FILTER & SORT
              </span>
              <button onClick={() => setDrawerOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">{filterContent}</div>
            <div className="p-5" style={{ borderTop: '3px solid #000' }}>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full py-3 text-lg font-bold btn-comic"
                style={{
                  background: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-bebas), serif',
                  letterSpacing: '0.08em',
                }}
              >
                SHOW RESULTS
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className="p-5"
      style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px', background: '#fff' }}
    >
      {filterContent}
    </div>
  );
}
