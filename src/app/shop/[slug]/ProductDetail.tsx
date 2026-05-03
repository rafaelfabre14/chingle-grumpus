'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart';

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  sealed: { bg: 'var(--color-primary)', text: '#fff', label: 'SEALED PRODUCT' },
  singles: { bg: 'var(--color-electric)', text: '#000', label: 'SINGLE CARD' },
  graded: { bg: 'var(--color-gold)', text: '#000', label: 'GRADED SLAB' },
};

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const cat = categoryColors[product.category] ?? categoryColors.singles;
  const soldOut = product.stock === 0;

  function handleAdd() {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: qty,
      image_url: product.image_url,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const attrs = [
    { label: 'Category', value: product.category },
    { label: 'Set', value: product.set_name },
    { label: 'Condition', value: product.condition },
    ...(product.grade ? [{ label: 'Grade', value: product.grade }] : []),
    ...(product.grade_company ? [{ label: 'Grading Co.', value: product.grade_company }] : []),
  ].filter((a) => a.value);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-wider hover:underline"
        style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
      >
        <ArrowLeft size={16} />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div
          className="relative"
          style={{
            border: '4px solid #000',
            boxShadow: '6px 6px 0 #000',
            borderRadius: '4px',
            background: '#e8e0d0',
            aspectRatio: '3/4',
            overflow: 'hidden',
          }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', color: '#888' }}>NO IMAGE</span>
            </div>
          )}

          {product.category === 'graded' && product.grade && (
            <div
              className="absolute bottom-4 right-4 flex flex-col items-center justify-center w-20 h-20"
              style={{
                background: product.grade_company === 'PSA' ? '#003087' : product.grade_company === 'BGS' ? '#1a1a1a' : '#2d6a4f',
                border: '3px solid #fff',
                boxShadow: '3px 3px 0 #000',
                borderRadius: '2px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.65rem', fontWeight: 700, color: '#c8a84b', letterSpacing: '0.1em' }}>
                {product.grade_company}
              </span>
              <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', color: '#fff', lineHeight: 1 }}>
                {product.grade}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {/* Category badge */}
          <div
            className="inline-flex self-start px-3 py-1 text-sm"
            style={{
              background: cat.bg,
              color: cat.text,
              border: '2px solid #000',
              fontFamily: 'var(--font-bangers), serif',
              letterSpacing: '0.06em',
              borderRadius: '3px',
            }}
          >
            {cat.label}
          </div>

          <h1
            className="leading-none"
            style={{ fontFamily: 'var(--font-bebas), serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '0.03em', color: 'var(--color-dark)' }}
          >
            {product.name}
          </h1>

          {product.set_name && (
            <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{product.set_name}</p>
          )}

          <p style={{ fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, fontSize: '2.5rem', color: 'var(--color-dark)' }}>
            ${product.price.toFixed(2)}
          </p>

          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          )}

          {/* Quantity + Add to cart */}
          {!soldOut ? (
            <div className="flex items-center gap-4">
              <div
                className="flex items-center"
                style={{ border: '3px solid #000', borderRadius: '4px', boxShadow: '3px 3px 0 #000', overflow: 'hidden' }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-3 py-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  style={{ borderRight: '3px solid #000' }}
                >
                  <Minus size={16} />
                </button>
                <span
                  className="px-5 py-2 font-bold text-lg"
                  style={{ fontFamily: 'var(--font-nunito), sans-serif', minWidth: '48px', textAlign: 'center' }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-3 py-2 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  style={{ borderLeft: '3px solid #000' }}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-lg font-bold btn-comic"
                style={{
                  background: added ? '#22c55e' : 'var(--color-primary)',
                  color: '#fff',
                  fontFamily: 'var(--font-bebas), serif',
                  letterSpacing: '0.06em',
                  borderRadius: '4px',
                  transition: 'background 0.2s',
                }}
              >
                <ShoppingCart size={20} />
                {added ? 'ADDED! ✓' : 'ADD TO CART'}
              </button>
            </div>
          ) : (
            <div
              className="py-3 text-center text-xl"
              style={{
                border: '3px solid #000',
                background: '#ddd',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.08em',
                borderRadius: '4px',
              }}
            >
              SOLD OUT
            </div>
          )}

          {/* Attributes table */}
          {attrs.length > 0 && (
            <div style={{ border: '3px solid #000', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
              {attrs.map((a, i) => (
                <div
                  key={a.label}
                  className="flex"
                  style={{ borderBottom: i < attrs.length - 1 ? '2px solid #000' : 'none' }}
                >
                  <span
                    className="px-4 py-2 text-xs font-bold uppercase tracking-widest w-36 shrink-0"
                    style={{ borderRight: '2px solid #000', background: '#f5f0e8', fontFamily: 'var(--font-nunito), sans-serif' }}
                  >
                    {a.label}
                  </span>
                  <span
                    className="px-4 py-2 text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-nunito), sans-serif' }}
                  >
                    {a.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
