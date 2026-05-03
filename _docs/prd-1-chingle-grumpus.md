# PRD 1 — Chingle Grumpus Demo Store
**Project:** Chingle Grumpus Ecommerce Demo  
**Owner:** Rafael / Matic AI  
**Stack:** Next.js · Supabase · Stripe  
**Purpose:** Prospect demo — visually impressive, functionally working storefront to present to the Chingle Grumpus prospect as a sample of the Matic AI Ecommerce service  
**Status:** Pre-build · v1.1

---

## 1. Objective

Build a working ecommerce storefront for Chingle Grumpus — a Pokemon card seller operating a physical store and live streaming on Whatnot. The demo must do two things equally well: look stunning enough to close the prospect emotionally in the first 10 seconds, and actually function end-to-end (browse → add to cart → checkout via Stripe).

This is not a production store. It is a high-fidelity demo that will be used in a sales meeting. All products are sample/placeholder data seeded in Supabase. No real transactions will be processed (Stripe test mode).

---

## 2. Brand Identity

### 2.1 Mascot
Chingle Grumpus's brand is built around a **golden retriever wearing black sunglasses**, illustrated in an anime/TCG art style against an electric blue lightning background with floating Pokeballs. This mascot is the heart of the brand and must appear prominently throughout the store — not just as a logo, but as a recurring character. Think of him the way sports teams use mascots: guiding the user, appearing in empty states, celebrating on the order success page, and anchoring the hero section.

The mascot should feel like he belongs in the Pokemon universe — energetic, fun, a little chaotic, completely lovable.

### 2.2 Brand Personality
- Bold and energetic — this is a collector's brand, not a sterile retail store
- Community-first — giveaways, live streams, newsletter, "the crew" language
- Knowledgeable but approachable — knows their cards, talks like a collector not a corporation
- Playful — the dog with sunglasses says everything. Don't take it too seriously.

### 2.3 Visual References
**Primary — Chingle Grumpus's Whatnot profile:**
- Electric blue lightning background
- Warm golden tones from the retriever illustration
- Gold/orange banner ribbon with bold white outlined text
- Floating Pokeball elements
- Anime TCG illustration quality

**Secondary — Thunder & Pulp (thunderandpulp.com):**
- Scrolling ticker announcement bar at top of page
- Yellow/black comic color blocking
- Bold editorial typography
- Comic panel grid layouts with thick black borders
- Starburst badge elements for promotions
- Clean, functional product layout within the comic aesthetic

---

## 3. Design System

### 3.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#E63946` | CTAs, sale badges, urgent elements |
| `--color-electric` | `#00BFFF` | Electric blue — hero bg, lightning accents, pulled from mascot logo |
| `--color-yellow` | `#F4C430` | Comic yellow — section fills, highlights, badges |
| `--color-dark` | `#1A1A2E` | Near-black — nav, footers, dark sections, outlines |
| `--color-gold` | `#E8A020` | Gold/orange from brand ribbon — secondary accents |
| `--color-light` | `#FFFDF4` | Off-white cream — card backgrounds, page base |
| `--color-outline` | `#000000` | Pure black — all borders and hard shadows |

### 3.2 Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Hero | Bebas Neue | 400 | Google Fonts — editorial, chunky, comic feel |
| Section Headings | Bebas Neue | 400 | Scaled down from display |
| Badges / Labels | Bangers | 400 | Google Fonts — all caps, slightly slanted, TCG energy |
| Body / UI | Nunito Sans | 400 / 600 | Readable, friendly |
| Price | Nunito Sans | 700 | Bold for emphasis |

### 3.3 Core UI Rules
- **Hard drop shadows:** `box-shadow: 4px 4px 0px #000000` on all cards, buttons, panels — no blur, pure comic style
- **Button press effect:** on hover/active, `transform: translate(2px, 2px)` + shadow reduces to `2px 2px 0px`
- **Borders:** `3px solid #000000` on all interactive elements and cards
- **Border radius:** `4px` max — keep edges sharp, not rounded
- **Halftone textures:** CSS-based dot pattern or SVG overlay on yellow and dark sections
- **Lightning bolt motif:** decorative dividers and icon elements pulled from the mascot's background
- **Section rhythm:** alternate `--color-light` / `--color-yellow` / `--color-dark` backgrounds, always separated by `4px solid #000` borders

