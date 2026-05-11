const reasons = [
  { icon: '⚡', title: 'LIVE EVERY SUNDAY', desc: 'Tune in on Whatnot for live rips, deals, and exclusive drops you won\'t find anywhere else.' },
  { icon: '📦', title: 'SHIPS IN 1–2 DAYS', desc: 'Fast fulfillment from a real collector who knows how precious your cards are.' },
  { icon: '🏆', title: 'COLLECTOR TRUSTED', desc: 'PSA, BGS, and CGC authenticated graded slabs. Real grades, real cards, zero BS.' },
];

export default function WhyChingle() {
  return (
    <section style={{ background: 'var(--color-dark)', borderBottom: '4px solid #000' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-center text-white mb-12"
          style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '3rem', letterSpacing: '0.05em' }}
        >
          WHY CHINGLE GRUMPUS?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {reasons.map((r, i) => (
            <div
              key={r.title}
              className="flex flex-col items-center text-center px-8 py-8"
              style={{
                borderRight: i < reasons.length - 1 ? '2px solid rgba(255,255,255,0.15)' : undefined,
              }}
            >
              {/* Lightning bolt divider top */}
              <div className="text-4xl mb-4">{r.icon}</div>
              <h3
                className="text-white mb-3"
                style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.8rem', letterSpacing: '0.05em' }}
              >
                {r.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'rgba(255,255,255,0.65)' }}
              >
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
