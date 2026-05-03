// Run with: node _docs/seed.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://xkkiylchzrrkoxorxevd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2l5bGNoenJya294b3J4ZXZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzc2NDk5OSwiZXhwIjoyMDkzMzQwOTk5fQ.M1o-QMt_Y4Namrm0Zse1KVrBoXUQk7EnsycznpUb6Nk'
);

const products = [
  {
    name: 'Charizard ex Full Art',
    slug: 'charizard-ex-full-art',
    description: 'Full Art Charizard ex from Obsidian Flames. One of the most sought-after cards from the set — near-perfect condition straight from a fresh pull.',
    price: 89.99, category: 'singles', set_name: 'Obsidian Flames', condition: 'Near Mint',
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/sv3/215_hires.png',
    stock: 3, featured: true, is_live_drop: false,
  },
  {
    name: 'Scarlet & Violet Booster Box',
    slug: 'scarlet-violet-booster-box',
    description: 'Factory sealed Scarlet & Violet Base Set booster box. 36 packs, 10 cards each. Rip your own hits fresh from the box.',
    price: 129.99, category: 'sealed', set_name: 'Scarlet & Violet Base', condition: null,
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/sv1/logo.png',
    stock: 5, featured: true, is_live_drop: false,
  },
  {
    name: 'Pikachu VMAX (PSA 10)',
    slug: 'pikachu-vmax-psa-10',
    description: 'PSA Gem Mint 10 Pikachu VMAX from Vivid Voltage. Perfectly centered, flawless surfaces — the gold standard for Pikachu collectors.',
    price: 210.00, category: 'graded', set_name: 'Vivid Voltage', condition: null,
    grade: '10', grade_company: 'PSA',
    image_url: 'https://images.pokemontcg.io/swsh4/44_hires.png',
    stock: 1, featured: true, is_live_drop: false,
  },
  {
    name: 'Mewtwo ex',
    slug: 'mewtwo-ex',
    description: 'Mewtwo ex from the 151 set. A lightly played copy with minimal edge wear — perfect for play or display.',
    price: 34.99, category: 'singles', set_name: '151', condition: 'Lightly Played',
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/sv3pt5/205_hires.png',
    stock: 4, featured: false, is_live_drop: false,
  },
  {
    name: 'Paldea Evolved Booster Bundle',
    slug: 'paldea-evolved-booster-bundle',
    description: 'Sealed Paldea Evolved Booster Bundle. 5 booster packs — great value entry point for the Paldea Evolved set.',
    price: 44.99, category: 'sealed', set_name: 'Paldea Evolved', condition: null,
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/sv2/logo.png',
    stock: 8, featured: false, is_live_drop: false,
  },
  {
    name: 'Umbreon VMAX Alt Art',
    slug: 'umbreon-vmax-alt-art',
    description: 'The crown jewel of Evolving Skies. Umbreon VMAX Alternative Art in Near Mint condition — one of the most iconic cards of the modern era.',
    price: 299.99, category: 'singles', set_name: 'Evolving Skies', condition: 'Near Mint',
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/swsh7/215_hires.png',
    stock: 1, featured: false, is_live_drop: false,
  },
  {
    name: 'Blastoise (BGS 8.5)',
    slug: 'blastoise-bgs-85',
    description: 'BGS 8.5 NM-MT+ Blastoise from Base Set 2. A vintage classic in a Beckett slab — solid investment-grade condition.',
    price: 175.00, category: 'graded', set_name: 'Base Set 2', condition: null,
    grade: '8.5', grade_company: 'BGS',
    image_url: 'https://images.pokemontcg.io/base4/2_hires.png',
    stock: 1, featured: false, is_live_drop: false,
  },
  {
    name: 'Temporal Forces Booster Box',
    slug: 'temporal-forces-booster-box',
    description: 'Factory sealed Temporal Forces booster box. 36 packs — chase the Tera Iron Leaves ex and Walking Wake ex hits.',
    price: 109.99, category: 'sealed', set_name: 'Temporal Forces', condition: null,
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/sv5/logo.png',
    stock: 4, featured: false, is_live_drop: false,
  },
  {
    name: 'Gardevoir ex',
    slug: 'gardevoir-ex',
    description: 'Gardevoir ex from Scarlet & Violet Base in Near Mint condition. A competitive staple and fan favorite.',
    price: 19.99, category: 'singles', set_name: 'Scarlet & Violet Base', condition: 'Near Mint',
    grade: null, grade_company: null,
    image_url: 'https://images.pokemontcg.io/sv1/86_hires.png',
    stock: 6, featured: false, is_live_drop: false,
  },
  {
    name: 'Lugia V Alt Art (PSA 9)',
    slug: 'lugia-v-alt-art-psa-9',
    description: 'PSA Mint 9 Lugia V Alternative Art from Silver Tempest. Stunning artwork, incredible investment potential — a showpiece for any serious collection.',
    price: 385.00, category: 'graded', set_name: 'Silver Tempest', condition: null,
    grade: '9', grade_company: 'PSA',
    image_url: 'https://images.pokemontcg.io/swsh12/186_hires.png',
    stock: 1, featured: false, is_live_drop: false,
  },
];

async function seed() {
  console.log('Seeding products...');
  const { error: prodError } = await supabase.from('products').upsert(products, { onConflict: 'slug' });
  if (prodError) { console.error('Products error:', prodError.message); process.exit(1); }
  console.log(`✓ ${products.length} products seeded`);

  console.log('Seeding live_drop...');
  const { error: liveError } = await supabase.from('live_drops').upsert({
    is_active: false,
    next_drop_at: '2025-05-02T00:00:00+00:00',
    stream_url: 'https://www.whatnot.com/user/chinglegrumpus',
  });
  if (liveError) { console.error('Live drop error:', liveError.message); process.exit(1); }
  console.log('✓ live_drop seeded');

  console.log('\nAll done! 🎉');
}

seed();