### 3.4 Announcement Ticker (Global)
Pinned at the very top of every page, above the nav. Directly inspired by Thunder & Pulp.
- Dark background (`--color-dark`), small white text, continuous scroll
- Messages:
  - `⚡ FREE SHIPPING ON ORDERS OVER $75`
  - `🎁 ENTER THIS WEEK'S GIVEAWAY — NO PURCHASE NEEDED`
  - `🔴 LIVE EVERY FRIDAY ON WHATNOT`
  - `✨ NEW SINGLES ADDED WEEKLY`

---

## 4. Pages & Sitemap

```
/                   → Homepage
/shop               → Full product catalog
/shop/[slug]        → Individual product detail page
/cart               → Cart page
/live               → Live Drop page
/giveaway           → Giveaway entry page
/order-success      → Post-checkout confirmation
```

---

## 5. Page Specifications

### 5.1 Homepage (`/`)

**Hero Section**
- Full-width, min 85vh
- Background: `--color-electric` with animated lightning bolt SVG overlays
- Left: large headline in Bebas Neue — `"CATCH 'EM. COLLECT 'EM. OWN 'EM."` — white text with black stroke
- Subheadline (Nunito Sans): `"Pokemon singles, sealed product & graded slabs — straight from Chingle Grumpus"`
- CTAs: `SHOP NOW` (yellow, hard shadow) → `/shop` and `WATCH LIVE` (dark) → `/live`
- Right: Chingle Grumpus mascot illustration — large, slightly overlapping into next section
- Floating low-opacity Pokeball SVGs in background
- Speech bubble bottom-right: `"NEW DROPS EVERY FRIDAY!"` in Bangers

**Live Drop / Giveaway Dual Banner Strip**
- `--color-yellow` background, thick black top and bottom borders
- Split two columns by vertical black divider:
  - Left: `"🔴 LIVE NOW — SHOP THE DROP →"` or `"⚡ NEXT DROP: [DD:HH:MM:SS]"` (polls Supabase)
  - Right: `"🎁 FREE GIVEAWAY — ENTER NOW, NO PURCHASE NEEDED →"` → `/giveaway`

**Chingle's Picks (Featured Products)**
- Heading: `"CHINGLE'S PICKS"` with small mascot icon
- Sub: `"Hand-picked by the Grumpus himself"`
- 3-column product card grid (one sealed, one single, one graded)
- `VIEW ALL CARDS →` → `/shop`

**Shop By Category**
- 3 comic-panel columns, thick black borders, halftone backgrounds
- Panel 1: `SEALED PRODUCT` — electric blue accent
- Panel 2: `SINGLES` — yellow accent
- Panel 3: `GRADED SLABS` — gold accent
- Each: Bangers label + short descriptor + starburst CTA button

**Why Chingle Grumpus**
- `--color-dark` background, white text
- 3-column icon + text:
  - `"⚡ LIVE EVERY FRIDAY"` — streams on Whatnot
  - `"📦 SHIPS IN 1–2 DAYS"` — fast fulfillment
  - `"🏆 COLLECTOR TRUSTED"` — PSA/BGS authenticated
- Lightning bolt decorative dividers between columns

**Giveaway Callout Section**
- `--color-yellow` background, halftone texture
- Large starburst behind text
- Headline: `"WIN FREE CARDS. SERIOUSLY."` (Bebas Neue, large)
- Sub: `"Every week, Chingle gives away rare pulls to the crew. Enter your email — no purchase needed."`
- Email input + `ENTER THE GIVEAWAY` button → writes to `giveaway_entries` or redirects to `/giveaway`
- Fine print: `"Winner announced every Friday during the live stream on Whatnot. One entry per email per week."`
- Note: Every giveaway entry is simultaneously an email list capture

