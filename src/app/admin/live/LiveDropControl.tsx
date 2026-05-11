'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, ExternalLink, Zap } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface LiveDrop {
  id: string;
  is_active: boolean;
  next_drop_at: string;
  stream_url: string | null;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  category: string;
  price: number;
  is_live_drop: boolean;
}

export default function LiveDropControl({ liveDrop, products: initialProducts }: { liveDrop: LiveDrop | null; products: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const router = useRouter();
  const supabase = createClient();

  const [isActive, setIsActive] = useState(liveDrop?.is_active ?? false);
  const [nextDropAt, setNextDropAt] = useState(
    liveDrop?.next_drop_at
      ? new Date(liveDrop.next_drop_at).toISOString().slice(0, 16) // datetime-local format
      : ''
  );
  const [streamUrl, setStreamUrl] = useState(liveDrop?.stream_url ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function toggleProduct(id: string, current: boolean) {
    const updated = !current;
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_live_drop: updated } : p));
    await fetch('/api/admin/live-products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_live_drop: updated }),
    });
  }

  async function handleToggleLive() {
    setSaving(true);
    const newActive = !isActive;
    if (liveDrop?.id) {
      await supabase.from('live_drops').update({ is_active: newActive }).eq('id', liveDrop.id);
    } else {
      await supabase.from('live_drops').insert({ is_active: newActive, next_drop_at: nextDropAt || new Date().toISOString(), stream_url: streamUrl });
    }
    setIsActive(newActive);
    setSaving(false);
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (liveDrop?.id) {
      await supabase.from('live_drops').update({
        next_drop_at: new Date(nextDropAt).toISOString(),
        stream_url: streamUrl,
      }).eq('id', liveDrop.id);
    } else {
      await supabase.from('live_drops').insert({
        is_active: false,
        next_drop_at: new Date(nextDropAt).toISOString(),
        stream_url: streamUrl,
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Live toggle card */}
      <div
        className="p-6"
        style={{
          background: isActive ? '#fef2f2' : '#fff',
          border: `3px solid ${isActive ? 'var(--color-primary)' : '#000'}`,
          boxShadow: '4px 4px 0 #000',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded"
              style={{ background: isActive ? 'var(--color-primary)' : '#e5e7eb', border: '2px solid #000' }}
            >
              <Radio size={18} color={isActive ? '#fff' : '#666'} />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">
                {isActive ? '🔴 LIVE NOW' : '⚫ OFFLINE'}
              </p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {isActive ? 'Your store is in live drop mode — customers can see live products.' : 'Flip to activate live drop mode sitewide.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleLive}
            disabled={saving}
            className="px-5 py-3 text-sm font-black uppercase btn-comic shrink-0"
            style={{
              background: isActive ? '#fff' : 'var(--color-primary)',
              color: isActive ? 'var(--color-primary)' : '#fff',
              fontFamily: 'var(--font-bebas), serif',
              letterSpacing: '0.08em',
              borderRadius: '4px',
              border: `3px solid ${isActive ? 'var(--color-primary)' : '#000'}`,
              minWidth: '120px',
            }}
          >
            {saving ? '...' : isActive ? 'GO OFFLINE' : 'GO LIVE'}
          </button>
        </div>
      </div>

      {/* Schedule & stream URL */}
      <form
        onSubmit={handleSave}
        className="p-6 flex flex-col gap-5"
        style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
      >
        <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
          DROP SCHEDULE
        </h2>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest">Next Drop Date & Time (CT)</label>
          <input
            type="datetime-local"
            value={nextDropAt}
            onChange={(e) => setNextDropAt(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm font-semibold"
            style={{ border: '3px solid #000', borderRadius: '4px', boxShadow: '3px 3px 0 #000', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
          />
          <p className="text-xs text-gray-400 font-semibold">This drives the countdown timer on the Live page and homepage banner.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest">Whatnot Stream URL</label>
          <input
            type="url"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="https://www.whatnot.com/user/..."
            className="w-full px-4 py-3 text-sm font-semibold"
            style={{ border: '3px solid #000', borderRadius: '4px', boxShadow: '3px 3px 0 #000', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
          />
        </div>

        {streamUrl && (
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
          >
            <ExternalLink size={12} />
            Preview Whatnot stream
          </a>
        )}

        <button
          type="submit"
          disabled={saving}
          className="self-start px-8 py-3 text-lg font-bold btn-comic"
          style={{
            background: saved ? '#22c55e' : 'var(--color-dark)',
            color: '#fff',
            fontFamily: 'var(--font-bebas), serif',
            letterSpacing: '0.08em',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ SAVED' : saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>

      {/* Live drop products */}
      <div
        className="overflow-hidden"
        style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
          <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
            LIVE DROP PRODUCTS
          </h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Toggle which products appear on the live page during a stream. {products.filter(p => p.is_live_drop).length} active.
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-semibold text-sm">
              No products in inventory yet.
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="flex items-center gap-4 px-6 py-3">
                <div className="relative w-9 h-12 shrink-0">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-contain" sizes="36px" />
                  ) : (
                    <div className="w-full h-full bg-gray-100" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm leading-tight truncate">{product.name}</p>
                  <p className="text-xs text-gray-400 font-semibold capitalize">{product.category} · ${product.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => toggleProduct(product.id, product.is_live_drop)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-widest shrink-0 transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                  style={{
                    background: product.is_live_drop ? 'var(--color-primary)' : '#fff',
                    color: product.is_live_drop ? '#fff' : '#000',
                    border: `2px solid ${product.is_live_drop ? 'var(--color-primary)' : '#000'}`,
                    boxShadow: product.is_live_drop ? 'none' : '2px 2px 0 #000',
                    borderRadius: '4px',
                  }}
                >
                  <Zap size={11} fill={product.is_live_drop ? '#fff' : 'none'} />
                  {product.is_live_drop ? 'In Drop' : 'Add'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
