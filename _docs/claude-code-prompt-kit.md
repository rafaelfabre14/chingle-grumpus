# Claude Code Prompt Kit — Chingle Grumpus Demo Store
**Project:** Chingle Grumpus Ecommerce Demo  
**Stack:** Next.js 14 · Supabase · Stripe  
**Purpose:** Reference prompts for building the demo store via Claude Code

---

## The Right Way to Start

Give Claude Code the full PRD 1 document and let it plan before it builds. This is better than feeding it section by section because it can see dependencies, catch conflicts, and make smarter decisions about build order.

### Prompt A — Full PRD Plan (use this first)

```
Here is the full PRD for the Chingle Grumpus ecommerce demo store.
Before writing any code, read the entire document carefully and produce 
a detailed build plan that includes:

1. Recommended folder and file structure for the Next.js App Router project
2. Full list of components to build and their props
3. Supabase schema DDL for all tables
4. Order in which you'll build pages and why
5. Any npm packages to install beyond the base Next.js setup
6. Any decisions or ambiguities you need me to resolve before starting

Do not write any code yet. Just the plan.

[PASTE FULL PRD 1 HERE]
```

Review the plan. Correct anything that looks off. Then:

### Prompt B — Kick off the build

```
Plan looks good. Go ahead and build the full project following that plan. 
Check in with me if you hit any decision points or blockers. 
Start with the scaffold and design system before any pages.
```

---

## Recovery Prompts (use if something goes wrong)

These are scoped prompts for specific sections. Use them if Claude Code loses context mid-build, goes off the rails on a specific page, or if you need to rebuild a section from scratch.

---

### Recovery 1 — Project Scaffold + Design System

```
I'm building a Next.js 14 App Router ecommerce store called Chingle Grumpus 
— a Pokemon card shop with a comic book aesthetic.

Please scaffold the project with:

1. Install: @supabase/ssr, stripe, framer-motion, next/font
2. Global CSS variables:
   --color-primary: #E63946
   --color-electric: #00BFFF
   --color-yellow: #F4C430
   --color-dark: #1A1A2E
   --color-gold: #E8A020
   --color-light: #FFFDF4
   --color-outline: #000000
3. Google Fonts via next/font: Bebas Neue, Bangers, Nunito Sans
4. globals.css with CSS variables, font assignments, and base rule:
   all cards/buttons get border: 3px solid #000, box-shadow: 4px 4px 0px #000
5. Unstyled component shells for:
   - AnnouncementTicker
   - Navbar
   - ProductCard
   - CountdownTimer
   - StarburstBadge
   - SpeechBubble
   - GiveawayForm
   - LiveBanner
6. Supabase client setup using @supabase/ssr
7. .env.local.example with all required environment variables:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   STRIPE_SECRET_KEY
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   STRIPE_WEBHOOK_SECRET
```

---

### Recovery 2 — Supabase Schema + Seed Data

```
Set up the Supabase database schema and seed data for the Chingle Grumpus store.

Create SQL migrations for these tables:

-- products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  category TEXT CHECK (category IN ('sealed', 'singles', 'graded')),
  set_name TEXT,
  condition TEXT,
  grade TEXT,
  grade_company TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 1,
  featured BOOLEAN DEFAULT false,
  is_live_drop BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- live_drops
CREATE TABLE live_drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_active BOOLEAN DEFAULT false,
  next_drop_at TIMESTAMP,
  stream_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- giveaway_entries
CREATE TABLE giveaway_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  marketing_opt_in BOOLEAN DEFAULT false,
  week_of DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- email_signups
CREATE TABLE email_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT,
  marketing_opt_in BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT,
  customer_email TEXT,
  items JSONB,
  total NUMERIC(10,2),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

Then create a seed file at /supabase/seed.sql with these 10 products:

| Name | Slug | Category | Price | Set | Condition | Grade | Grade Co | Featured |
|---|---|---|---|---|---|---|---|---|
| Charizard ex Full Art | charizard-ex-full-art | singles | 89.99 | Obsidian Flames | Near Mint | null | null | true |
| Scarlet & Violet Booster Box | sv-booster-box | sealed | 129.99 | Scarlet & Violet Base | null | null | null | true |
| Pikachu VMAX PSA 10 | pikachu-vmax-psa-10 | graded | 210.00 | Vivid Voltage | null | PSA 10 | PSA | true |
| Mewtwo ex | mewtwo-ex | singles | 34.99 | 151 | Lightly Played | null | null | false |
| Paldea Evolved Booster Bundle | paldea-evolved-bundle | sealed | 44.99 | Paldea Evolved | null | null | null | false |
| Umbreon VMAX Alt Art | umbreon-vmax-alt-art | singles | 299.99 | Evolving Skies | Near Mint | null | null | false |
| Blastoise BGS 8.5 | blastoise-bgs-85 | graded | 175.00 | Base Set 2 | null | 8.5 | BGS | false |
| Temporal Forces Booster Box | temporal-forces-box | sealed | 109.99 | Temporal Forces | null | null | null | false |
| Gardevoir ex | gardevoir-ex | singles | 19.99 | Scarlet & Violet Base | Near Mint | null | null | false |
| Lugia V Alt Art PSA 9 | lugia-v-alt-art-psa-9 | graded | 385.00 | Silver Tempest | null | PSA 9 | PSA | false |

Also seed one live_drop record: is_active = false, next_drop_at = next Friday at 7PM CT.

Finally create typed helper functions at /lib/supabase/queries.ts:
- getProducts(filters?: { category?: string, featured?: boolean, sort?: string })
- getProductBySlug(slug: string)
- getLiveDropStatus()
- createOrder(orderData: OrderData)
- addEmailSignup(email: string, source: string, marketing_opt_in?: boolean)
- addGiveawayEntry(firstName: string, email: string, marketing_opt_in: boolean)
```

