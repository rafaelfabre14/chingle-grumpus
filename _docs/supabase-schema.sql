-- ─── Tables ───────────────────────────────────────────────────────────────────

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

-- ─── Row Level Security ────────────────────────────────────────────────────────

alter table products enable row level security;
alter table live_drops enable row level security;
alter table giveaway_entries enable row level security;
alter table email_signups enable row level security;
alter table orders enable row level security;

-- anon read: products + live_drops
create policy "public read products" on products for select using (true);
create policy "public read live_drops" on live_drops for select using (true);

-- anon insert: giveaway_entries, email_signups
create policy "public insert giveaway_entries" on giveaway_entries for insert with check (true);
create policy "public insert email_signups" on email_signups for insert with check (true);

-- service role only: orders (inserted via webhook with service role key)
-- (no anon policy needed — service role bypasses RLS)

-- ─── Seed Data ────────────────────────────────────────────────────────────────

insert into products (name, slug, description, price, category, set_name, condition, grade, grade_company, image_url, stock, featured, is_live_drop) values
(
  'Charizard ex Full Art',
  'charizard-ex-full-art',
  'Full Art Charizard ex from Obsidian Flames. One of the most sought-after cards from the set — near-perfect condition straight from a fresh pull.',
  89.99, 'singles', 'Obsidian Flames', 'Near Mint', null, null,
  'https://images.pokemontcg.io/sv3/215_hires.png',
  3, true, false
),
(
  'Scarlet & Violet Booster Box',
  'scarlet-violet-booster-box',
  'Factory sealed Scarlet & Violet Base Set booster box. 36 packs, 10 cards each. Rip your own hits fresh from the box.',
  129.99, 'sealed', 'Scarlet & Violet Base', null, null, null,
  'https://images.pokemontcg.io/sv1/logo.png',
  5, true, false
),
(
  'Pikachu VMAX (PSA 10)',
  'pikachu-vmax-psa-10',
  'PSA Gem Mint 10 Pikachu VMAX from Vivid Voltage. Perfectly centered, flawless surfaces — the gold standard for Pikachu collectors.',
  210.00, 'graded', 'Vivid Voltage', null, '10', 'PSA',
  'https://images.pokemontcg.io/swsh4/44_hires.png',
  1, true, false
),
(
  'Mewtwo ex',
  'mewtwo-ex',
  'Mewtwo ex from the 151 set. A lightly played copy with minimal edge wear — perfect for play or display.',
  34.99, 'singles', '151', 'Lightly Played', null, null,
  'https://images.pokemontcg.io/sv3pt5/205_hires.png',
  4, false, false
),
(
  'Paldea Evolved Booster Bundle',
  'paldea-evolved-booster-bundle',
  'Sealed Paldea Evolved Booster Bundle. 5 booster packs in one bundle — great value entry point for the Paldea Evolved set.',
  44.99, 'sealed', 'Paldea Evolved', null, null, null,
  'https://images.pokemontcg.io/sv2/logo.png',
  8, false, false
),
(
  'Umbreon VMAX Alt Art',
  'umbreon-vmax-alt-art',
  'The crown jewel of Evolving Skies. Umbreon VMAX Alternative Art in Near Mint condition — one of the most iconic cards of the modern era.',
  299.99, 'singles', 'Evolving Skies', 'Near Mint', null, null,
  'https://images.pokemontcg.io/swsh7/215_hires.png',
  1, false, false
),
(
  'Blastoise (BGS 8.5)',
  'blastoise-bgs-85',
  'BGS 8.5 NM-MT+ Blastoise from Base Set 2. A vintage classic in a Beckett slab — solid investment-grade condition.',
  175.00, 'graded', 'Base Set 2', null, '8.5', 'BGS',
  'https://images.pokemontcg.io/base4/2_hires.png',
  1, false, false
),
(
  'Temporal Forces Booster Box',
  'temporal-forces-booster-box',
  'Factory sealed Temporal Forces booster box. 36 packs — chase the Tera Iron Leaves ex and Walking Wake ex hits.',
  109.99, 'sealed', 'Temporal Forces', null, null, null,
  'https://images.pokemontcg.io/sv5/logo.png',
  4, false, false
),
(
  'Gardevoir ex',
  'gardevoir-ex',
  'Gardevoir ex from Scarlet & Violet Base in Near Mint condition. A competitive staple and fan favorite — a must-have for any collection.',
  19.99, 'singles', 'Scarlet & Violet Base', 'Near Mint', null, null,
  'https://images.pokemontcg.io/sv1/86_hires.png',
  6, false, false
),
(
  'Lugia V Alt Art (PSA 9)',
  'lugia-v-alt-art-psa-9',
  'PSA Mint 9 Lugia V Alternative Art from Silver Tempest. Stunning artwork, incredible investment potential — a showpiece for any serious collection.',
  385.00, 'graded', 'Silver Tempest', null, '9', 'PSA',
  'https://images.pokemontcg.io/swsh12/186_hires.png',
  1, false, false
);

-- Live drop seed (next Friday 7PM CT = UTC-5, so 00:00 UTC Saturday)
insert into live_drops (is_active, next_drop_at, stream_url) values
(false, '2025-05-02 00:00:00+00', 'https://www.whatnot.com/user/chinglegrumpus');

-- stripe_connections (for Connect OAuth)
create table if not exists stripe_connections (
  id text primary key,
  account_id text not null,
  connected_at timestamptz default now()
);

-- No RLS needed — only accessed server-side via service role key
