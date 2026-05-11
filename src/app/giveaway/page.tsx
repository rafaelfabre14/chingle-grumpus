import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import Image from 'next/image';
import GiveawayForm from '@/components/ui/GiveawayForm';
import ProductCard from '@/components/ui/ProductCard';
import StarburstBadge from '@/components/ui/StarburstBadge';

const pastWinners = [
  { username: '@pokefan_sarah', card: 'Charizard VMAX Alt Art', date: 'April 25, 2025' },
  { username: '@the_real_jrod', card: 'Umbreon VMAX Full Art', date: 'April 18, 2025' },
  { username: '@collector_mike99', card: 'Pikachu VMAX Secret Rare', date: 'April 11, 2025' },
];

export default async function GiveawayPage() {
  const supabase = await createClient();

  // Current prize: first featured product
  const { data: prize } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(1)
    .single();

  return (
    <div style={{ background: 'var(--color-light)', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        className="relative overflow-hidden halftone py-20 px-6 text-center"
        style={{ background: 'var(--color-yellow)', borderBottom: '4px solid #000' }}
      >
        <div className="absolute top-8 left-8">
          <StarburstBadge text="FREE!" color="red" />
        </div>
        <div className="absolute top-8 right-8">
          <StarburstBadge text="WEEKLY" color="electric" />
        </div>

        <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
          <div
            className="w-28 h-28 rounded-full overflow-hidden"
            style={{ border: '4px solid #000', boxShadow: '5px 5px 0 #000' }}
          >
            <Image src="/mascot.jpeg" alt="Chingle Grumpus" width={112} height={112} className="object-cover w-full h-full" />
          </div>

          <h1
            className="leading-none"
            style={{
              fontFamily: 'var(--font-bebas), serif',
              fontSize: 'clamp(3.5rem, 10vw, 6.5rem)',
              letterSpacing: '0.03em',
              color: 'var(--color-dark)',
              textShadow: '4px 4px 0 rgba(0,0,0,0.15)',
            }}
          >
            WIN FREE<br />POKEMON CARDS.
          </h1>
          <p
            className="text-base font-semibold max-w-md"
            style={{ fontFamily: 'var(--font-nunito), sans-serif', color: 'var(--color-dark)', opacity: 0.8 }}
          >
            Enter below — no purchase necessary. Winner announced every Sunday on Whatnot.
          </p>
        </div>
      </section>

      {/* Entry form */}
      <section className="py-16 px-6" style={{ background: 'var(--color-light)', borderBottom: '4px solid #000' }}>
        <div className="max-w-md mx-auto">
          <h2
            className="text-center mb-6"
            style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em', color: 'var(--color-dark)' }}
          >
            ENTER THIS WEEK
          </h2>
          <GiveawayForm source="giveaway" />
          <p className="text-xs text-gray-500 text-center mt-4 font-semibold">
            One entry per email per week. Winner selected randomly every Sunday.
          </p>
        </div>
      </section>

      {/* Current prize */}
      {prize && (
        <section className="py-16 px-6" style={{ background: 'var(--color-electric)', borderBottom: '4px solid #000' }}>
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-center mb-2 text-white"
              style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}
            >
              THIS WEEK&apos;S PRIZE
            </h2>
            <p className="text-center text-white/70 text-sm font-semibold mb-8 uppercase tracking-widest">
              One lucky winner takes this home — free.
            </p>
            <div className="max-w-xs mx-auto">
              <ProductCard product={prize as Product} badge="THIS WEEK'S PRIZE" />
            </div>
          </div>
        </section>
      )}

      {/* Past winners */}
      <section className="py-16 px-6" style={{ background: 'var(--color-dark)', borderBottom: '4px solid #000' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-center mb-10 text-white"
            style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}
          >
            PAST WINNERS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pastWinners.map((w) => (
              <div
                key={w.username}
                className="p-5 text-center"
                style={{ border: '3px solid rgba(255,255,255,0.2)', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}
              >
                <p
                  className="text-white text-lg mb-1"
                  style={{ fontFamily: 'var(--font-bebas), serif', letterSpacing: '0.05em' }}
                >
                  {w.username}
                </p>
                <p className="text-xs text-gray-400 font-semibold mb-1">won</p>
                <p
                  className="text-yellow-300 font-bold text-sm"
                  style={{ fontFamily: 'var(--font-nunito), sans-serif' }}
                >
                  {w.card}
                </p>
                <p className="text-xs text-gray-500 mt-1">{w.date}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-10 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h3
            className="mb-3"
            style={{ fontFamily: 'var(--font-bebas), serif', fontSize: '1.5rem', letterSpacing: '0.05em', color: 'var(--color-dark)' }}
          >
            GIVEAWAY RULES
          </h3>
          <ul className="text-sm text-gray-500 font-semibold space-y-1">
            <li>One entry per email address per week.</li>
            <li>Winner selected randomly every Sunday evening.</li>
            <li>Announced live on Whatnot — tune in to claim your prize.</li>
            <li>No purchase necessary. Open to US residents.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
