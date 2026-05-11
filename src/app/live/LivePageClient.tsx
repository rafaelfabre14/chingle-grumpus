'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LiveDrop, Product } from '@/types';
import CountdownTimer from '@/components/ui/CountdownTimer';
import ProductCard from '@/components/ui/ProductCard';
import { createClient } from '@/lib/supabase/client';
import { ExternalLink, Zap } from 'lucide-react';

interface LivePageClientProps {
  liveDrop: LiveDrop | null;
  liveProducts: Product[];
}

export default function LivePageClient({ liveDrop, liveProducts }: LivePageClientProps) {
  const [email, setEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  async function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    setNotifyStatus('loading');
    const supabase = createClient();
    await supabase.from('email_signups').insert({
      email: email.toLowerCase().trim(),
      source: 'live_drop',
      marketing_opt_in: true,
    });
    setNotifyStatus('done');
  }

  const nextDrop = liveDrop?.next_drop_at ? new Date(liveDrop.next_drop_at) : null;

  if (liveDrop?.is_active) {
    return (
      <div>
        {/* Live now banner */}
        <div
          className="py-6 px-6 flex flex-col md:flex-row items-center justify-center gap-6 text-center"
          style={{ background: 'var(--color-primary)', borderBottom: '4px solid #000' }}
        >
          <div className="flex items-center gap-3">
            <span className="inline-block w-4 h-4 rounded-full pulse-dot" style={{ background: '#fff' }} />
            <span
              className="text-white text-3xl"
              style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.06em' }}
            >
              🔴 LIVE NOW — CHINGLE IS STREAMING
            </span>
          </div>
          {liveDrop.stream_url && (
            <a
              href={liveDrop.stream_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-xl btn-comic"
              style={{
                background: '#fff',
                color: 'var(--color-primary)',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.08em',
                borderRadius: '4px',
                border: '3px solid #000',
              }}
            >
              <ExternalLink size={18} />
              WATCH ON WHATNOT →
            </a>
          )}
        </div>

        {/* Live products */}
        {liveProducts.length > 0 && (
          <section className="py-12 px-6 max-w-6xl mx-auto">
            <h2
              className="text-4xl mb-8"
              style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em', color: 'var(--color-dark)' }}
            >
              JUST DROPPED ⚡
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveProducts.map((p) => (
                <ProductCard key={p.id} product={p} badge="JUST DROPPED ⚡" />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{ background: 'var(--color-electric)', borderBottom: '4px solid #000', minHeight: '80vh' }}
    >
      {/* Lightning decorations */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <svg className="absolute top-10 left-10 opacity-15 float" width="50" height="100" viewBox="0 0 60 120">
          <polygon points="35,0 10,65 30,65 15,120 55,45 35,45 50,0" fill="#fff" />
        </svg>
        <svg className="absolute bottom-16 right-16 opacity-10 float-delay" width="70" height="140" viewBox="0 0 60 120">
          <polygon points="35,0 10,65 30,65 15,120 55,45 35,45 50,0" fill="#fff" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-10">
        {/* Mascot */}
        <div
          className="w-36 h-36 rounded-full overflow-hidden"
          style={{ border: '5px solid #000', boxShadow: '6px 6px 0 #000' }}
        >
          <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={144} height={144} className="object-cover w-full h-full" />
        </div>

        <h1
          className="text-white leading-none"
          style={{ fontFamily: 'var(--font-bebas), serif', fontSize: 'clamp(3rem, 8vw, 6rem)', letterSpacing: '0.04em', textShadow: '4px 4px 0 #000' }}
        >
          THE NEXT DROP<br />IS COMING.
        </h1>

        {nextDrop && (
          <div
            className="p-8 text-white"
            style={{ background: 'rgba(0,0,0,0.4)', border: '3px solid #fff', borderRadius: '4px' }}
          >
            <CountdownTimer targetDate={nextDrop} />
          </div>
        )}

        <p
          className="text-white/80 text-base font-semibold max-w-md"
          style={{ fontFamily: 'var(--font-nunito), sans-serif' }}
        >
          Every Sunday, Chingle goes live on Whatnot for exclusive pulls, deals, and giveaways — cards you won&apos;t find anywhere else.
        </p>

        {/* Email capture */}
        <div
          className="w-full max-w-md p-6"
          style={{ background: 'var(--color-light)', border: '3px solid #000', boxShadow: '5px 5px 0 #000', borderRadius: '4px' }}
        >
          <p className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2 justify-center" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
            <Zap size={14} fill="currentColor" />
            GET NOTIFIED WHEN WE GO LIVE
          </p>
          {notifyStatus === 'done' ? (
            <p className="text-green-600 font-bold text-center">✓ We&apos;ll notify you before the next drop!</p>
          ) : (
            <form onSubmit={handleNotify} className="flex gap-3">
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
                disabled={notifyStatus === 'loading'}
                className="px-4 py-2 text-sm font-bold btn-comic"
                style={{ background: 'var(--color-primary)', color: '#fff', borderRadius: '4px', fontFamily: 'var(--font-nunito), sans-serif' }}
              >
                NOTIFY ME
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
