'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useCart } from '@/lib/cart';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    clearCart();
    if (sessionId) {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    }
  }, [sessionId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleEmailCapture(e: React.FormEvent) {
    e.preventDefault();
    setSubStatus('loading');
    const supabase = createClient();
    await supabase.from('email_signups').insert({
      email: email.toLowerCase().trim(),
      source: 'order_success',
      marketing_opt_in: true,
    });
    setSubStatus('done');
    setEmailSent(true);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ background: 'var(--color-electric)' }}
    >
      {/* Mascot */}
      <div
        className="w-40 h-40 rounded-full overflow-hidden mb-8"
        style={{ border: '5px solid #000', boxShadow: '6px 6px 0 #000' }}
      >
        <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={160} height={160} className="object-cover w-full h-full" />
      </div>

      <div
        className="max-w-xl w-full px-8 py-10"
        style={{ background: 'var(--color-light)', border: '4px solid #000', boxShadow: '6px 6px 0 #000', borderRadius: '4px' }}
      >
        <div className="text-5xl mb-2">🎉</div>
        <h1
          className="leading-none mb-4"
          style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.8rem', letterSpacing: '0.05em', color: 'var(--color-dark)' }}
        >
          ORDER CONFIRMED!<br />YOU&apos;RE A TRUE COLLECTOR.
        </h1>

        {sessionId && (
          <p className="text-xs text-gray-400 mb-6 font-mono break-all">
            Order #{sessionId.slice(-8).toUpperCase()}
          </p>
        )}

        <p className="text-sm text-gray-600 mb-8">
          Your cards are heading your way soon. Check your email for confirmation details.
        </p>

        {/* Email capture */}
        {!emailSent ? (
          <form onSubmit={handleEmailCapture} className="flex flex-col gap-3 mb-6">
            <p className="text-sm font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
              ⚡ GET DROP ALERTS
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-semibold"
                style={{ border: '3px solid #000', borderRadius: '4px', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
              />
              <button
                type="submit"
                disabled={subStatus === 'loading'}
                className="px-4 py-2 text-sm font-bold btn-comic"
                style={{ background: 'var(--color-dark)', color: '#fff', borderRadius: '4px', fontFamily: 'var(--font-nunito), sans-serif' }}
              >
                JOIN
              </button>
            </div>
          </form>
        ) : (
          <p className="text-sm text-green-600 font-bold mb-6">✓ You&apos;re on the list!</p>
        )}

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
          KEEP SHOPPING
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-electric)' }}><span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2rem', color: '#fff' }}>LOADING...</span></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