---

### Recovery 3 — Homepage

```
Build the homepage at app/page.tsx for the Chingle Grumpus store.

Design rules to follow throughout:
- All section headings: Bebas Neue font
- Body text: Nunito Sans
- Badges/labels: Bangers font
- Cards: border: 3px solid #000, box-shadow: 4px 4px 0px #000
- Buttons: on hover, transform: translate(2px, 2px), shadow: 2px 2px 0px #000
- Sections alternate between --color-light, --color-yellow, --color-dark backgrounds
- Each section separated by 4px solid #000 border

Sections to build in order:

1. HERO
   - Full width, min-height 85vh
   - Background: --color-electric (#00BFFF) with animated SVG lightning overlays (framer-motion)
   - Left: Bebas Neue headline "CATCH 'EM. COLLECT 'EM. OWN 'EM." white with black text-stroke
   - Subheadline Nunito Sans: "Pokemon singles, sealed product & graded slabs — straight from Chingle Grumpus"
   - CTAs: "SHOP NOW" (yellow, hard shadow) → /shop | "WATCH LIVE" (dark) → /live
   - Right: large placeholder for mascot image (golden retriever with sunglasses)
   - Floating low-opacity Pokeball SVG elements
   - Speech bubble bottom right: "NEW DROPS EVERY FRIDAY!" in Bangers

2. DUAL BANNER STRIP
   - --color-yellow background, 4px black borders top and bottom
   - Two columns split by vertical black line
   - Left: Live drop status — polls getLiveDropStatus(), shows countdown or LIVE NOW
   - Right: "🎁 FREE GIVEAWAY — ENTER NOW, NO PURCHASE NEEDED →" → /giveaway

3. CHINGLE'S PICKS
   - Heading: "CHINGLE'S PICKS" with mascot icon
   - Sub: "Hand-picked by the Grumpus himself"
   - Fetches getProducts({ featured: true })
   - 3-column ProductCard grid
   - "VIEW ALL CARDS →" link to /shop

4. SHOP BY CATEGORY
   - 3 comic-panel columns, thick black borders, halftone dot CSS backgrounds
   - Panel 1: SEALED PRODUCT → /shop?category=sealed (electric blue accent)
   - Panel 2: SINGLES → /shop?category=singles (yellow accent)  
   - Panel 3: GRADED SLABS → /shop?category=graded (gold accent)
   - Each: Bangers label + short text + StarburstBadge CTA

5. WHY CHINGLE GRUMPUS
   - --color-dark background, white text
   - 3 columns: "⚡ LIVE EVERY FRIDAY" | "📦 SHIPS IN 1–2 DAYS" | "🏆 COLLECTOR TRUSTED"
   - Lightning bolt SVG dividers between columns

6. GIVEAWAY CALLOUT
   - --color-yellow background, halftone texture
   - Starburst CSS shape behind text
   - Headline: "WIN FREE CARDS. SERIOUSLY." (Bebas Neue, large)
   - Sub: "Every week, Chingle gives away rare pulls to the crew. Enter your email — no purchase needed."
   - Email input + "ENTER THE GIVEAWAY" button → /giveaway
   - Fine print: "Winner announced every Friday during the live stream on Whatnot."

7. NEWSLETTER STRIP
   - --color-dark background
   - Heading: "JOIN THE CREW"
   - Email input + "JOIN NOW" → addEmailSignup(email, 'homepage')
   - Fine print: "We don't spam. Just drops, deals, and giveaways."

8. FOOTER
   - Dark background, white text
   - Left: mascot icon placeholder + "CHINGLE GRUMPUS" Bebas Neue
   - Center: Shop · Live Drops · Giveaway · About
   - Right: Whatnot · Instagram · TikTok placeholder icons
   - Bottom: "© 2025 Chingle Grumpus. All rights reserved. · Powered by Matic AI"
```

