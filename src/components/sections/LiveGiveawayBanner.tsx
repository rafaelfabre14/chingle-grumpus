import Link from 'next/link';
import LiveBanner from '@/components/ui/LiveBanner';

export default function LiveGiveawayBanner() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2"
      style={{ background: 'var(--color-yellow)', borderBottom: '4px solid #000', borderTop: '4px solid #000' }}
    >
      {/* Live drop */}
      <div
        className="flex items-center justify-center gap-4 px-6 py-5"
        style={{ borderBottom: '4px solid #000', borderRight: 'none' }}
      >
        <LiveBanner />
      </div>

      {/* Giveaway */}
      <div
        className="flex items-center justify-center px-6 py-5"
        style={{ borderTop: '4px solid #000' }}
      >
        <Link
          href="/giveaway"
          className="font-bold text-base uppercase tracking-widest hover:underline flex items-center gap-2"
          style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)' }}
        >
          🎁 FREE GIVEAWAY — ENTER NOW, NO PURCHASE NEEDED →
        </Link>
      </div>
    </div>
  );
}
