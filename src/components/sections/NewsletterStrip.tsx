'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function NewsletterStrip() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const supabase = createClient();
    const { error } = await supabase.from('email_signups').insert({
      email: email.toLowerCase().trim(),
      source: 'homepage',
      marketing_opt_in: true,
    });
    setStatus(error ? 'error' : 'done');
  }

  return (
    <section
      className="py-16 px-6"
      style={{ background: 'var(--color-dark)', borderBottom: '4px solid #000' }}
    >
      <div className="max-w-xl mx-auto text-center">
        <h2
          className="text-white mb-2"
          style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '3rem', letterSpacing: '0.05em' }}
        >
          JOIN THE CREW
        </h2>
        <p
          className="mb-8 text-sm font-semibold"
          style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'rgba(255,255,255,0.65)' }}
        >
          Get early access to rare pulls, drop alerts, and exclusive giveaways.
        </p>

        {status === 'done' ? (
          <p className="text-green-400 font-bold text-lg" style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em' }}>
            ✓ YOU&apos;RE IN THE CREW!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 text-sm font-semibold"
              style={{
                border: '3px solid #fff',
                borderRadius: '4px',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                outline: 'none',
                fontFamily: 'var(--font-nunito), sans-serif',
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 text-lg font-bold btn-comic"
              style={{
                background: 'var(--color-yellow)',
                color: '#000',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.08em',
                borderRadius: '4px',
                border: '3px solid #fff',
              }}
            >
              {status === 'loading' ? '...' : 'JOIN NOW'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-xs mt-2 font-semibold">Something went wrong. Please try again.</p>
        )}
        <p className="text-xs mt-4" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-nunito), sans-serif' }}>
          We don&apos;t spam. Just drops, deals, and giveaways.
        </p>
      </div>
    </section>
  );
}
