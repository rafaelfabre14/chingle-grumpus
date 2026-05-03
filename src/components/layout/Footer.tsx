import Link from 'next/link';
import Image from 'next/image';
import { Tv2, AtSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-dark)', borderTop: '4px solid #000', color: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden" style={{ border: '3px solid #fff' }}>
                <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={48} height={48} className="object-cover w-full h-full" />
              </div>
              <span style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em' }}>
                CHINGLE GRUMPUS
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Pokemon singles, sealed product & graded slabs — straight from the Grumpus himself.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Navigate</span>
            {[
              { label: 'Shop', href: '/shop' },
              { label: 'Live Drops', href: '/live' },
              { label: 'Giveaway', href: '/giveaway' },
              { label: 'Cart', href: '/cart' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Find Us</span>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <Tv2 size={16} />
              Whatnot — @chinglegrumpus
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <AtSign size={16} />
              Instagram — @chinglegrumpus
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs text-gray-500">
            © 2025 Chingle Grumpus. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Powered by{' '}
            <a href="https://maticusa.com" className="text-gray-400 hover:text-white transition-colors">
              Matic AI
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