---

### Recovery 4 — Shop + Product Detail Pages

```
Build the shop page at app/shop/page.tsx and product detail at app/shop/[slug]/page.tsx.

SHOP PAGE:
- Layout: 220px sidebar left + 3-column product grid right
- Sidebar filters:
  - Category: All / Sealed / Singles / Graded (radio buttons)
  - Set Name: multi-select checkboxes (pull unique set names from products)
  - Sort: Newest / Price Low–High / Price High–Low
  - Mobile: collapses into bottom drawer via "FILTER & SORT" button
- Read ?category= and ?sort= from URL params
- Fetch via getProducts() with those params
- 3 col desktop / 2 col tablet / 1 col mobile grid
- Sold out products: "SOLD OUT" StarburstBadge overlay, disabled add to cart button
- Page header: Bebas Neue "THE CARD SHOP" + small mascot illustration top-right

PRODUCT DETAIL PAGE:
- Two column layout: large image left, product info right
- Image: border: 3px solid #000, box-shadow: 4px 4px 0px #000
- Right column:
  - Category badge (Bangers, colored: red=sealed, blue=singles, gold=graded)
  - Product name (Bebas Neue)
  - Set name label (Nunito Sans)
  - If graded: PSA/BGS grade badge — white with colored border, large grade number
  - Price (Nunito Sans 700, large)
  - Condition label
  - Quantity stepper (+/- buttons)
  - "ADD TO CART" full-width button, --color-primary, hard shadow
  - Attributes table: Set · Year · Language · Condition · Grade · Grading Company
- Below fold: "YOU MIGHT ALSO LIKE" — 3 ProductCards, same category
```

---

### Recovery 5 — Cart + Stripe Checkout

```
Build the cart system and Stripe checkout flow.

1. Create CartContext at /context/CartContext.tsx:
   - State: array of { product, quantity }
   - Actions: addToCart, removeFromCart, updateQuantity, clearCart
   - Persist to localStorage
   - Expose cartCount for Navbar badge

2. Cart page at app/cart/page.tsx:
   - Line items: product image · name · quantity stepper · line total · remove (×)
   - Order summary: subtotal · shipping ($4.99 flat, free over $75) · total
   - "PROCEED TO CHECKOUT" button → POST to /api/checkout
   - "CONTINUE SHOPPING" → /shop
   - Empty state: mascot placeholder + speech bubble "YOUR CART IS EMPTY, TRAINER. 
     GO CATCH SOME CARDS." + "SHOP NOW" button

3. API route at app/api/checkout/route.ts:
   - POST handler: receives cart items from request body
   - Creates Stripe Checkout Session with line_items from cart
   - success_url: /order-success?session_id={CHECKOUT_SESSION_ID}
   - cancel_url: /cart
   - Returns { url } to redirect client

4. Order success page at app/order-success/page.tsx:
   - Reads session_id from URL params
   - Fetches Stripe session to get order details
   - Writes order to Supabase orders table via createOrder()
   - Shows mascot celebrating + "ORDER CONFIRMED! YOU'RE A TRUE COLLECTOR. 🎉"
   - Order summary display
   - "KEEP SHOPPING" → /shop
   - Inline email capture if not already signed up → addEmailSignup(email, 'order_success')

Use Stripe test mode throughout. All transactions are test-only for the demo.
```

---

### Recovery 6 — Live Drop + Giveaway Pages

```
Build the Live Drop page at app/live/page.tsx and Giveaway page at app/giveaway/page.tsx.

LIVE DROP PAGE:
Fetch live drop status from getLiveDropStatus(). Poll every 30 seconds 
via setInterval without full page reload.

Inactive state (is_active = false):
- Hero: --color-electric background + animated lightning SVG + mascot placeholder
- Headline: "THE NEXT DROP IS COMING." (Bebas Neue)
- CountdownTimer component counting down to next_drop_at from Supabase
- Description: "Every Friday, Chingle Grumpus goes live on Whatnot to rip packs, 
  reveal singles, and sell straight to collectors."
- Email capture: "GET NOTIFIED WHEN WE GO LIVE" → addEmailSignup(email, 'live_drop')
- "FROM LAST DROP": 3 ProductCards with is_live_drop = true (or featured fallback)

Active state (is_active = true):
- Pulsing red "🔴 LIVE NOW — CHINGLE IS STREAMING" banner (CSS pulse animation)
- "WATCH ON WHATNOT →" button opening stream_url in new tab
- Product grid: only products where is_live_drop = true
- Each card: "JUST DROPPED ⚡" StarburstBadge
- Grid refreshes with each 30-second poll

GIVEAWAY PAGE:
Hero section:
- --color-yellow background
- CSS starburst shape (clip-path) behind text
- Headline: "WIN FREE POKEMON CARDS." (Bebas Neue, massive)
- Sub: "Enter below — no purchase necessary. Winner announced every Friday on Whatnot."
- Mascot placeholder

GiveawayForm component:
- Fields: First Name (text) · Email (email)
- Checkbox: "Yes, also send me drop alerts and exclusive deals" (unchecked default)
- "ENTER THE GIVEAWAY" submit button
- On submit: 
  1. Call addGiveawayEntry(firstName, email, marketing_opt_in)
  2. If marketing_opt_in = true, also call addEmailSignup(email, 'giveaway', true)
  3. Show confirmation state (no page reload)

Confirmation state:
- Mascot celebrating placeholder
- "YOU'RE IN! 🎉 Winner announced Friday on Whatnot — make sure you're watching!"
- "While you wait, check out the shop →" CTA → /shop

Below form:
- Current prize: ProductCard for Charizard ex Full Art with "THIS WEEK'S PRIZE" badge
- Past winners: 3 seeded entries — "@username won [card] on [date]"

Rules section:
- One entry per email per week (enforce via week_of uniqueness check in Supabase)
- Winner selected randomly every Friday, announced on Whatnot stream
- No purchase necessary
```