**Newsletter / Community Strip**
- `--color-dark` background
- Heading: `"JOIN THE CREW"`
- Sub: `"Get early access to rare pulls, drop alerts, and exclusive giveaways."`
- Email input + `JOIN NOW` → writes to `email_signups` with `source: 'homepage'`
- Fine print: `"We don't spam. Just drops, deals, and giveaways."`

**Footer**
- Dark background, white text
- Left: mascot icon + "CHINGLE GRUMPUS" in Bebas Neue
- Center: Shop · Live Drops · Giveaway · About
- Right: Whatnot · Instagram · TikTok icons (placeholder links)
- Bottom: `© 2025 Chingle Grumpus. All rights reserved. · Powered by Matic AI`

---

### 5.2 Shop Page (`/shop`)

**Layout:** 220px sidebar + 3-column product grid

**Sidebar filters:**
- Category: All / Sealed / Singles / Graded (radio)
- Set Name: multi-select checkboxes (seeded set names)
- Sort: Newest / Price Low–High / Price High–Low
- Mobile: collapse into bottom drawer via `FILTER & SORT` button

**Product Grid:**
- 3 col desktop / 2 col tablet / 1 col mobile
- ProductCard per item (see Component Library)
- Sold out: `SOLD OUT` badge overlay, disabled button
- Filters update URL params and Supabase query

**Page header:**
- Bebas Neue: `"THE CARD SHOP"`
- Sub: `"Singles · Sealed · Graded — New inventory added weekly"`
- Small mascot illustration top-right

---

### 5.3 Product Detail Page (`/shop/[slug]`)

**Left column:** Large product image, comic border + hard shadow. Graded cards: card image with PSA/BGS grade badge overlaid.

**Right column:**
- Category badge (Bangers, colored by category)
- Product name (Bebas Neue)
- Set name label
- Grade badge for graded products — styled like real PSA label, grade number prominent
- Price (Nunito Sans 700, large)
- Condition label
- Quantity stepper (+/-)
- `ADD TO CART` — full width, primary red, hard shadow
- Attributes table: Set · Year · Language · Condition · Grade · Grading Company

**Below fold:** `"YOU MIGHT ALSO LIKE"` — 3 related product cards (same category)

---

### 5.4 Cart Page (`/cart`)

- Line items: image · name · quantity stepper · line total · remove (×)
- Order summary sidebar: subtotal · shipping ($4.99, free over $75) · total
- `PROCEED TO CHECKOUT` → Stripe hosted checkout
- `CONTINUE SHOPPING` → `/shop`
- Empty state: mascot with speech bubble — `"YOUR CART IS EMPTY, TRAINER. GO CATCH SOME CARDS."` + `SHOP NOW` button

---

### 5.5 Live Drop Page (`/live`)

**Inactive state:**
- Hero: electric blue background + lightning + mascot
- Headline: `"THE NEXT DROP IS COMING."`
- Countdown timer (Bebas Neue): `DD : HH : MM : SS` → hardcoded next Friday 7PM CT
- Description of what a live drop is
- Email capture: `"GET NOTIFIED WHEN WE GO LIVE"` → `email_signups` with `source: 'live_drop'`
- `"FROM LAST DROP"` — 3 seeded product cards

**Active state (when `live_drops.is_active = true`):**
- Pulsing red `"🔴 LIVE NOW — CHINGLE IS STREAMING"` banner
- `"WATCH ON WHATNOT →"` button (opens `live_drops.stream_url`)
- Live product grid: only products with `is_live_drop = true`, each with `"JUST DROPPED ⚡"` badge
- Auto-refreshes every 30 seconds via Supabase polling

---

### 5.6 Giveaway Page (`/giveaway`)

Extends Chingle's existing Whatnot giveaway culture to the web. Primary email list builder for marketing.

**Hero:**
- `--color-yellow` background + starburst graphic
- Headline: `"WIN FREE POKEMON CARDS."` (Bebas Neue, massive)
- Sub: `"Enter below — no purchase necessary. Winner announced every Friday on Whatnot."`
- Mascot holding a Pokeball

