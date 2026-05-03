'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_THRESHOLD = 75;

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart();

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const orderTotal = total + shipping;

  async function handleCheckout() {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  if (count === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-8 py-24 px-6"
        style={{ minHeight: '60vh', background: 'var(--color-light)' }}
      >
        <div className="text-center">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-6" style={{ border: '4px solid #000', boxShadow: '4px 4px 0 #000' }}>
            <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={128} height={128} className="object-cover w-full h-full" />
          </div>
          <div
            className="inline-block mb-4 px-4 py-2"
            style={{ background: 'var(--color-light)', border: '3px solid #000', boxShadow: '3px 3px 0 #000', borderRadius: '4px', fontFamily: 'var(--font-bangers), serif', fontSize: '1.2rem', letterSpacing: '0.04em' }}
          >
            YOUR CART IS EMPTY, TRAINER. GO CATCH SOME CARDS.
          </div>
          <p className="text-gray-500 text-sm mb-8">Add some Pokemon cards to your cart to get started.</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-4 text-xl btn-comic"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              fontFamily: 'var(--font-bebas), serif',
              letterSpacing: '0.08em',
              borderRadius: '4px',
            }}
          >
            SHOP NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-light)', minHeight: '100vh' }}>
      <div
        className="py-8 px-6 text-center"
        style={{ background: 'var(--color-dark)', borderBottom: '4px solid #000' }}
      >
        <h1
          className="text-5xl md:text-7xl text-white"
          style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em', textShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}
        >
          YOUR CART
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Line items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex gap-4 p-4"
              style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px', background: '#fff' }}
            >
              <Link href={`/shop/${item.slug}`} className="shrink-0">
                <div className="w-20 h-28 relative" style={{ border: '2px solid #000', borderRadius: '3px', overflow: 'hidden', background: '#e8e0d0' }}>
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200" />
                  )}
                </div>
              </Link>

              <div className="flex-1 flex flex-col gap-2">
                <Link href={`/shop/${item.slug}`}>
                  <h3
                    className="leading-tight hover:underline"
                    style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.2rem', letterSpacing: '0.03em' }}
                  >
                    {item.name}
                  </h3>
                </Link>
                <span className="text-sm font-bold" style={{ color: 'var(--color-dark)' }}>
                  ${item.price.toFixed(2)} each
                </span>

                <div className="flex items-center gap-3 mt-auto">
                  <div className="flex items-center" style={{ border: '2px solid #000', borderRadius: '4px', overflow: 'hidden' }}>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      style={{ borderRight: '2px solid #000' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-bold" style={{ fontFamily: 'var(--font-nunito), sans-serif', minWidth: '36px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="px-2 py-1 hover:bg-gray-100 transition-colors"
                      style={{ borderLeft: '2px solid #000' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span className="font-bold text-base ml-auto" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div
          className="p-6 sticky top-36"
          style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', borderRadius: '4px', background: '#fff' }}
        >
          <h2
            className="text-2xl mb-5"
            style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em', borderBottom: '2px solid #000', paddingBottom: '12px' }}
          >
            ORDER SUMMARY
          </h2>

          <div className="flex flex-col gap-3 text-sm font-semibold">
            <div className="flex justify-between">
              <span>Subtotal ({count} items)</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-500">
                Add ${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} more for free shipping!
              </p>
            )}
            <div
              className="flex justify-between text-lg font-bold pt-3"
              style={{ borderTop: '2px solid #000' }}
            >
              <span>Total</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full mt-6 py-4 text-xl font-bold btn-comic flex items-center justify-center gap-2"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              fontFamily: 'var(--font-bebas), serif',
              letterSpacing: '0.08em',
              borderRadius: '4px',
            }}
          >
            <ShoppingCart size={20} />
            PROCEED TO CHECKOUT
          </button>

          <Link
            href="/shop"
            className="block text-center mt-4 text-sm font-bold underline"
            style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
