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

## Admin dashboard (`/admin`)

Private studio dashboard so the client manages the catalog + sees signups, plus
a finance engine. **Foundation is built; module CRUD is the next step.**

- **Auth = single password → jose JWT** (like PopsShop). `ADMIN_PASSWORD` +
  `ADMIN_JWT_SECRET` are server-only env vars. Login route compares server-side,
  signs a JWT, sets an **httpOnly** `ww_admin` cookie; `proxy.ts` (Next 16's
  renamed middleware) verifies it on `/admin/*` and redirects to `/admin/login`.
  Verified: unauthed→307, wrong pw→401, right pw→200+cookie, authed→dashboard.
- **Layout split via route groups:** root `app/layout.tsx` is slim (html/fonts);
  `app/(storefront)/layout.tsx` has the shop chrome (header/footer/cart);
  `app/admin/(panel)/layout.tsx` is the dashboard shell (sidebar nav). Login
  lives at `app/admin/login/` (outside the panel group, no shell). Route groups
  don't change URLs.
- **Modules (nav):** Dashboard, Products, Categories, Finances, Subscribers,
  Messages. Right now each is a **gated stub**: shows live data when the DB is
  connected (`isDatabaseConfigured()`), else a `ConnectNotice`. Dashboard already
  runs live count/net queries when connected.
- Server uses **`getSupabaseAdmin()`** (service role, bypasses RLS) for admin
  reads/writes — never exposed to client. Public still uses `getSupabase()` (anon).
- `.env.local` (gitignored) currently has TEST admin creds (`momtest123`) and no
  Supabase, so the admin shows the connect state. Replace for real use.

### Supabase provisioning (do this next — client/owner)

> Project provisioned: ref **`wqrjdnsmnvyucrlasouk`**. Project-scoped MCP added
> in `.mcp.json` (`supabase` server). Authenticate once via `claude /mcp` (real
> terminal) → select `supabase` → Authenticate, then **restart Claude Code** so
> the MCP loads (it's not active in the session where it was added). After that,
> the migration can be applied via the MCP's `apply_migration`.

1. Create a Supabase project (supabase.com). Copy Project URL + anon key +
   **service_role** key (Settings → API) into `.env.local` (and Vercel):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, plus `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor (categories,
   products, finance_transactions, newsletter_subscribers, contact_messages,
   RLS). `seed.sql` is intentionally empty.
3. Create Storage buckets: `media` (public — product images) and `receipts`
   (private — finance receipts, served via signed URLs).
4. Restart. The admin modules light up; build out CRUD + finance charts + upload.

### Admin module build — remaining (next session)

- Products CRUD (form + image upload to `media`), Categories CRUD, Subscribers
  list + CSV export, Messages inbox (read/mark-read), Finances (income/expense
  entries, income-vs-expense donut + category breakdown via hand-rolled SVG,
  P&L by date range, receipt upload to `receipts` auto-linked to an expense).
- Point public `lib/data.ts` accessors at Supabase so products created in admin
  show on the storefront (RLS already allows public reads of active rows).
- Product detail template (`(storefront)/products/[slug]`) still uses the old
  `material` field/breadcrumb — realign to `category` when wiring products.

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
  layout.tsx            root: slim — html/fonts/metadata only
  (storefront)/         public site (route group; URLs unchanged)
    layout.tsx          shop chrome: CartProvider + header/footer/drawer
    page.tsx shop/ custom/ about/ contact/ products/[slug]/
  admin/
    login/page.tsx      standalone login (no shell)
    (panel)/            dashboard group
      layout.tsx        sidebar shell (AdminNav)
      page.tsx          dashboard (live counts/net when DB connected)
      products/ categories/ finances/ newsletter/ messages/   gated stubs
  api/
    newsletter/ contact/        public form handlers (Supabase-or-noop)
    admin/login/ admin/logout/  jose session set/clear
proxy.ts                /admin guard (Next 16 renamed middleware)
components/
  site-header.tsx, site-footer.tsx, placeholders.tsx, product-card.tsx,
  product-gallery.tsx, cart/*, ui/*, newsletter.tsx, contact-form.tsx,
  icons.tsx (HeartIcon, SprigIcon, admin icons)
  admin/  admin-nav.tsx (client) · admin-ui.tsx (PageHeader/StatCard/ConnectNotice/ReadyPanel)
lib/
  brand.ts · data.ts (EMPTY catalog + accessors) · types.ts · utils.ts
  supabase.ts (getSupabase anon + getSupabaseAdmin service-role + isDatabaseConfigured)
  auth.ts (jose sign/verify + verifyPassword)
supabase/migrations/0001_init.sql   full schema (categories, products,
                                    finance_transactions, newsletter, contact, RLS)
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
