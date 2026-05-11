'use client';

import { useState } from 'react';
import { Order } from '@/types';

const statusStyles: Record<string, { bg: string; color: string }> = {
  paid:      { bg: '#dcfce7', color: '#166534' },
  fulfilled: { bg: '#dbeafe', color: '#1e40af' },
  pending:   { bg: '#fef9c3', color: '#854d0e' },
};

function orderTag(n: number | null) {
  if (!n) return '—';
  return `CG-${String(n).padStart(6, '0')}`;
}

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState<string | null>(null);
  const [fulfilling, setFulfilling] = useState<string | null>(null);
  const [tracking, setTracking] = useState<Record<string, string>>({});

  function startFulfill(id: string) {
    setFulfilling(id);
  }

  async function confirmFulfill(id: string) {
    setLoading(id);
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'fulfilled', tracking_number: tracking[id] ?? '' }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'fulfilled' } : o));
    setFulfilling(null);
    setLoading(null);
  }

  if (orders.length === 0) {
    return (
      <div
        className="p-12 text-center text-gray-400 font-semibold"
        style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff' }}
      >
        No orders yet. Complete a test checkout to see orders here.
      </div>
    );
  }

  return (
    <div style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff', overflow: 'hidden', boxShadow: '4px 4px 0 #000' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
            {['Order', 'Customer', 'Items', 'Total', 'Ship To', 'Status', 'Date', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => {
            const s = statusStyles[o.status] ?? statusStyles.pending;
            const isFulfilling = fulfilling === o.id;
            return (
              <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? '2px solid #eee' : 'none' }}>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-bold">{orderTag(o.order_number)}</span>
                  <br />
                  <span className="font-mono text-xs text-gray-400">{o.customer_email ?? '—'}</span>
                </td>
                <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap">
                  {o.customer_name ?? '—'}
                  {o.customer_phone && <><br /><span className="text-gray-400 font-normal">{o.customer_phone}</span></>}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {Array.isArray(o.items) ? `${o.items.length} item${o.items.length !== 1 ? 's' : ''}` : '—'}
                </td>
                <td className="px-4 py-3 font-bold">${(o.total ?? 0).toFixed(2)}</td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {o.shipping_address ? (
                    <>
                      {o.shipping_address.street}<br />
                      {o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.zip}
                    </>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="px-2 py-0.5 text-xs font-bold rounded"
                    style={{ background: s.bg, color: s.color, border: '1px solid currentColor' }}
                  >
                    {o.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 min-w-[180px]">
                  {o.status !== 'fulfilled' && !isFulfilling && (
                    <button
                      onClick={() => startFulfill(o.id)}
                      className="px-3 py-1 text-xs font-bold btn-comic whitespace-nowrap"
                      style={{ background: 'var(--color-dark)', color: '#fff', borderRadius: '4px', fontFamily: 'var(--font-nunito), sans-serif' }}
                    >
                      MARK FULFILLED
                    </button>
                  )}
                  {o.status !== 'fulfilled' && isFulfilling && (
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        placeholder="Tracking # (optional)"
                        value={tracking[o.id] ?? ''}
                        onChange={(e) => setTracking((t) => ({ ...t, [o.id]: e.target.value }))}
                        className="w-full px-2 py-1 text-xs font-semibold"
                        style={{ border: '2px solid #000', borderRadius: '3px', outline: 'none', fontFamily: 'var(--font-nunito), sans-serif' }}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => confirmFulfill(o.id)}
                          disabled={loading === o.id}
                          className="flex-1 px-2 py-1 text-xs font-bold btn-comic"
                          style={{ background: '#166534', color: '#fff', borderRadius: '3px', fontFamily: 'var(--font-nunito), sans-serif', opacity: loading === o.id ? 0.5 : 1 }}
                        >
                          {loading === o.id ? '...' : 'CONFIRM'}
                        </button>
                        <button
                          onClick={() => setFulfilling(null)}
                          className="px-2 py-1 text-xs font-bold btn-comic"
                          style={{ background: '#e5e7eb', color: '#374151', borderRadius: '3px', fontFamily: 'var(--font-nunito), sans-serif' }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
