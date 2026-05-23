# MomShop — boutique handmade jewelry storefront

A warm, natural, boutique-artisan storefront for handmade jewelry and
personalized gifts. Built to feel **quietly premium** — calm, airy, and
handcrafted, never flashy or corporate.

Display brand is a **placeholder** (`Willow & Wren`). Change it in one place —
`lib/brand.ts` — to rebrand the whole site.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (design tokens in `app/globals.css`)
- **Supabase** (optional) for catalog reads + newsletter / contact storage
- Deploy target: **Vercel**

## Design system

Defined as Tailwind tokens in `app/globals.css`:

- **Type** — `Fraunces` (soft editorial serif) for headings, `Hanken Grotesk`
  (warm humanist sans) for body.
- **Palette** — warm off-white `#f8f6f2`, linen `#efeae0`, muted sage `#8b9a7b`,
  white-oak `#c8b49a`, warm charcoal ink `#34302a` (never pure black), hairline
  warm borders.
- Generous spacing, subtle radii (`rounded-card`), very soft shadows
  (`shadow-soft` / `shadow-card` / `shadow-lift`), minimal motion.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

The site runs **fully on local seed data — no database required.**

## Pages

`/` home · `/shop` (filterable) · `/products/[slug]` · `/collections` +
`/collections/[slug]` · `/personalized` · `/about` · `/contact`. Cart is
client-side (localStorage) with a slide-out drawer.

## Imagery

Photos in `public/images` are **placeholders** pulled from Unsplash — swap them
with the brand's own product/lifestyle photography. `scripts/fetch-images.mjs`
re-pulls a themed set if needed. Remote Unsplash URLs are already allowed in
`next.config.ts`.

## Going live with Supabase

The data layer (`lib/data.ts`) is async and shaped to be backed by Supabase.

1. Create a Supabase project.
2. Apply `supabase/migrations/0001_init.sql` then `supabase/seed.sql`.
3. Copy `.env.example` → `.env.local` and fill:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

With env set, the newsletter and contact forms write to Supabase
(`app/api/newsletter`, `app/api/contact`); without it they no-op gracefully.
To read the catalog from Supabase, point the accessors in `lib/data.ts` at the
`products` / `collections` tables (RLS already allows public reads).

## Project layout

```
app/                routes (App Router)
  api/              newsletter + contact route handlers
components/         UI (header, footer, cards, cart, forms, icons)
  ui/               primitives (button, badge, container, section heading)
  cart/             cart provider + drawer + add-to-cart
lib/                brand, types, seed catalog, utils, supabase client
supabase/           schema migration + seed
public/images/      placeholder photography
```
