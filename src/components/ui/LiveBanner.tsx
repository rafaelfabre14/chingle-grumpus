'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LiveDrop } from '@/types';
import CountdownTimer from './CountdownTimer';

export default function LiveBanner() {
  const [liveDrop, setLiveDrop] = useState<LiveDrop | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetch() {
      const { data } = await supabase
        .from('live_drops')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) setLiveDrop(data as LiveDrop);
    }

    fetch();
    const id = setInterval(fetch, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!liveDrop) return null;

  function nextSundayISO() {
    const d = new Date();
    const daysUntilSunday = (7 - d.getUTCDay()) % 7 || 7;
    d.setUTCDate(d.getUTCDate() + daysUntilSunday);
    d.setUTCHours(0, 0, 0, 0);
    return d.toISOString();
  }

  const targetDate = liveDrop.next_drop_at && new Date(liveDrop.next_drop_at) > new Date()
    ? new Date(liveDrop.next_drop_at)
    : new Date(nextSundayISO());

  if (liveDrop.is_active) {
    return (
      <Link
        href="/live"
        className="flex items-center gap-2 font-bold text-sm uppercase"
        style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-primary)' }}
      >
        <span
          className="inline-block w-2.5 h-2.5 rounded-full pulse-dot"
          style={{ background: 'var(--color-primary)' }}
        />
        LIVE NOW — SHOP THE DROP →
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>
        ⚡ NEXT DROP:
      </span>
      <CountdownTimer targetDate={targetDate} className="text-sm" />
    </div>
  );
}
