const { Client } = require('pg');

// Try multiple Supabase connection endpoints
const ssl = { rejectUnauthorized: false };

const configs = [
  {
    label: 'Pooler session (us-east-1)',
    connectionString: 'postgresql://postgres.xkkiylchzrrkoxorxevd:KD5hNm1IpF14eIK6@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
    ssl,
  },
  {
    label: 'Pooler transaction (us-east-1)',
    connectionString: 'postgresql://postgres.xkkiylchzrrkoxorxevd:KD5hNm1IpF14eIK6@aws-0-us-east-1.pooler.supabase.com:6543/postgres',
    ssl,
  },
  {
    label: 'Pooler session (us-west-1)',
    connectionString: 'postgresql://postgres.xkkiylchzrrkoxorxevd:KD5hNm1IpF14eIK6@aws-0-us-west-1.pooler.supabase.com:5432/postgres',
    ssl,
  },
  {
    label: 'Pooler session (eu-west-1)',
    connectionString: 'postgresql://postgres.xkkiylchzrrkoxorxevd:KD5hNm1IpF14eIK6@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
    ssl,
  },
];

async function tryConnect() {
  for (const config of configs) {
    const client = new Client({ connectionString: config.connectionString, ssl: config.ssl, connectionTimeoutMillis: 8000 });
    try {
      console.log(`Trying: ${config.label}...`);
      await client.connect();
      console.log(`✓ Connected via ${config.label}`);
      return client;
    } catch (e) {
      console.log(`  ✗ ${e.message.split('\n')[0]}`);
      try { await client.end(); } catch {}
    }
  }
  return null;
}

const DDL = `
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  category text not null check (category in ('sealed', 'singles', 'graded')),
  set_name text,
  condition text,
  grade text,
  grade_company text check (grade_company in ('PSA', 'BGS', 'CGC') or grade_company is null),
  image_url text,
  stock integer not null default 1,
  featured boolean not null default false,
  is_live_drop boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists live_drops (
  id uuid primary key default gen_random_uuid(),
  is_active boolean not null default false,
  next_drop_at timestamptz not null,
  stream_url text,
  created_at timestamptz default now()
);

create table if not exists giveaway_entries (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  marketing_opt_in boolean not null default false,
  week_of date not null,
  created_at timestamptz default now(),
  unique (email, week_of)
);

create table if not exists email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null check (source in ('homepage', 'live_drop', 'order_success', 'giveaway')),
  marketing_opt_in boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  customer_email text,
  items jsonb not null default '[]',
  total numeric(10,2),
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled')),
  created_at timestamptz default now()
);

alter table products enable row level security;
alter table live_drops enable row level security;
alter table giveaway_entries enable row level security;
alter table email_signups enable row level security;
alter table orders enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where tablename='products' and policyname='public read products') then
    create policy "public read products" on products for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='live_drops' and policyname='public read live_drops') then
    create policy "public read live_drops" on live_drops for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='giveaway_entries' and policyname='public insert giveaway_entries') then
    create policy "public insert giveaway_entries" on giveaway_entries for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='email_signups' and policyname='public insert email_signups') then
    create policy "public insert email_signups" on email_signups for insert with check (true);
  end if;
end $$;
`;

