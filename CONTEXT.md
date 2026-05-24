# MomShop — Context & Handoff

_Last updated: 2026-05-23. Keep this current at the end of each session._

## What this is

A storefront for **Gavin's mom's shop** — a **general handmade boutique**
(hats, earrings, shirts, stickers, and more). Currently a polished
**"Coming soon" landing**: the brand, design, and pages are built, but there
are **no products or categories yet** — the client will add their own lineup
and photography later.

Vibe: warm, natural, **"quietly premium"** boutique-artisan — cozy and
handcrafted ("Handmade with love" w/ a clay heart + handwritten script +
botanical sprigs), NOT flashy/corporate/luxury-black/pink-glitter/boho-overload.

Display brand name is a **placeholder, "Willow & Wren"** — change `lib/brand.ts`
in one place to rebrand. Still need her real shop name.

> History: started as a general jewelry boutique → pivoted to earrings-only
> (CNC wood + leather, then hand-painted scenic wood) → **rebranded back to a
> general boutique** and stripped to a Coming-soon state. If you see any
> leftover earrings/wood/night-sky wording, it's a miss — flag/fix it.

## Stack & run

- Next.js **16.2.6** (App Router) · React 19 · TypeScript · Tailwind **v4**
  (tokens in the `@theme` block of `app/globals.css` — no tailwind.config).
- Supabase-ready but **no project provisioned** (runs fully on empty seed data).
- Deploy target: Vercel.

```bash
npm run dev      # http://localhost:3000
npm run build    # clean prod build (run before committing; ESLint fails on unused imports)
```

Repo: `ReelistikDev/MomShop` · clone `C:\Users\gavin\repos\MomShop`. Pushing to
`main` works here with cached creds. Per Gavin's parallel-session rule:
`git fetch` + compare `origin/main` before pushing.

## Current state (what's built)

- **Coming-soon general boutique.** Home, Shop, Custom, About, Contact, 404.
  Nav = **Shop / Custom / About / Contact**. Sticky header w/ twilight
  announcement bar ("Handmade with love · New shop opening soon").
- **No images** in `public/images` (all placeholders removed) — pages are
  imageless by design: typographic heros, twilight→ink gradient banners,
  `ComingSoonCard` grids, and an icon-based values section. Nothing looks
  broken/empty.
- **Empty catalog** (`lib/data.ts`): `products = []`, `materials = []`.
  Accessors stay async/Supabase-shaped. So `/shop` + home show Coming-soon
  cards; `/products/[slug]` builds 0 pages (template kept for later).
- Cart (localStorage) + slide-out drawer still wired (no items yet).
- Newsletter + Contact API routes write to Supabase when env present, else no-op.

## Design system (`app/globals.css` @theme)

- **Type:** `Fraunces` (serif headings), `Hanken Grotesk` (sans body),
  `Caveat` (`font-script`, handwritten accent — "Opening soon", "Worth the
  wait", footer "Handmade with love"). Loaded in `app/layout.tsx`.
- **Colors:** `cream`, `shell`, `linen`, `sand`, `oak`/`oak-dark`,
  `sage`/`sage-light`/`sage-dark`, `twilight`/`twilight-soft`/`sky` (blue accent,
  used in announcement bar + dark gradient banners), `heart #b35a44` (clay red),
  `ink`/`stone`/`mist`, `line`/`line-strong`.
- Utilities: `text-display/h1/h2/h3`, `eyebrow`, `animate-rise`, `rounded-card`,
  `shadow-soft/card/lift`, `font-script`. Soft shadows + subtle radii only.

## File map

```
app/
  layout.tsx            fonts (Fraunces/Hanken/Caveat) + metadata + providers
  page.tsx              home — coming-soon landing (hero, coming-soon cards,
                        values, custom card, twilight studio banner, newsletter)
  shop/page.tsx         "Coming soon" — header + 8 ComingSoonCards (no products)
  custom/page.tsx       custom orders (generalized; steps + what's-possible + CTA)
  about/page.tsx        story + values + twilight banner (imageless)
  contact/page.tsx      contact form + FAQ
  products/[slug]/      product detail template (builds 0 pages while catalog empty)
  api/newsletter/, api/contact/   route handlers (Supabase-or-noop)
components/
  site-header.tsx, site-footer.tsx
  placeholders.tsx      ComingSoonCard (used) + PlaceholderPanel (spare, unused)
  product-card.tsx, product-gallery.tsx, cart/*, ui/*, newsletter.tsx,
  contact-form.tsx, icons.tsx (incl. HeartIcon, SprigIcon)
lib/
  brand.ts              brand name/contact/socials (placeholder identity)
  data.ts               EMPTY catalog + async accessors (Supabase-shaped)
  types.ts              Product / Material / CartItem (Material* unused for now)
  supabase.ts, utils.ts
supabase/migrations/0001_init.sql   generic catalog schema (materials + products)
supabase/seed.sql                   EMPTY (client adds categories/products)
public/images/                      empty
```

## Backlog / next steps

1. **Client fills the catalog** — categories + products + real photos. Today
   everything is Coming-soon by design.
2. **Real shop name** — replace placeholder "Willow & Wren" in `lib/brand.ts`.
3. **Supabase** — provision a project; when wiring, consider renaming
   `materials`→`categories` (+ `products.material`→`category`, drop `style`) to
   fit the general-boutique model, then point `lib/data.ts` accessors at the DB
   (RLS already allows public reads). No momshop Supabase MCP exists yet.
4. **Checkout** — not wired; cart "Checkout" shows a "coming soon" note.
5. When real products land, revisit `/products/[slug]` (breadcrumb still uses
   the old material grouping) and the home/shop grids (swap ComingSoonCard for
   ProductCard).

## Verifying visually (no browser in terminal)

- Start server, then headless **Edge** (desktop shots are faithful;
  `--screenshot --window-size` mis-renders MOBILE — use puppeteer-core viewport
  for mobile, it was installed then removed):
  `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new
  --hide-scrollbars --window-size=1440,3000 --screenshot=out.png URL` then `Read` it.
- Kill server: `netstat -ano | grep ":3000.*LISTENING"` → `taskkill //F //PID <pid>`.

## Gotchas

- Next.js 16: `params`/`searchParams` are **Promises** (`await`). Bundled docs in
  `node_modules/next/dist/docs/`.
- Tailwind v4: tokens live in the `@theme` block in `globals.css`; each
  `--color-x`/`--font-x` becomes a utility. No JS config file.
- `npm run build` runs ESLint and **fails on unused imports** — clean them up.
