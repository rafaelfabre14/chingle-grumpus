'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_THRESHOLD = 75;

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const emptyCustomer: CustomerInfo = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', state: '', zip: '',
};

function isComplete(c: CustomerInfo) {
  return !!(c.firstName && c.lastName && c.email && c.street && c.city && c.state && c.zip);
}

interface NominatimResult {
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    postcode?: string;
  };
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, count } = useCart();
  const [customer, setCustomer] = useState<CustomerInfo>(emptyCustomer);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 5) { setSuggestions([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=us&limit=5&q=${encodeURIComponent(query)}`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data: NominatimResult[] = await res.json();
      setSuggestions(data.filter(r => r.address?.house_number && r.address?.road));
    } catch { setSuggestions([]); }
  }, []);

  function handleStreetChange(val: string) {
    setCustomer(c => ({ ...c, street: val }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
    setShowSuggestions(true);
  }

  function selectSuggestion(r: NominatimResult) {
    const a = r.address!;
    const street = `${a.house_number || ''} ${a.road || ''}`.trim();
    const city = a.city || a.town || a.village || a.suburb || a.county || '';
    const state = a.state || '';
    const zip = a.postcode || '';
    setCustomer(c => ({ ...c, street, city, state, zip }));
    setSuggestions([]);
    setShowSuggestions(false);
  }

  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const orderTotal = total + shipping;

  function set(field: keyof CustomerInfo) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setCustomer(c => ({ ...c, [field]: e.target.value }));
  }

  function setPhone(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomer(c => ({ ...c, phone: formatPhone(e.target.value) }));
  }

  function setState(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomer(c => ({ ...c, state: e.target.value.toUpperCase().slice(0, 2) }));
  }

  function setZip(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomer(c => ({ ...c, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete(customer)) return;
    setLoading(true);
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, customer }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    else setLoading(false);
  }

  const inputCls = 'w-full px-3 py-2 text-sm font-semibold';
  const inputStyle = { border: '2px solid #000', borderRadius: '4px', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' };
  const labelCls = 'block text-xs font-black uppercase tracking-widest mb-1';

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-24 px-6" style={{ minHeight: '60vh', background: 'var(--color-light)' }}>
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
          <Link href="/shop" className="inline-block px-8 py-4 text-xl btn-comic" style={{ background: 'var(--color-primary)', color: '#fff', fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.08em', borderRadius: '4px' }}>
            SHOP NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-light)', minHeight: '100vh' }}>
      <div className="py-8 px-6 text-center" style={{ background: 'var(--color-dark)', borderBottom: '4px solid #000' }}>
        <h1 className="text-5xl md:text-7xl text-white" style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em', textShadow: '3px 3px 0 rgba(0,0,0,0.5)' }}>
          YOUR CART
        </h1>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Line items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.product_id} className="flex gap-4 p-4" style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px', background: '#fff' }}>
                <Link href={`/shop/${item.slug}`} className="shrink-0">
                  <div className="w-20 h-28 relative" style={{ border: '2px solid #000', borderRadius: '3px', overflow: 'hidden', background: '#e8e0d0' }}>
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" sizes="80px" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                </Link>
                <div className="flex-1 flex flex-col gap-2">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="leading-tight hover:underline" style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.2rem', letterSpacing: '0.03em' }}>
                      {item.name}
                    </h3>
                  </Link>
                  <span className="text-sm font-bold">${item.price.toFixed(2)} each</span>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex items-center" style={{ border: '2px solid #000', borderRadius: '4px', overflow: 'hidden' }}>
                      <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors" style={{ borderRight: '2px solid #000' }}>
                        <Minus size={14} />
                      </button>
                      <span className="px-3 py-1 text-sm font-bold" style={{ fontFamily: 'var(--font-nunito), sans-serif', minWidth: '36px', textAlign: 'center' }}>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-100 transition-colors" style={{ borderLeft: '2px solid #000' }}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-base ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                    <button type="button" onClick={() => removeItem(item.product_id)} className="text-gray-400 hover:text-red-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Customer info */}
            <div className="p-6 flex flex-col gap-5" style={{ border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px', background: '#fff' }}>
              <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                YOUR DETAILS
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input required autoComplete="given-name" value={customer.firstName} onChange={set('firstName')} placeholder="Ash" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input required autoComplete="family-name" value={customer.lastName} onChange={set('lastName')} placeholder="Ketchum" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls}>Email *</label>
                  <input required type="email" autoComplete="email" value={customer.email} onChange={set('email')} placeholder="ash@pokemon.com" className={inputCls} style={inputStyle} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" autoComplete="tel" value={customer.phone} onChange={setPhone} placeholder="(555) 000-0000" className={inputCls} style={inputStyle} />
                </div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.1rem', letterSpacing: '0.05em', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
                SHIPPING ADDRESS
              </h3>

              <div className="flex flex-col gap-4">
                <div className="relative">
                  <label className={labelCls}>Street Address *</label>
                  <input
                    required
                    autoComplete="off"
                    value={customer.street}
                    onChange={e => handleStreetChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Start typing your address…"
                    className={inputCls}
                    style={inputStyle}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-50 w-full bg-white mt-1 overflow-hidden" style={{ border: '2px solid #000', borderRadius: '4px', boxShadow: '4px 4px 0 #000' }}>
                      {suggestions.map((r, i) => (
                        <li
                          key={i}
                          onMouseDown={() => selectSuggestion(r)}
                          className="px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-50 truncate"
                          style={{ borderBottom: i < suggestions.length - 1 ? '1px solid #eee' : 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
                        >
                          {r.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className={labelCls}>City *</label>
                    <input required autoComplete="address-level2" value={customer.city} onChange={set('city')} placeholder="Pallet Town" className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls}>State *</label>
                    <input required autoComplete="address-level1" value={customer.state} onChange={setState} placeholder="CA" maxLength={2} className={inputCls} style={inputStyle} />
                  </div>
                  <div>
                    <label className={labelCls}>ZIP *</label>
                    <input required autoComplete="postal-code" value={customer.zip} onChange={setZip} placeholder="90210" inputMode="numeric" className={inputCls} style={inputStyle} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="p-6 sticky top-36" style={{ border: '3px solid #000', boxShadow: '5px 5px 0 #000', borderRadius: '4px', background: '#fff' }}>
            <h2 className="text-2xl mb-5" style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em', borderBottom: '2px solid #000', paddingBottom: '12px' }}>
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
                <p className="text-xs text-gray-500">Add ${(FREE_SHIPPING_THRESHOLD - total).toFixed(2)} more for free shipping!</p>
              )}
              <div className="flex justify-between text-lg font-bold pt-3" style={{ borderTop: '2px solid #000' }}>
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isComplete(customer)}
              className="w-full mt-6 py-4 text-xl font-bold btn-comic flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--color-primary)', color: '#fff', fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.08em', borderRadius: '4px' }}
            >
              <ShoppingCart size={20} />
              {loading ? 'REDIRECTING...' : 'PROCEED TO CHECKOUT'}
            </button>

            {!isComplete(customer) && (
              <p className="text-xs text-gray-400 font-semibold text-center mt-3">Fill in your details above to continue.</p>
            )}

            <Link href="/shop" className="block text-center mt-4 text-sm font-bold underline" style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
