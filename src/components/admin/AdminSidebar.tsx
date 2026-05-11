'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Mail, Radio, CreditCard, LogOut, ExternalLink, Package } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Inventory', href: '/admin/inventory', icon: Package },
  { label: 'Email Signups', href: '/admin/signups', icon: Mail },
  { label: 'Live Drop', href: '/admin/live', icon: Radio },
  { label: 'Stripe Setup', href: '/admin/stripe', icon: CreditCard },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <aside
      className="w-56 shrink-0 flex flex-col"
      style={{ background: 'var(--color-dark)', borderRight: '4px solid #000', minHeight: '100vh' }}
    >
      {/* Brand */}
      <div className="p-5 flex items-center gap-3" style={{ borderBottom: '3px solid rgba(255,255,255,0.1)' }}>
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid #fff' }}>
          <Image src="/mascot.jpeg" alt="" width={36} height={36} className="object-cover w-full h-full" />
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1rem', letterSpacing: '0.05em', color: '#fff', lineHeight: 1 }}>
            CHINGLE GRUMPUS
          </p>
          <p className="text-xs text-gray-500 font-semibold">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-5 py-3 text-sm font-bold transition-colors',
                active
                  ? 'text-black'
                  : 'text-gray-400 hover:text-white'
              )}
              style={active ? { background: 'var(--color-yellow)', borderLeft: '4px solid #000' } : { borderLeft: '4px solid transparent' }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 flex flex-col gap-2" style={{ borderTop: '3px solid rgba(255,255,255,0.1)' }}>
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-white transition-colors font-semibold"
        >
          <ExternalLink size={13} />
          View Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors font-semibold"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
