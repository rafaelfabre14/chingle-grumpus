'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Plus, X, Search, Trash2, Star } from 'lucide-react';
import { Product } from '@/types';

interface TcgCard {
  id: string;
  name: string;
  set: { name: string; id: string };
  images: { small: string; large: string };
}

const CATEGORIES = ['singles', 'sealed', 'graded'] as const;
const CONDITIONS = ['Near Mint', 'Lightly Played', 'Moderately Played', 'Heavily Played'];
const GRADE_COMPANIES = ['PSA', 'BGS', 'CGC'];

const emptyForm = {
  name: '',
  price: '',
  category: 'singles' as typeof CATEGORIES[number],
  stock: '1',
  set_name: '',
  condition: '',
  grade: '',
  grade_company: '',
  image_url: '',
  featured: false,
};

export default function InventoryClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [tcgQuery, setTcgQuery] = useState('');
  const [tcgResults, setTcgResults] = useState<TcgCard[]>([]);
  const [tcgLoading, setTcgLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchTcg = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) { setTcgResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setTcgLoading(true);
      try {
        const res = await fetch(`/api/admin/tcg-search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setTcgResults(data.cards ?? []);
      } finally {
        setTcgLoading(false);
      }
    }, 400);
  }, []);

  useEffect(() => { searchTcg(tcgQuery); }, [tcgQuery, searchTcg]);

  function selectCard(card: TcgCard) {
    setForm(f => ({
      ...f,
      name: f.name || card.name,
      set_name: f.set_name || card.set.name,
      image_url: card.images.large,
    }));
    setTcgResults([]);
    setTcgQuery('');
  }

  async function handleSave() {
    setError('');
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to save.'); return; }
      setProducts(prev => [data.product, ...prev]);
      setForm(emptyForm);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  async function toggleFeatured(product: Product) {
    const updated = !product.featured;
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, featured: updated } : p));
    await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id, featured: updated }),
    });
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>
            INVENTORY
          </h1>
          <p className="text-sm text-gray-500 font-semibold">{products.length} products</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setError(''); }}
          className="flex items-center gap-2 px-5 py-2.5 font-black text-sm uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          style={{ background: 'var(--color-primary)', color: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add product form */}
      {showForm && (
        <div
          className="mb-8 p-6 relative"
          style={{ background: '#fff', border: '3px solid #000', boxShadow: '6px 6px 0 #000', borderRadius: '4px' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
              NEW PRODUCT
            </h2>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); setTcgResults([]); setTcgQuery(''); }}>
              <X size={20} />
            </button>
          </div>

          {/* TCG Image Search */}
          <div className="mb-5">
            <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Search Pokémon TCG</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={tcgQuery}
                onChange={e => setTcgQuery(e.target.value)}
                placeholder="e.g. Charizard ex, Umbreon VMAX..."
                className="w-full pl-9 pr-4 py-2.5 text-sm font-semibold"
                style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            {tcgLoading && (
              <p className="text-xs text-gray-400 font-semibold mt-2">Searching...</p>
            )}

            {tcgResults.length > 0 && (
              <div className="mt-3 grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                {tcgResults.map(card => (
                  <button
                    key={card.id}
                    onClick={() => selectCard(card)}
                    className="group relative flex flex-col items-center gap-1 p-1 transition-transform hover:scale-105"
                    style={{ border: '2px solid #000', borderRadius: '4px', background: '#fafafa' }}
                    title={`${card.name} — ${card.set.name}`}
                  >
                    <div className="relative w-full aspect-[2.5/3.5]">
                      <Image src={card.images.small} alt={card.name} fill className="object-contain" sizes="80px" />
                    </div>
                    <span className="text-xs font-bold leading-tight text-center line-clamp-2">{card.name}</span>
                    <span className="text-xs text-gray-400 leading-tight text-center line-clamp-1">{card.set.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Selected image preview */}
            {form.image_url && (
              <div className="mt-3 flex items-center gap-3">
                <div className="relative w-16 h-24">
                  <Image src={form.image_url} alt="Selected" fill className="object-contain" sizes="64px" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-green-600">Image selected</p>
                  <button
                    onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                    className="text-xs text-gray-400 hover:text-red-500 font-semibold mt-1"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Product Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Charizard ex Full Art"
                className="w-full px-3 py-2.5 text-sm font-semibold"
                style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                placeholder="29.99"
                className="w-full px-3 py-2.5 text-sm font-semibold"
                style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Stock *</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm font-semibold"
                style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof CATEGORIES[number] }))}
                className="w-full px-3 py-2.5 text-sm font-semibold"
                style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Set Name</label>
              <input
                type="text"
                value={form.set_name}
                onChange={e => setForm(f => ({ ...f, set_name: e.target.value }))}
                placeholder="e.g. Obsidian Flames"
                className="w-full px-3 py-2.5 text-sm font-semibold"
                style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            {form.category === 'singles' && (
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Condition</label>
                <select
                  value={form.condition}
                  onChange={e => setForm(f => ({ ...f, condition: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm font-semibold"
                  style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
                >
                  <option value="">— Select —</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            {form.category === 'graded' && (
              <>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Grade</label>
                  <input
                    type="text"
                    value={form.grade}
                    onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}
                    placeholder="e.g. 10"
                    className="w-full px-3 py-2.5 text-sm font-semibold"
                    style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-1.5">Grade Company</label>
                  <select
                    value={form.grade_company}
                    onChange={e => setForm(f => ({ ...f, grade_company: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm font-semibold"
                    style={{ border: '2px solid #000', borderRadius: '4px', outline: 'none' }}
                  >
                    <option value="">— Select —</option>
                    {GRADE_COMPANIES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </>
            )}

            <div className="col-span-2 flex items-center gap-2 mt-1">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                className="w-4 h-4"
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <label htmlFor="featured" className="text-sm font-bold">Feature on homepage</label>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 font-black text-sm uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--color-primary)', color: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
            >
              {saving ? 'Saving...' : 'Save Product'}
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(emptyForm); setTcgResults([]); setTcgQuery(''); }}
              className="px-6 py-2.5 font-black text-sm uppercase tracking-widest"
              style={{ background: '#fff', border: '3px solid #000', borderRadius: '4px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product table */}
      {products.length === 0 ? (
        <div
          className="p-12 text-center text-gray-400 font-semibold"
          style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff' }}
        >
          No products yet. Add your first one above.
        </div>
      ) : (
        <div style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff', overflow: 'hidden' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
                {['', 'Product', 'Category', 'Price', 'Stock', 'Featured', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr
                  key={p.id}
                  style={{ borderBottom: i < products.length - 1 ? '2px solid #eee' : 'none' }}
                >
                  <td className="px-3 py-2">
                    {p.image_url ? (
                      <div className="relative w-10 h-14">
                        <Image src={p.image_url} alt={p.name} fill className="object-contain" sizes="40px" />
                      </div>
                    ) : (
                      <div className="w-10 h-14 bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-bold">—</div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <p className="font-black text-sm leading-tight">{p.name}</p>
                    {p.set_name && <p className="text-xs text-gray-400 font-semibold">{p.set_name}</p>}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded"
                      style={{
                        background: p.category === 'singles' ? '#dbeafe' : p.category === 'sealed' ? '#dcfce7' : '#fef9c3',
                        color: p.category === 'singles' ? '#1e40af' : p.category === 'sealed' ? '#166534' : '#854d0e',
                        border: '1px solid currentColor',
                      }}
                    >
                      {p.category.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-bold">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-2 font-bold">{p.stock}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => toggleFeatured(p)}
                      title={p.featured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star
                        size={18}
                        fill={p.featured ? 'var(--color-yellow)' : 'none'}
                        stroke={p.featured ? '#000' : '#ccc'}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                      className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
