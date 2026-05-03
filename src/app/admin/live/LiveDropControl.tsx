'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface LiveDrop {
  id: string;
  is_active: boolean;
  next_drop_at: string;
  stream_url: string | null;
}

export default function LiveDropControl({ liveDrop }: { liveDrop: LiveDrop | null }) {
  const router = useRouter();
  const supabase = createClient();

  const [isActive, setIsActive] = useState(liveDrop?.is_active ?? false);
  const [nextDropAt, setNextDropAt] = useState(
    liveDrop?.next_drop_at
      ? new Date(liveDrop.next_drop_at).toISOString().slice(0, 16) // datetime-local format
      : ''
  );
  const [streamUrl, setStreamUrl] = useState(liveDrop?.stream_url ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleToggleLive() {
    setSaving(true);
    const newActive = !isActive;
    if (liveDrop?.id) {
      await supabase.from('live_drops').update({ is_active: newActive }).eq('id', liveDrop.id);
    } else {
      await supabase.from('live_drops').insert({ is_active: newActive, next_drop_at: nextDropAt || new Date().toISOString(), stream_url: streamUrl });
    }
    setIsActive(newActive);
    setSaving(false);
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (liveDrop?.id) {
      await supabase.from('live_drops').update({
        next_drop_at: new Date(nextDropAt).toISOString(),
        stream_url: streamUrl,
      }).eq('id', liveDrop.id);
    } else {
      await supabase.from('live_drops').insert({
        is_active: false,
        next_drop_at: new Date(nextDropAt).toISOString(),
        stream_url: streamUrl,
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Live toggle card */}
      <div
        className="p-6"
        style={{
          background: isActive ? '#fef2f2' : '#fff',
          border: `3px solid ${isActive ? 'var(--color-primary)' : '#000'}`,
          boxShadow: '4px 4px 0 #000',
          borderRadius: '4px',
          transition: 'background 0.2s',
        }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded"
              style={{ background: isActive ? 'var(--color-primary)' : '#e5e7eb', border: '2px solid #000' }}
            >
              <Radio size={18} color={isActive ? '#fff' : '#666'} />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-widest">
                {isActive ? '🔴 LIVE NOW' : '⚫ OFFLINE'}
              </p>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">
                {isActive ? 'Your store is in live drop mode — customers can see live products.' : 'Flip to activate live drop mode sitewide.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleLive}
            disabled={saving}
            className="px-5 py-3 text-sm font-black uppercase btn-comic shrink-0"
            style={{
              background: isActive ? '#fff' : 'var(--color-primary)',
              color: isActive ? 'var(--color-primary)' : '#fff',
              fontFamily: 'var(--font-bebas), serif',
              letterSpacing: '0.08em',
              borderRadius: '4px',
              border: `3px solid ${isActive ? 'var(--color-primary)' : '#000'}`,
              minWidth: '120px',
            }}
          >
            {saving ? '...' : isActive ? 'GO OFFLINE' : 'GO LIVE'}
          </button>
        </div>
      </div>

      {/* Schedule & stream URL */}
      <form
        onSubmit={handleSave}
        className="p-6 flex flex-col gap-5"
        style={{ background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
      >
        <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
          DROP SCHEDULE
        </h2>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest">Next Drop Date & Time (CT)</label>
          <input
            type="datetime-local"
            value={nextDropAt}
            onChange={(e) => setNextDropAt(e.target.value)}
            required
            className="w-full px-4 py-3 text-sm font-semibold"
            style={{ border: '3px solid #000', borderRadius: '4px', boxShadow: '3px 3px 0 #000', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
          />
          <p className="text-xs text-gray-400 font-semibold">This drives the countdown timer on the Live page and homepage banner.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest">Whatnot Stream URL</label>
          <input
            type="url"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            placeholder="https://www.whatnot.com/user/..."
            className="w-full px-4 py-3 text-sm font-semibold"
            style={{ border: '3px solid #000', borderRadius: '4px', boxShadow: '3px 3px 0 #000', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
          />
        </div>

        {streamUrl && (
          <a
            href={streamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline"
          >
            <ExternalLink size={12} />
            Preview Whatnot stream
          </a>
        )}

        <button
          type="submit"
          disabled={saving}
          className="self-start px-8 py-3 text-lg font-bold btn-comic"
          style={{
            background: saved ? '#22c55e' : 'var(--color-dark)',
            color: '#fff',
            fontFamily: 'var(--font-bebas), serif',
            letterSpacing: '0.08em',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
        >
          {saved ? '✓ SAVED' : saving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </form>
    </div>
  );
}
