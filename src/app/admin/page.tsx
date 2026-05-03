import { createServiceClient } from '@/lib/supabase/server';
import { ShoppingBag, Mail, DollarSign, Radio } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

interface OrderRow { id: string; total: number | null; status: string; created_at: string }
interface SignupRow { id: string; source: string; created_at: string }
interface GiveawayRow { id: string; created_at: string }
interface LiveDropRow { id: string; is_active: boolean; next_drop_at: string }

async function getStats() {
  const supabase = createServiceClient();
  const [orders, signups, giveaway, liveDrop] = await Promise.all([
    supabase.from('orders').select('id, total, status, created_at'),
    supabase.from('email_signups').select('id, source, created_at'),
    supabase.from('giveaway_entries').select('id, created_at'),
    supabase.from('live_drops').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle(),
  ]);
  return {
    orders: (orders.data ?? []) as OrderRow[],
    signups: (signups.data ?? []) as SignupRow[],
    giveaway: (giveaway.data ?? []) as GiveawayRow[],
    liveDrop: liveDrop.data as LiveDropRow | null,
  };
}

export default async function AdminOverview() {
  const { orders, signups, giveaway, liveDrop } = await getStats();

  const revenue = orders.filter(o => o.status === 'paid' || o.status === 'fulfilled')
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  const stats = [
    {
      label: 'Total Orders',
      value: orders.length,
      sub: `${orders.filter(o => o.status === 'paid').length} pending fulfillment`,
      icon: ShoppingBag,
      color: 'var(--color-primary)',
      href: '/admin/orders',
    },
    {
      label: 'Revenue',
      value: `$${revenue.toFixed(2)}`,
      sub: 'Stripe test mode',
      icon: DollarSign,
      color: '#22c55e',
      href: '/admin/orders',
    },
    {
      label: 'Email Subscribers',
      value: signups.length + giveaway.length,
      sub: `${signups.length} list · ${giveaway.length} giveaway`,
      icon: Mail,
      color: 'var(--color-electric)',
      href: '/admin/signups',
    },
    {
      label: 'Live Drop',
      value: liveDrop?.is_active ? '🔴 LIVE' : '⚫ Offline',
      sub: liveDrop?.next_drop_at
        ? `Next: ${new Date(liveDrop.next_drop_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`
        : 'No drop scheduled',
      icon: Radio,
      color: liveDrop?.is_active ? 'var(--color-primary)' : '#888',
      href: '/admin/live',
    },
  ];

  // Recent orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>
          OVERVIEW
        </h1>
        <p className="text-sm text-gray-500 font-semibold">Welcome back, Chingle.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block group">
            <div
              className="p-5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              style={{
                background: '#fff',
                border: '3px solid #000',
                boxShadow: '4px 4px 0 #000',
                borderRadius: '4px',
              }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded mb-3"
                style={{ background: stat.color, border: '2px solid #000' }}
              >
                <stat.icon size={18} color="#fff" />
              </div>
              <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.03em' }}>
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
            RECENT ORDERS
          </h2>
          <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest hover:underline text-gray-500">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div
            className="p-8 text-center text-gray-400 text-sm font-semibold"
            style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff' }}
          >
            No orders yet. Complete a test checkout to see orders here.
          </div>
        ) : (
          <div style={{ border: '3px solid #000', borderRadius: '4px', background: '#fff', overflow: 'hidden' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '3px solid #000', background: '#f5f0e8' }}>
                  {['Order ID', 'Email', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr
                    key={o.id}
                    style={{ borderBottom: i < recentOrders.length - 1 ? '2px solid #eee' : 'none' }}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">
                      #{o.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-semibold text-xs">—</td>
                    <td className="px-4 py-3 font-bold">${(o.total ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 text-xs font-bold rounded"
                        style={{
                          background: o.status === 'paid' ? '#dcfce7' : o.status === 'fulfilled' ? '#dbeafe' : '#fef9c3',
                          color: o.status === 'paid' ? '#166534' : o.status === 'fulfilled' ? '#1e40af' : '#854d0e',
                          border: '1px solid currentColor',
                        }}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
