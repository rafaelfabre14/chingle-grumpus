'use client';

import { useState } from 'react';
import { Order } from '@/types';

const statusStyles: Record<string, { bg: string; color: string }> = {
  paid:      { bg: '#dcfce7', color: '#166534' },
  fulfilled: { bg: '#dbeafe', color: '#1e40af' },
  pending:   { bg: '#fef9c3', color: '#854d0e' },
};

export default function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState<string | null>(null);

  async function markFulfilled(id: string) {
    setLoading(id);
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: 'fulfilled' }),
    });
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'fulfilled' } : o));
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
            {['Order ID', 'Stripe Session', 'Customer Email', 'Items', 'Total', 'Status', 'Date', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => {
            const s = statusStyles[o.status] ?? statusStyles.pending;
            return (
              <tr key={o.id} style={{ borderBottom: i < orders.length - 1 ? '2px solid #eee' : 'none' }}>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  #{o.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-[120px] truncate">
                  {o.stripe_session_id?.slice(-12)}
                </td>
                <td className="px-4 py-3 text-xs font-semibold">
                  {o.customer_email ?? '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {Array.isArray(o.items) ? `${o.items.length} item${o.items.length !== 1 ? 's' : ''}` : '—'}
                </td>
                <td className="px-4 py-3 font-bold">${(o.total ?? 0).toFixed(2)}</td>
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
                <td className="px-4 py-3">
                  {o.status !== 'fulfilled' && (
                    <button
                      onClick={() => markFulfilled(o.id)}
                      disabled={loading === o.id}
                      className="px-3 py-1 text-xs font-bold btn-comic whitespace-nowrap"
                      style={{
                        background: loading === o.id ? '#e5e7eb' : 'var(--color-dark)',
                        color: loading === o.id ? '#6b7280' : '#fff',
                        borderRadius: '4px',
                        fontFamily: 'var(--font-nunito), sans-serif',
                        cursor: loading === o.id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {loading === o.id ? '...' : 'MARK FULFILLED'}
                    </button>
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