**Entry Form:**
- Fields: First Name · Email Address
- Checkbox: `"Yes, also send me drop alerts and exclusive deals"` (opt-in, unchecked by default)
- `ENTER THE GIVEAWAY` submit → writes to `giveaway_entries`; if `marketing_opt_in = true`, also writes to `email_signups`

**Confirmation state:**
- Mascot celebrating
- `"YOU'RE IN! 🎉 Winner announced Friday on Whatnot — make sure you're watching!"`
- `"While you wait, check out the shop →"` CTA

**Prize Display (below form):**
- Current week's prize card with ProductCard component
- Past winners: 3 seeded entries — `"@username won [card] on [date]"` (social proof)

**Rules:**
- One entry per email per week
- Winner selected randomly every Friday, announced on Whatnot stream
- No purchase necessary

---

### 5.7 Order Success Page (`/order-success`)

- Mascot celebrating (large, centered)
- Headline: `"ORDER CONFIRMED! YOU'RE A TRUE COLLECTOR. 🎉"`
- Order summary (from Stripe session)
- `KEEP SHOPPING` → `/shop`
- If not already signed up: inline email capture — `"GET DROP ALERTS"` → `email_signups` with `source: 'order_success'`

---

## 6. Data Model (Supabase)

### `products`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK |
| `name` | text | |
| `slug` | text | Unique |
| `description` | text | |
| `price` | numeric | USD |
| `category` | text | `sealed` \| `singles` \| `graded` |
| `set_name` | text | |
| `condition` | text | "Near Mint", "Lightly Played", etc. |
| `grade` | text | Nullable — graded only |
| `grade_company` | text | "PSA", "BGS", "CGC" — nullable |
| `image_url` | text | |
| `stock` | integer | 0 = sold out |
| `featured` | boolean | Chingle's Picks section |
| `is_live_drop` | boolean | Current live drop product |
| `created_at` | timestamp | |

### `live_drops`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `is_active` | boolean | Flip to activate live drop mode sitewide |
| `next_drop_at` | timestamp | Drives countdown |
| `stream_url` | text | Whatnot URL |
| `created_at` | timestamp | |

### `giveaway_entries`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `first_name` | text | |
| `email` | text | |
| `marketing_opt_in` | boolean | |
| `week_of` | date | ISO week start — enforces one entry per week per email |
| `created_at` | timestamp | |

### `email_signups`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `email` | text | |
| `source` | text | `'homepage'` \| `'live_drop'` \| `'order_success'` \| `'giveaway'` |
| `marketing_opt_in` | boolean | |
| `created_at` | timestamp | |

### `orders`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `stripe_session_id` | text | |
| `customer_email` | text | |
| `items` | jsonb | `[{product_id, quantity, price}]` |
| `total` | numeric | |
| `status` | text | `pending` \| `paid` \| `fulfilled` |
| `created_at` | timestamp | |

---

## 7. Component Library

### `<AnnouncementTicker />`
Global, pinned above nav. Scrolling marquee, dark bg, white text.

### `<Navbar />`
Sticky top (below ticker). Left: mascot icon + "CHINGLE GRUMPUS" Bebas Neue. Center: Shop · Live Drops · Giveaway. Right: cart count badge + `WATCH LIVE` yellow button. Mobile: hamburger → full-screen drawer.

### `<ProductCard />`
Props: `product`, `badge?`, `badgeText?`
Comic border + hard drop shadow. Category badge (red=sealed, blue=singles, gold=graded). Grade badge overlay for graded. Name, set, price, `ADD TO CART` button.

### `<SpeechBubble />`
Props: `text`, `direction?`
CSS or SVG comic speech bubble. Mascot dialogue, promotional callouts.

### `<CountdownTimer />`
Props: `targetDate`
`DD : HH : MM : SS` in Bebas Neue. Updates every second. Used on `/live` and homepage banner.

### `<LiveBanner />`
Polls `live_drops` every 60s. Renders countdown or `LIVE NOW` state.

### `<StarburstBadge />`
Props: `text`, `color?`
CSS clip-path starburst. Used for FREE, SALE, HOT, JUST DROPPED labels.

