'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { EmailSource } from '@/types';

interface GiveawayFormProps {
  source?: EmailSource;
}

function getWeekOf() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now);
  monday.setDate(diff);
  return monday.toISOString().split('T')[0];
}

export default function GiveawayForm({ source = 'giveaway' }: GiveawayFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    const supabase = createClient();

    const { error } = await supabase.from('giveaway_entries').insert({
      first_name: firstName,
      email: email.toLowerCase().trim(),
      marketing_opt_in: optIn,
      week_of: getWeekOf(),
    });

    if (error) {
      if (error.code === '23505') {
        setStatus('already');
        return;
      }
      setStatus('error');
      return;
    }

    if (optIn) {
      await supabase.from('email_signups').insert({
        email: email.toLowerCase().trim(),
        source,
        marketing_opt_in: true,
      });
    }

    setStatus('success');
  }

  if (status === 'success') {
    return (
      <div
        className="text-center p-8 border-comic shadow-comic"
        style={{ background: 'var(--color-light)', borderRadius: '4px' }}
      >
        <div className="text-5xl mb-3">🎉</div>
        <h3 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2rem', letterSpacing: '0.05em' }}>
          YOU&apos;RE IN!
        </h3>
        <p className="text-sm mt-2 text-gray-600">
          Winner announced Friday on Whatnot — make sure you&apos;re watching!
        </p>
      </div>
    );
  }

  if (status === 'already') {
    return (
      <div
        className="text-center p-8 border-comic shadow-comic"
        style={{ background: 'var(--color-light)', borderRadius: '4px' }}
      >
        <div className="text-4xl mb-3">⚡</div>
        <h3 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
          Already entered this week!
        </h3>
        <p className="text-sm mt-2 text-gray-600">Check back next week for another chance.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="First name"
        required
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full px-4 py-3 text-sm font-semibold"
        style={{
          border: '3px solid #000',
          borderRadius: '4px',
          boxShadow: '3px 3px 0 #000',
          background: '#fff',
          fontFamily: 'var(--font-nunito), sans-serif',
          outline: 'none',
        }}
      />
      <input
        type="email"
        placeholder="Email address"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 text-sm font-semibold"
        style={{
          border: '3px solid #000',
          borderRadius: '4px',
          boxShadow: '3px 3px 0 #000',
          background: '#fff',
          fontFamily: 'var(--font-nunito), sans-serif',
          outline: 'none',
        }}
      />
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-1 w-4 h-4 cursor-pointer accent-black"
        />
        <span className="text-xs font-semibold text-gray-600" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
          Yes, also send me drop alerts and exclusive deals
        </span>
      </label>

      {status === 'error' && (
        <p className="text-xs text-red-600 font-semibold">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-4 text-lg font-bold btn-comic"
        style={{
          background: 'var(--color-primary)',
          color: '#fff',
          fontFamily: 'var(--font-bebas), serif',
          letterSpacing: '0.08em',
          borderRadius: '4px',
          border: '3px solid #000',
        }}
      >
        {status === 'loading' ? 'ENTERING...' : 'ENTER THE GIVEAWAY'}
      </button>
    </form>
  );
}
