'use client';

const messages = [
  '⚡ FREE SHIPPING ON ORDERS OVER $75',
  '🎁 ENTER THIS WEEK\'S GIVEAWAY — NO PURCHASE NEEDED',
  '🔴 LIVE EVERY FRIDAY ON WHATNOT',
  '✨ NEW SINGLES ADDED WEEKLY',
  '⚡ FREE SHIPPING ON ORDERS OVER $75',
  '🎁 ENTER THIS WEEK\'S GIVEAWAY — NO PURCHASE NEEDED',
  '🔴 LIVE EVERY FRIDAY ON WHATNOT',
  '✨ NEW SINGLES ADDED WEEKLY',
];

export default function AnnouncementTicker() {
  return (
    <div
      className="w-full overflow-hidden py-2"
      style={{ background: 'var(--color-dark)', borderBottom: '3px solid #000' }}
    >
      <div className="ticker-track">
        {messages.map((msg, i) => (
          <span
            key={i}
            className="inline-block px-10 text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#fff', fontFamily: 'var(--font-nunito), sans-serif' }}
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
