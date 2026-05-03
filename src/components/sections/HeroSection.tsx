import Image from 'next/image';
import Link from 'next/link';
import SpeechBubble from '@/components/ui/SpeechBubble';
import { Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--color-electric)', borderBottom: '4px solid #000', minHeight: '85vh' }}
    >
      {/* Lightning bolt decorations */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <svg className="absolute top-10 left-8 opacity-20 float" width="60" height="120" viewBox="0 0 60 120">
          <polygon points="35,0 10,65 30,65 15,120 55,45 35,45 50,0" fill="#fff" />
        </svg>
        <svg className="absolute top-20 right-20 opacity-15 float-delay" width="40" height="80" viewBox="0 0 60 120">
          <polygon points="35,0 10,65 30,65 15,120 55,45 35,45 50,0" fill="#fff" />
        </svg>
        <svg className="absolute bottom-20 left-1/4 opacity-10 float-slow" width="50" height="100" viewBox="0 0 60 120">
          <polygon points="35,0 10,65 30,65 15,120 55,45 35,45 50,0" fill="#fff" />
        </svg>
        {/* Pokeball outlines */}
        {[
          { top: '15%', left: '5%', size: 60, opacity: 0.12 },
          { top: '60%', left: '2%', size: 40, opacity: 0.08 },
          { top: '10%', right: '5%', size: 80, opacity: 0.1 },
          { top: '70%', right: '8%', size: 50, opacity: 0.12 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full float-slow"
            style={{
              width: p.size,
              height: p.size,
              border: `${Math.max(2, p.size / 12)}px solid rgba(255,255,255,${p.opacity * 5})`,
              top: p.top,
              left: (p as { left?: string }).left,
              right: (p as { right?: string }).right,
              opacity: p.opacity * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12 min-h-[85vh]">
        {/* Left: text */}
        <div className="flex-1 flex flex-col gap-6">
          <h1
            className="leading-none"
            style={{
              fontFamily: 'var(--font-bebas), serif',
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              color: '#fff',
              textShadow: '5px 5px 0 #000, -1px -1px 0 #000',
              letterSpacing: '0.02em',
            }}
          >
            CATCH &apos;EM.<br />COLLECT &apos;EM.<br />OWN &apos;EM.
          </h1>
          <p
            className="text-white/90 text-lg font-semibold max-w-md"
            style={{ fontFamily: 'var(--font-nunito), sans-serif', textShadow: '1px 1px 0 rgba(0,0,0,0.5)' }}
          >
            Pokemon singles, sealed product & graded slabs — straight from Chingle Grumpus.
          </p>
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 text-xl btn-comic"
              style={{
                background: 'var(--color-yellow)',
                color: '#000',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.08em',
                borderRadius: '4px',
              }}
            >
              SHOP NOW
            </Link>
            <Link
              href="/live"
              className="inline-flex items-center gap-2 px-8 py-4 text-xl btn-comic"
              style={{
                background: 'var(--color-dark)',
                color: '#fff',
                fontFamily: 'var(--font-bebas), serif',
                letterSpacing: '0.08em',
                borderRadius: '4px',
              }}
            >
              <Zap size={20} fill="currentColor" />
              WATCH LIVE
            </Link>
          </div>
        </div>

        {/* Right: mascot */}
        <div className="relative flex-1 flex justify-center items-end md:items-center">
          <div
            className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden"
            style={{
              border: '5px solid #000',
              boxShadow: '8px 8px 0 #000',
            }}
          >
            <Image
              src="/mascot.jpeg"
              alt="Chingle Grumpus mascot"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 288px, 384px"
            />
          </div>
          {/* Speech bubble */}
          <div className="absolute bottom-0 right-0 md:-bottom-4 md:-right-4">
            <SpeechBubble text="NEW DROPS EVERY FRIDAY!" direction="left" />
          </div>
        </div>
      </div>
    </section>
  );
}