---

### Recovery 7 — Polish + Demo Readiness

```
Review and polish the full Chingle Grumpus store for demo readiness. 
Go through each of the following:

1. ANNOUNCEMENT TICKER
   - Confirm it renders on every page above the Navbar
   - Messages: "⚡ FREE SHIPPING ON ORDERS OVER $75" · "🎁 ENTER THIS WEEK'S GIVEAWAY" 
     · "🔴 LIVE EVERY FRIDAY ON WHATNOT" · "✨ NEW SINGLES ADDED WEEKLY"
   - Scrolls continuously, loops seamlessly

2. NAVBAR
   - Sticky top (below ticker)
   - Cart count badge updates correctly from CartContext
   - Mobile hamburger opens full-screen drawer with all nav links

3. RESPONSIVE LAYOUT
   - Product grids: 3 col → 2 col (tablet) → 1 col (mobile)
   - Shop page sidebar collapses to bottom drawer on mobile
   - Hero text scales appropriately on small screens
   - All tap targets minimum 44px on mobile

4. FOOTER
   - Appears on all pages
   - "Powered by Matic AI" attribution in bottom bar

5. LOADING + ERROR STATES
   - All async Supabase fetches have loading skeletons or spinners
   - Graceful error messages if fetch fails (don't show blank page)

6. STRIPE TEST CHECKOUT
   - Verify full flow: add to cart → checkout → Stripe test card → 
     order success page → Supabase order record created
   - Test card: 4242 4242 4242 4242, any future date, any CVC

7. MASCOT PLACEHOLDERS
   - Confirm mascot placeholder appears in: hero, giveaway hero, 
     empty cart state, order success page, shop page header
   - Use a consistent styled placeholder (colored box with "MASCOT" label 
     or import the actual mascot image if available)

8. OVERALL VIBE CHECK
   - Open homepage — does it feel like a comic book Pokemon card store?
   - Is the Bebas Neue font rendering correctly on all headings?
   - Are the hard drop shadows visible on all cards and buttons?
   - Does the electric blue hero match the Chingle Grumpus brand color?
   - Is the announcement ticker scrolling?
   If anything looks generic or off-brand, fix it before calling the demo done.
```

---

## Build Order Summary

```
Full PRD → Plan → Build (Claude Code self-sequences)

If recovery needed:
1. Scaffold + Design System
2. Supabase Schema + Seed
3. Homepage
4. Shop + Product Detail
5. Cart + Stripe Checkout
6. Live Drop + Giveaway
7. Polish + Demo Readiness
```

---

## Environment Setup Checklist

Before running the build, make sure you have:

- [ ] New Next.js 14 project created (`npx create-next-app@latest`)
- [ ] Supabase project created and URL/anon key copied
- [ ] Stripe account in test mode, secret key and publishable key copied
- [ ] `.env.local` created from `.env.local.example`
- [ ] Supabase SQL editor ready to run migrations
- [ ] Vercel project connected to repo for deployment
- [ ] Custom domain (or Vercel subdomain) ready for the demo URL

## Demo Deployment Checklist

Before the sales meeting:

- [ ] All 10 products visible on shop page
- [ ] Stripe test checkout completes end-to-end
- [ ] Giveaway form submits and shows confirmation
- [ ] Live drop countdown shows correct next Friday date
- [ ] Announcement ticker scrolling on every page
- [ ] Site loads on mobile without layout issues
- [ ] Demo URL is live and shareable (not localhost)
- [ ] Have Stripe test card ready: 4242 4242 4242 4242
