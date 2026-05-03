'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, Zap } from 'lucide-react';
import { useCart } from '@/lib/cart';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Live Drops', href: '/live' },
  { label: 'Giveaway', href: '/giveaway' },
];

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-40 w-full flex items-center justify-between px-4 md:px-8 py-3"
        style={{
          background: 'var(--color-light)',
          borderBottom: '3px solid #000',
          boxShadow: '0 3px 0 #000',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-10 h-10 rounded-full overflow-hidden"
            style={{ border: '3px solid #000', boxShadow: '2px 2px 0 #000' }}
          >
            <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={40} height={40} className="object-cover w-full h-full" />
          </div>
          <span
            className="hidden sm:block text-xl leading-none"
            style={{ fontFamily: 'var(--font-bebas), serif', color: 'var(--color-dark)', letterSpacing: '0.05em' }}
          >
            CHINGLE GRUMPUS
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest hover:text-[var(--color-primary)] transition-colors"
              style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/live"
            className="hidden md:flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase btn-comic"
            style={{
              background: 'var(--color-yellow)',
              fontFamily: 'var(--font-nunito), sans-serif',
              borderRadius: '4px',
            }}
          >
            <Zap size={14} fill="currentColor" />
            Watch Live
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 btn-comic"
            style={{ background: 'var(--color-primary)', borderRadius: '4px' }}
            aria-label="Cart"
          >
            <ShoppingCart size={18} color="#fff" />
            {count > 0 && (
              <span
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full"
                style={{
                  background: 'var(--color-dark)',
                  color: '#fff',
                  border: '2px solid #fff',
                  fontFamily: 'var(--font-nunito), sans-serif',
                }}
              >
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-10 h-10 btn-comic"
            style={{ background: 'var(--color-dark)', borderRadius: '4px' }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} color="#fff" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'var(--color-dark)' }}>
          <div className="flex items-center justify-between p-5" style={{ borderBottom: '3px solid #fff' }}>
            <span
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em' }}
            >
              CHINGLE GRUMPUS
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X size={28} color="#fff" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-4 text-3xl text-white border-b"
                style={{
                  fontFamily: 'var(--font-bebas), serif',
                  borderColor: 'rgba(255,255,255,0.15)',
                  letterSpacing: '0.05em',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="py-4 text-3xl text-white border-b"
              style={{
                fontFamily: 'var(--font-bebas), serif',
                borderColor: 'rgba(255,255,255,0.15)',
                letterSpacing: '0.05em',
              }}
            >
              Cart {count > 0 && `(${count})`}
            </Link>
          </nav>
          <div className="p-5 mt-auto">
            <Link
              href="/live"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-4 text-xl font-bold btn-comic"
              style={{
                background: 'var(--color-yellow)',
                borderRadius: '4px',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.05em',
              }}
            >
              <Zap size={18} fill="currentColor" />
              WATCH LIVE ON WHATNOT
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