const PRODUCTS = [
  { name: 'Charizard ex Full Art', slug: 'charizard-ex-full-art', description: 'Full Art Charizard ex from Obsidian Flames. One of the most sought-after cards from the set — near-perfect condition.', price: 89.99, category: 'singles', set_name: 'Obsidian Flames', condition: 'Near Mint', grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/sv3/215_hires.png', stock: 3, featured: true, is_live_drop: false },
  { name: 'Scarlet & Violet Booster Box', slug: 'scarlet-violet-booster-box', description: 'Factory sealed Scarlet & Violet Base Set booster box. 36 packs, 10 cards each.', price: 129.99, category: 'sealed', set_name: 'Scarlet & Violet Base', condition: null, grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/sv1/logo.png', stock: 5, featured: true, is_live_drop: false },
  { name: 'Pikachu VMAX (PSA 10)', slug: 'pikachu-vmax-psa-10', description: 'PSA Gem Mint 10 Pikachu VMAX from Vivid Voltage. Perfectly centered, flawless surfaces.', price: 210.00, category: 'graded', set_name: 'Vivid Voltage', condition: null, grade: '10', grade_company: 'PSA', image_url: 'https://images.pokemontcg.io/swsh4/44_hires.png', stock: 1, featured: true, is_live_drop: false },
  { name: 'Mewtwo ex', slug: 'mewtwo-ex', description: 'Mewtwo ex from the 151 set. A lightly played copy with minimal edge wear.', price: 34.99, category: 'singles', set_name: '151', condition: 'Lightly Played', grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/sv3pt5/205_hires.png', stock: 4, featured: false, is_live_drop: false },
  { name: 'Paldea Evolved Booster Bundle', slug: 'paldea-evolved-booster-bundle', description: 'Sealed Paldea Evolved Booster Bundle. 5 booster packs — great value entry point.', price: 44.99, category: 'sealed', set_name: 'Paldea Evolved', condition: null, grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/sv2/logo.png', stock: 8, featured: false, is_live_drop: false },
  { name: 'Umbreon VMAX Alt Art', slug: 'umbreon-vmax-alt-art', description: 'The crown jewel of Evolving Skies. Umbreon VMAX Alternative Art in Near Mint condition.', price: 299.99, category: 'singles', set_name: 'Evolving Skies', condition: 'Near Mint', grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/swsh7/215_hires.png', stock: 1, featured: false, is_live_drop: false },
  { name: 'Blastoise (BGS 8.5)', slug: 'blastoise-bgs-85', description: 'BGS 8.5 NM-MT+ Blastoise from Base Set 2. A vintage classic in a Beckett slab.', price: 175.00, category: 'graded', set_name: 'Base Set 2', condition: null, grade: '8.5', grade_company: 'BGS', image_url: 'https://images.pokemontcg.io/base4/2_hires.png', stock: 1, featured: false, is_live_drop: false },
  { name: 'Temporal Forces Booster Box', slug: 'temporal-forces-booster-box', description: 'Factory sealed Temporal Forces booster box. 36 packs — chase the Tera Iron Leaves ex hits.', price: 109.99, category: 'sealed', set_name: 'Temporal Forces', condition: null, grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/sv5/logo.png', stock: 4, featured: false, is_live_drop: false },
  { name: 'Gardevoir ex', slug: 'gardevoir-ex', description: 'Gardevoir ex from Scarlet & Violet Base in Near Mint condition. A competitive staple and fan favorite.', price: 19.99, category: 'singles', set_name: 'Scarlet & Violet Base', condition: 'Near Mint', grade: null, grade_company: null, image_url: 'https://images.pokemontcg.io/sv1/86_hires.png', stock: 6, featured: false, is_live_drop: false },
  { name: 'Lugia V Alt Art (PSA 9)', slug: 'lugia-v-alt-art-psa-9', description: 'PSA Mint 9 Lugia V Alternative Art from Silver Tempest. A showpiece for any serious collection.', price: 385.00, category: 'graded', set_name: 'Silver Tempest', condition: null, grade: '9', grade_company: 'PSA', image_url: 'https://images.pokemontcg.io/swsh12/186_hires.png', stock: 1, featured: false, is_live_drop: false },
];

async function main() {
  const client = await tryConnect();
  if (!client) {
    console.error('\n❌ Could not connect to database. Please run the SQL manually in the Supabase dashboard SQL editor.');
    process.exit(1);
  }

  try {
    console.log('\nRunning DDL...');
    await client.query(DDL);
    console.log('✓ Tables and policies created');

    console.log('Seeding products...');
    for (const p of PRODUCTS) {
      await client.query(`
        insert into products (name,slug,description,price,category,set_name,condition,grade,grade_company,image_url,stock,featured,is_live_drop)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        on conflict (slug) do nothing
      `, [p.name, p.slug, p.description, p.price, p.category, p.set_name, p.condition, p.grade, p.grade_company, p.image_url, p.stock, p.featured, p.is_live_drop]);
    }
    console.log(`✓ ${PRODUCTS.length} products seeded`);

    console.log('Seeding live_drop...');
    await client.query(`
      insert into live_drops (is_active, next_drop_at, stream_url)
      values (false, '2025-05-09T00:00:00+00', 'https://www.whatnot.com/user/chinglegrumpus')
      on conflict do nothing
    `);
    console.log('✓ live_drop seeded');

    console.log('\n🎉 Database ready!');
  } finally {
    await client.end();
  }
}

main();
