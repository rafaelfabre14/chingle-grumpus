import GiveawayForm from '@/components/ui/GiveawayForm';
import StarburstBadge from '@/components/ui/StarburstBadge';

export default function GiveawayCallout() {
  return (
    <section
      className="relative overflow-hidden halftone"
      style={{ background: 'var(--color-yellow)', borderBottom: '4px solid #000' }}
    >
      <div className="absolute top-8 right-8 md:top-12 md:right-16">
        <StarburstBadge text="FREE!" color="red" className="!w-24 !h-24" />
      </div>

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2
          className="leading-none mb-4"
          style={{
            fontFamily: 'var(--font-bebas), serif',
            fontSize: 'clamp(3rem, 8vw, 5rem)',
            letterSpacing: '0.03em',
            color: 'var(--color-dark)',
            textShadow: '3px 3px 0 rgba(0,0,0,0.15)',
          }}
        >
          WIN FREE CARDS.<br />SERIOUSLY.
        </h2>
        <p
          className="text-base font-semibold mb-10 max-w-md mx-auto"
          style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)', opacity: 0.8 }}
        >
          Every week, Chingle gives away rare pulls to the crew. Enter your email — no purchase needed.
        </p>

        <div className="max-w-sm mx-auto">
          <GiveawayForm source="homepage" />
        </div>

        <p className="text-xs text-gray-700 mt-6 font-semibold">
          Winner announced every Friday during the live stream on Whatnot. One entry per email per week.
        </p>
      </div>
    </section>
  );
}
