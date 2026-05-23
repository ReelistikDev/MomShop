# MomShop — Context & Handoff

_Last updated: 2026-05-23. Keep this current at the end of each session._

## What this is

Storefront for **Gavin's mom's shop** — she makes **only earrings**. The
signature pieces are **hand-painted scenic wood rounds** (night skies, pine
forests, crescent moons, stars, bears on light wood, painted in deep
twilight-blue), plus **leather** and **mixed** (wood + leather + brass) pairs.

Vibe: warm, natural, **"quietly premium"** boutique-artisan — cozy and
handcrafted, NOT flashy/corporate/luxury-black/pink-glitter/boho-overload.
Reference styling = kraft "Handmade with love" tags w/ a red heart + handwritten
script, eucalyptus, dried florals, macramé, warm candlelight. The real reference
photo is `public/images/display.jpg` (used as the site hero — the ONLY real
photo so far; everything else is an Unsplash placeholder).

Display brand name is a **placeholder, "Willow & Wren"** — change `lib/brand.ts`
in one place to rebrand. Need her real shop name.

## Stack & run

- Next.js **16.2.6** (App Router) · React 19 · TypeScript · Tailwind **v4**
  (tokens live in CSS, `@theme` block in `app/globals.css` — no tailwind.config).
- Supabase-ready but **no project provisioned** (runs fully on local seed data).
- Deploy target: Vercel.

```bash
npm run dev      # http://localhost:3000
npm run build    # clean prod build (run before committing)
```

Repo: `ReelistikDev/MomShop` · clone `C:\Users\gavin\repos\MomShop`.
Pushing to `main` works here with cached creds. Per Gavin's parallel-session
rule: `git fetch` + compare `origin/main` before pushing.

## Git state (as of this writing)

- `main` @ `4c5aaec`, synced with origin.
- Uncommitted: `components/placeholders.tsx` (new — see in-progress task below).
- Commits: `0eba827` initial build → `b9801a2` pivot to earrings-only →
  `4c5aaec` align to real product (painted scenes, twilight+heart, script font).

## Design system (`app/globals.css` @theme)

- **Type:** `Fraunces` (serif headings), `Hanken Grotesk` (sans body),
  `Caveat` (`font-script`, handwritten accent — used for "with love" / captions).
  Fonts loaded in `app/layout.tsx` via next/font.
- **Color tokens:** `cream #f8f6f2`, `shell`, `linen`, `sand`, `oak`/`oak-dark`
  (wood), `sage`/`sage-light`/`sage-dark` (botanical), `twilight`/`twilight-soft`/
  `sky` (night-sky blue accent), `heart #b35a44` (clay red), `ink`/`stone`/`mist`
  (text), `line`/`line-strong` (warm hairline borders).
- Utilities: `text-display/h1/h2/h3` (fluid clamps), `eyebrow`, `animate-rise`,
  `rounded-card`, `shadow-soft/card/lift`. Soft shadows only, subtle radii.

## File map

```
app/
  layout.tsx            fonts + metadata + providers + header/footer/cart drawer
  page.tsx              home (hero, [material tiles], [best sellers], custom,
                        values, studio banner, newsletter)
  shop/page.tsx         earrings grid + material filter chips (?material=)
  products/[slug]/      product detail (gallery, variants, engraving, specs)
  custom/page.tsx       made-to-order custom (CNC shapes, engraving)
  about/page.tsx        story + values + banner
  contact/page.tsx      contact form + FAQ
  api/newsletter/, api/contact/   route handlers (Supabase-or-noop)
components/
  site-header.tsx       sticky nav (Shop/Custom/About/Contact) + announcement bar
  site-footer.tsx       columns + "Handmade with love" script tagline
  product-card.tsx, material-card.tsx, product-gallery.tsx
  placeholders.tsx      ComingSoonCard + PlaceholderPanel  (NEW, see task)
  cart/                 cart-provider (localStorage) + cart-drawer + add-to-cart
  ui/                   button, badge, container, section-heading
  icons.tsx             inline SVG set (incl. HeartIcon, SprigIcon)
  newsletter.tsx, contact-form.tsx
lib/
  brand.ts              brand name/contact/socials (placeholder identity)
  data.ts               seed catalog + async accessors (Supabase-shaped)
  types.ts              Product / Material / CartItem
  supabase.ts           getSupabase() — null when no env (graceful fallback)
  utils.ts              cn(), formatPrice()
supabase/migrations/0001_init.sql, supabase/seed.sql   earrings schema + seed
scripts/fetch-images.mjs    re-pull a themed Unsplash image set (uses curl)
scripts/one-image.mjs       re-fetch a single image by query
public/images/              display.jpg (REAL) + placeholders
```

## Data model (`lib/data.ts`)

- `materials`: wood / leather / mixed (slug, name, tagline, description, image).
- `products` (8): hand-painted wood rounds — `moonlit-pines`, `wandering-bear`,
  `starry-forest`, `mountain-range` (personalizable, engrave back) — plus leather
  `saddle-teardrops`, `fringe-danglers`, `harvest-studs`, and mixed
  `grove-mixed-drops`. Fields: material, style, price, images[], badge, copy,
  materials/details/care[], variants (painted wood = Hardware: Surgical Steel/
  Brass; leather = Tone), flags. Accessors are async (swap to Supabase later).