### `<GiveawayForm />`
First name + email + opt-in checkbox. Writes to `giveaway_entries`. Conditionally also writes to `email_signups` if `marketing_opt_in = true`. Shows confirmation state on success.

---

## 8. Checkout (Stripe)

- Stripe hosted Checkout — simplest, looks professional for demo
- `/api/checkout` Next.js API route creates Checkout Session from cart context
- `success_url`: `/order-success?session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `/cart`
- On success page: fetch session, write to `orders` table
- **Stripe test mode** throughout
- Shipping: flat $4.99, free over $75

---

## 9. Seed Data

### Products (10 items)

| Name | Category | Price | Set | Condition / Grade | Featured |
|---|---|---|---|---|---|
| Charizard ex Full Art | singles | $89.99 | Obsidian Flames | Near Mint | ✅ |
| Scarlet & Violet Booster Box | sealed | $129.99 | Scarlet & Violet Base | — | ✅ |
| Pikachu VMAX (PSA 10) | graded | $210.00 | Vivid Voltage | PSA 10 | ✅ |
| Mewtwo ex | singles | $34.99 | 151 | Lightly Played | — |
| Paldea Evolved Booster Bundle | sealed | $44.99 | Paldea Evolved | — | — |
| Umbreon VMAX Alt Art | singles | $299.99 | Evolving Skies | Near Mint | — |
| Blastoise (BGS 8.5) | graded | $175.00 | Base Set 2 | BGS 8.5 | — |
| Temporal Forces Booster Box | sealed | $109.99 | Temporal Forces | — | — |
| Gardevoir ex | singles | $19.99 | Scarlet & Violet Base | Near Mint | — |
| Lugia V Alt Art (PSA 9) | graded | $385.00 | Silver Tempest | PSA 9 | — |

### Live drop seed
- `is_active: false`
- `next_drop_at`: next Friday at 7:00 PM CT

### Giveaway seed
- Current prize: Charizard ex Full Art (Near Mint) — $89.99 value
- 3 past winners with fake usernames and dates for social proof

---

## 10. Technical Specs

- **Framework:** Next.js 14+ App Router
- **Database:** Supabase (Postgres) — `@supabase/ssr`
- **Payments:** Stripe test mode, hosted Checkout
- **Fonts:** `next/font/google` — Bebas Neue, Bangers, Nunito Sans
- **Images:** `next/image` — Unsplash or placeholder.com URLs for demo products
- **Cart:** React Context + `localStorage`
- **Animations:** Framer Motion for ticker scroll, countdown, live mode transitions (recommended for demo polish)

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

**Deployment:** Vercel. No auth required — guest checkout only.

---

## 11. Out of Scope (Demo)

Mentioned verbally in the sales meeting as what the retainer unlocks:

- Customer accounts / login
- Real email delivery (Klaviyo, Resend, etc.)
- Merchant admin / CMS dashboard
- Inventory management UI
- Real Whatnot API integration
- Automated giveaway winner selection
- Reviews and ratings
- Discount codes
- Analytics dashboard
- Mobile app

---

## 12. Demo Success Criteria

- [ ] Announcement ticker scrolls on every page with correct messages
- [ ] Hero features mascot + electric blue lightning matching Chingle Grumpus brand
- [ ] Dual banner strip (Live Drop + Giveaway) visible and links correctly on homepage
- [ ] Shop page shows all 10 seeded products with working category and sort filters
- [ ] Product detail page renders grade badge correctly for graded products
- [ ] Add to cart works and persists on page refresh
- [ ] Stripe test checkout completes end-to-end and lands on order success page
- [ ] Live Drop page shows countdown timer to next Friday 7PM CT
- [ ] Giveaway page entry form writes successfully to Supabase
- [ ] Marketing opt-in on giveaway form also writes to `email_signups`
- [ ] All email captures across site write to `email_signups` with correct `source` tag
- [ ] Comic book aesthetic consistent across all pages
- [ ] Fully responsive on mobile
- [ ] Deployed to live Vercel URL that can be demoed on any device
