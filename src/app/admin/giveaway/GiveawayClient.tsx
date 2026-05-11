'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Trophy, Users, Gift, CheckCircle, Mail, RotateCcw, Save } from 'lucide-react';

interface Entry {
  id: string;
  first_name: string;
  email: string;
  week_of: string;
  created_at: string;
}

interface Winner {
  id: string;
  week_of: string;
  status: 'drawn' | 'contacted' | 'claimed';
  entry: { first_name: string; email: string } | null;
  prize: { name: string; image_url: string | null } | null;
}

interface Product {
  id: string;
  name: string;
  image_url: string | null;
}

function getCurrentWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  return monday.toISOString().split('T')[0];
}

function formatWeek(iso: string) {
  return new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_FLOW: Record<Winner['status'], { next: Winner['status'] | null; label: string; color: string; nextLabel: string | null }> = {
  drawn:     { next: 'contacted', label: 'Winner Drawn',   color: '#fef9c3', nextLabel: 'Mark Contacted' },
  contacted: { next: 'claimed',   label: 'Contacted',      color: '#dbeafe', nextLabel: 'Mark Claimed' },
  claimed:   { next: null,        label: 'Claimed ✓',      color: '#dcfce7', nextLabel: null },
};

export default function GiveawayClient({
  initialEntries,
  initialWinners,
  products,
  initialActivePrizeId,
}: {
  initialEntries: Entry[];
  initialWinners: Winner[];
  products: Product[];
  initialActivePrizeId: string | null;
}) {
  const [entries] = useState<Entry[]>(initialEntries);
  const [winners, setWinners] = useState<Winner[]>(initialWinners);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [drawPrizeId, setDrawPrizeId] = useState('');
  const [drawing, setDrawing] = useState(false);
  const [drawError, setDrawError] = useState('');

  // Active prize state (what the public giveaway page shows)
  const [activePrizeId, setActivePrizeId] = useState(initialActivePrizeId ?? '');
  const [savingPrize, setSavingPrize] = useState(false);
  const [prizeSaved, setPrizeSaved] = useState(false);

  const weeks = useMemo(() => {
    const set = new Set(entries.map(e => e.week_of));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [entries]);

  const weekEntries = entries.filter(e => e.week_of === selectedWeek);
  const weekWinner = winners.find(w => w.week_of === selectedWeek);
  const pastWinners = winners.filter(w => w.week_of !== selectedWeek);

  const activePrizeProduct = products.find(p => p.id === activePrizeId);

  async function saveActivePrize() {
    setSavingPrize(true);
    try {
      await fetch('/api/admin/giveaway-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active_prize_product_id: activePrizeId || null }),
      });
      setPrizeSaved(true);
      setTimeout(() => setPrizeSaved(false), 2000);
    } finally {
      setSavingPrize(false);
    }
  }

  async function drawWinner() {
    setDrawError('');
    setDrawing(true);
    try {
      const res = await fetch('/api/admin/giveaway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week_of: selectedWeek, prize_product_id: drawPrizeId || activePrizeId || null }),
      });
      const data = await res.json();
      if (!res.ok) { setDrawError(data.error ?? 'Failed to draw winner.'); return; }
      setWinners(prev => [data.winner, ...prev.filter(w => w.week_of !== selectedWeek)]);
    } finally {
      setDrawing(false);
    }
  }

  async function advanceStatus(winner: Winner) {
    const next = STATUS_FLOW[winner.status].next;
    if (!next) return;
    setWinners(prev => prev.map(w => w.id === winner.id ? { ...w, status: next } : w));
    await fetch('/api/admin/giveaway', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: winner.id, status: next }),
    });
  }

  const inputStyle = { border: '2px solid #000', borderRadius: '4px', outline: 'none' };
  const cardStyle = { background: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>GIVEAWAY</h1>
        <p className="text-sm text-gray-500 font-semibold">
          {entries.length} total entries · {winners.length} winners drawn
        </p>
      </div>

      {/* Active prize — what the public page shows */}
      <div className="mb-6 p-5" style={cardStyle}>
        <p className="text-xs font-black uppercase tracking-widest mb-1 flex items-center gap-2">
          <Gift size={13} /> Active Prize <span className="text-gray-400 font-semibold normal-case tracking-normal">— shown on the public giveaway page</span>
        </p>
        <p className="text-xs text-gray-400 font-semibold mb-4">Set this first. It updates the site immediately.</p>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <select
              value={activePrizeId}
              onChange={e => { setActivePrizeId(e.target.value); setPrizeSaved(false); }}
              className="w-full px-3 py-2.5 text-sm font-semibold"
              style={inputStyle}
            >
              <option value="">— No active prize —</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={saveActivePrize}
            disabled={savingPrize}
            className="flex items-center gap-2 px-5 py-2.5 font-black text-sm uppercase tracking-widest shrink-0 transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
            style={{
              background: prizeSaved ? '#22c55e' : 'var(--color-dark)',
              color: '#fff',
              border: '3px solid #000',
              boxShadow: '3px 3px 0 #000',
              borderRadius: '4px',
            }}
          >
            <Save size={13} />
            {prizeSaved ? 'Saved!' : savingPrize ? 'Saving...' : 'Save Prize'}
          </button>
        </div>

        {activePrizeProduct && (
          <div className="mt-4 flex items-center gap-3 p-3 rounded" style={{ background: '#f0fdf4', border: '2px solid #bbf7d0' }}>
            {activePrizeProduct.image_url && (
              <div className="relative w-10 h-14 shrink-0">
                <Image src={activePrizeProduct.image_url} alt={activePrizeProduct.name} fill className="object-contain" sizes="40px" />
              </div>
            )}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-700">Live on site ✓</p>
              <p className="text-sm font-bold mt-0.5">{activePrizeProduct.name}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-1 flex flex-col gap-5">

          {/* Week selector */}
          <div className="p-5" style={cardStyle}>
            <p className="text-xs font-black uppercase tracking-widest mb-3">Week</p>
            <select
              value={selectedWeek}
              onChange={e => setSelectedWeek(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-semibold mb-1"
              style={inputStyle}
            >
              <option value={getCurrentWeek()}>This week ({formatWeek(getCurrentWeek())})</option>
              {weeks.filter(w => w !== getCurrentWeek()).map(w => (
                <option key={w} value={w}>{formatWeek(w)}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-8 h-8 flex items-center justify-center rounded" style={{ background: 'var(--color-electric)', border: '2px solid #000' }}>
                <Users size={14} color="#fff" />
              </div>
              <div>
                <p className="text-2xl font-black leading-none" style={{ fontFamily: 'var(--font-bebas), serif' }}>{weekEntries.length}</p>
                <p className="text-xs text-gray-400 font-semibold">entries this week</p>
              </div>
            </div>
          </div>

          {/* Draw winner */}
          <div className="p-5" style={cardStyle}>
            <p className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2">
              <Trophy size={13} /> Draw Winner
            </p>
            <p className="text-xs text-gray-400 font-semibold mb-3">
              Override prize for this draw only (optional — defaults to active prize above).
            </p>
            <select
              value={drawPrizeId}
              onChange={e => setDrawPrizeId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm font-semibold mb-4"
              style={inputStyle}
            >
              <option value="">Use active prize</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            {weekWinner ? (
              <button
                onClick={() => { if (confirm('Redraw a new winner for this week?')) drawWinner(); }}
                className="w-full flex items-center justify-center gap-2 py-3 font-black text-sm uppercase tracking-widest"
                style={{ background: '#fff', border: '3px solid #000', borderRadius: '4px' }}
              >
                <RotateCcw size={14} /> Redraw
              </button>
            ) : (
              <button
                onClick={drawWinner}
                disabled={drawing || weekEntries.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3 font-black text-sm uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-40"
                style={{ background: 'var(--color-primary)', color: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0 #000', borderRadius: '4px' }}
              >
                <Trophy size={15} />
                {drawing ? 'Drawing...' : weekEntries.length === 0 ? 'No entries yet' : 'Draw Winner'}
              </button>
            )}
            {drawError && <p className="text-xs text-red-600 font-bold mt-2">{drawError}</p>}
          </div>
        </div>

        {/* Right col */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* This week's winner */}
          <div className="p-5" style={cardStyle}>
            <p className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Trophy size={13} /> This Week&apos;s Winner
            </p>
            {!weekWinner ? (
              <div className="py-8 text-center text-gray-400 font-semibold text-sm">No winner drawn yet for this week.</div>
            ) : (
              <div className="flex items-start gap-4">
                {weekWinner.prize?.image_url && (
                  <div className="relative w-14 h-20 shrink-0">
                    <Image src={weekWinner.prize.image_url} alt={weekWinner.prize.name} fill className="object-contain" sizes="56px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: STATUS_FLOW[weekWinner.status].color, border: '1px solid #000' }}>
                      {STATUS_FLOW[weekWinner.status].label.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{formatWeek(weekWinner.week_of)}</span>
                  </div>
                  <p className="font-black text-lg leading-tight" style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.03em' }}>
                    {weekWinner.entry?.first_name ?? '—'}
                  </p>
                  <p className="text-sm text-gray-500 font-semibold">{weekWinner.entry?.email ?? '—'}</p>
                  {weekWinner.prize && <p className="text-xs text-gray-400 mt-1">Prize: {weekWinner.prize.name}</p>}
                  <div className="flex gap-2 mt-3">
                    {weekWinner.entry?.email && (
                      <a
                        href={`mailto:${weekWinner.entry.email}?subject=You won the Chingle Grumpus giveaway!`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest"
                        style={{ border: '2px solid #000', borderRadius: '4px', background: '#f5f0e8' }}
                      >
                        <Mail size={11} /> Email Winner
                      </a>
                    )}
                    {STATUS_FLOW[weekWinner.status].next && (
                      <button
                        onClick={() => advanceStatus(weekWinner)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                        style={{ background: 'var(--color-primary)', color: '#fff', border: '2px solid #000', boxShadow: '2px 2px 0 #000', borderRadius: '4px' }}
                      >
                        <CheckCircle size={11} /> {STATUS_FLOW[weekWinner.status].nextLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Entries list */}
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div className="px-5 py-3" style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
              <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Users size={13} /> Entries — {formatWeek(selectedWeek)} ({weekEntries.length})
              </p>
            </div>
            {weekEntries.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-semibold text-sm">No entries for this week yet.</div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {weekEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="font-bold text-sm">{entry.first_name}</p>
                      <p className="text-xs text-gray-400">{entry.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {weekWinner?.entry?.email === entry.email && (
                        <span className="text-xs font-black text-yellow-600">🏆 WINNER</span>
                      )}
                      <p className="text-xs text-gray-400">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Past winners */}
      {pastWinners.length > 0 && (
        <div className="mt-8" style={{ ...cardStyle, overflow: 'hidden' }}>
          <div className="px-5 py-3" style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
            <p className="text-xs font-black uppercase tracking-widest">Past Winners</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '2px solid #eee' }}>
                {['Week', 'Winner', 'Email', 'Prize', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-black uppercase tracking-widest text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pastWinners.map((w, i) => (
                <tr key={w.id} style={{ borderBottom: i < pastWinners.length - 1 ? '1px solid #eee' : 'none' }}>
                  <td className="px-5 py-3 text-xs font-semibold text-gray-500">{formatWeek(w.week_of)}</td>
                  <td className="px-5 py-3 font-bold">{w.entry?.first_name ?? '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{w.entry?.email ?? '—'}</td>
                  <td className="px-5 py-3 text-xs text-gray-500">{w.prize?.name ?? '—'}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 text-xs font-bold rounded" style={{ background: STATUS_FLOW[w.status].color, border: '1px solid #000' }}>
                      {STATUS_FLOW[w.status].label.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