## ⚠️ IN-PROGRESS TASK — convert UI to "Coming soon"

**Why:** placeholder stock photos + made-up products aren't representative, so
strip them and show clean "Coming soon" states until real photos/lineup exist.
**Keep `lib/data.ts` + seed intact** (data stays for later; just stop surfacing
it). **Keep the real hero photo** `display.jpg` (Gavin OK'd keeping it as a
teaser; offered to remove — revisit if he wants it gone).

**Done:** `components/placeholders.tsx` — exports `ComingSoonCard` (product-grid
stand-in) and `PlaceholderPanel` (`tone="light"` linen panel w/ sprig+caption,
or `tone="dark"` twilight→ink gradient for behind cream text).

**Remaining (precise):**
1. `app/page.tsx`
   - Hero: keep `display.jpg`. Change CTAs → primary "Join the list" to
     `/#newsletter`, secondary "Request a custom pair" to `/custom`. Change the
     floating script caption to e.g. "Opening soon ♥".
   - Remove the **Shop-by-material** section (MaterialCard) AND the **Customer
     favorites** section (best-seller ProductCards). Replace with ONE
     "Coming soon" section: heading (e.g. "Our first collection is on its way")
     + 4 `<ComingSoonCard/>`.
   - Custom section: replace the `<Image src=custom.jpg>` with
     `<PlaceholderPanel tone="light" />` filling that column.
   - Studio banner: replace `<Image src=banner-craft.jpg>` with
     `<PlaceholderPanel tone="dark" className="absolute inset-0" />` (cream text
     still reads). Keep/relax the dark overlay.
   - Newsletter `<section>`: add `id="newsletter"` + `scroll-mt-24`.
   - Drop now-unused imports: MaterialCard, ProductCard, getMaterials,
     getBestSellers. Add ComingSoonCard, PlaceholderPanel. (Image still used by hero.)
2. `components/site-header.tsx` — announcement bar: change the second phrase
   "Free U.S. shipping over $50" → "New collection coming soon".
3. `app/shop/page.tsx` — remove filter chips + product grid (and
   getProducts/getMaterials/cn usage). Show coming-soon heading + a grid of
   ~6 `<ComingSoonCard/>`. Keep the page header band.
4. `app/custom/page.tsx` — replace hero `<Image src=custom.jpg>` with
   `<PlaceholderPanel tone="light"/>`. Replace the "Ready to personalize"
   ProductCard grid with a coming-soon note (or ComingSoonCards). Drop
   getPersonalizable/ProductCard imports.
5. `app/about/page.tsx` — replace intro `<Image src=about.jpg>` with
   `<PlaceholderPanel tone="light"/>`; replace banner `<Image src=banner-craft.jpg>`
   with `<PlaceholderPanel tone="dark"/>`. Drop Image import if unused.
6. `app/products/[slug]/page.tsx` — NOT reachable from UI once cards are
   non-links, so leaving as-is is acceptable "for now." (Decision pending: gut or
   keep. If keeping, those pages still show placeholder stock photos if hit
   directly.)
7. `components/site-footer.tsx` (optional) — Shop column links to
   `/shop?material=...`; harmless (shop ignores filter now) but consider trimming
   to just "Earrings (coming soon)".
8. Then: `npm run build`, screenshot-verify, commit, push.

## Verifying visually (no browser in terminal)

- Start server, then headless **Edge**:
  `"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new
  --hide-scrollbars --window-size=1440,3400 --screenshot=out.png URL`
  then `Read` the PNG. **Desktop shots are faithful; `--screenshot` mis-renders
  MOBILE width** (clips, looks like overflow but isn't). For real mobile shots use
  puppeteer-core with a set viewport (it was installed then removed — re-add if needed).
- Kill the dev/prod server by PID on :3000:
  `netstat -ano | grep ":3000.*LISTENING"` → `taskkill //F //PID <pid>`.

## Backlog / open items

1. **Real product photos** — biggest upgrade; drop into `public/images` (reuse
   filenames or update `lib/data.ts`). Only `display.jpg` is real today.
2. **Real lineup** — confirm her actual designs / names / prices; replace seed.
3. **Brand name** — replace placeholder "Willow & Wren" (`lib/brand.ts`).
4. **Supabase** — provision a project, apply `supabase/migrations` + `seed.sql`,
   set `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY`, point `lib/data.ts` accessors at the
   DB (RLS already allows public reads). No momshop Supabase MCP exists yet.
5. **Checkout** — not wired; cart drawer "Checkout" shows a "coming soon" note.

## Gotchas

- Next.js 16: `params`/`searchParams` are **Promises** (`await` them). Bundled
  docs in `node_modules/next/dist/docs/`.
- Tailwind v4: define design tokens in the `@theme` block in `globals.css`; each
  `--color-x`/`--font-x`/`--shadow-x` becomes a utility. No JS config file.
- `npm run build` runs ESLint and **fails on unused imports** — clean them up
  when removing component usages (relevant to the coming-soon task above).
