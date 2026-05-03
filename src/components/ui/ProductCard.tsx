'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart';

interface ProductCardProps {
  product: Product;
  badge?: string;
}

const categoryColors: Record<string, { bg: string; text: string; label: string }> = {
  sealed: { bg: 'var(--color-primary)', text: '#fff', label: 'SEALED' },
  singles: { bg: 'var(--color-electric)', text: '#000', label: 'SINGLES' },
  graded: { bg: 'var(--color-gold)', text: '#000', label: 'GRADED' },
};

export default function ProductCard({ product, badge }: ProductCardProps) {
  const { addItem } = useCart();
  const cat = categoryColors[product.category] ?? categoryColors.singles;
  const soldOut = product.stock === 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (soldOut) return;
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      slug: product.slug,
    });
  }

  return (
    <Link href={`/shop/${product.slug}`} className="block group">
      <div
        className="relative flex flex-col h-full"
        style={{
          background: 'var(--color-light)',
          border: '3px solid #000',
          boxShadow: '4px 4px 0 #000',
          borderRadius: '4px',
          transition: 'box-shadow 0.08s, transform 0.08s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = 'translate(2px,2px)';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '2px 2px 0 #000';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.transform = '';
          (e.currentTarget as HTMLDivElement).style.boxShadow = '4px 4px 0 #000';
        }}
      >
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 z-10 px-2 py-0.5 text-xs font-bold"
          style={{
            background: cat.bg,
            color: cat.text,
            border: '2px solid #000',
            fontFamily: 'var(--font-bangers), serif',
            letterSpacing: '0.05em',
            borderRadius: '3px',
          }}
        >
          {cat.label}
        </div>

        {/* Live drop / featured badge */}
        {badge && (
          <div
            className="absolute top-3 right-3 z-10 px-2 py-0.5 text-xs"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: '2px solid #000',
              fontFamily: 'var(--font-bangers), serif',
              letterSpacing: '0.05em',
              borderRadius: '3px',
            }}
          >
            {badge}
          </div>
        )}

        {/* Sold out overlay */}
        {soldOut && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.55)', borderRadius: '2px' }}
          >
            <span
              className="px-4 py-2 text-white text-xl"
              style={{
                fontFamily: 'var(--font-bebas), serif',
                background: '#000',
                border: '3px solid #fff',
                letterSpacing: '0.08em',
              }}
            >
              SOLD OUT
            </span>
          </div>
        )}

        {/* Image */}
        <div className="relative w-full" style={{ aspectRatio: '3/4', borderBottom: '3px solid #000', overflow: 'hidden', background: '#e8e0d0' }}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#d0c8b8' }}>
              <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.2rem', color: '#888' }}>NO IMAGE</span>
            </div>
          )}

          {/* Grade badge for graded cards */}
          {product.category === 'graded' && product.grade && (
            <div
              className="absolute bottom-2 right-2 flex flex-col items-center justify-center w-14 h-14"
              style={{
                background: product.grade_company === 'PSA' ? '#003087' : product.grade_company === 'BGS' ? '#1a1a1a' : '#2d6a4f',
                border: '2px solid #fff',
                boxShadow: '2px 2px 0 #000',
                borderRadius: '2px',
              }}
            >
              <span style={{ fontFamily: 'var(--font-nunito), sans-serif', fontSize: '0.55rem', fontWeight: 700, color: '#c8a84b', letterSpacing: '0.1em' }}>
                {product.grade_company}
              </span>
              <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.6rem', color: '#fff', lineHeight: 1 }}>
                {product.grade}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3 gap-1">
          {product.set_name && (
            <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold truncate">
              {product.set_name}
            </span>
          )}
          <h3
            className="leading-tight line-clamp-2"
            style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.15rem', letterSpacing: '0.03em', color: 'var(--color-dark)' }}
          >
            {product.name}
          </h3>
          {product.condition && (
            <span className="text-xs text-gray-400 font-semibold">{product.condition}</span>
          )}
          <div className="mt-auto pt-3 flex items-center justify-between gap-2">
            <span
              style={{ fontFamily: 'var(--font-nunito), sans-serif', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-dark)' }}
            >
              ${product.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={soldOut}
              className={clsx('flex items-center gap-1 px-3 py-1.5 text-sm font-bold btn-comic', soldOut && 'opacity-40 cursor-not-allowed')}
              style={{
                background: soldOut ? '#ccc' : 'var(--color-primary)',
                color: '#fff',
                fontFamily: 'var(--font-nunito), sans-serif',
                borderRadius: '4px',
                border: '2px solid #000',
              }}
            >
              <ShoppingCart size={14} />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
