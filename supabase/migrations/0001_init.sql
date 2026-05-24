-- MomShop — full schema: catalog (categories + products), storefront forms
-- (newsletter + contact), and the admin finance engine (transactions/receipts).
--
-- Security model:
--   * Public (anon key): READ active categories/products; INSERT newsletter +
--     contact. Nothing else is readable by anon.
--   * Admin: all writes + finance/forms reads go through the server using the
--     SERVICE ROLE key, which bypasses RLS. The service role key is never
--     exposed to the browser.

create extension if not exists "pgcrypto";

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ------------------------------------------------------------------ categories
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  description text not null default '',
  image       text,
  sort_order  int  not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------------- products
create table if not exists public.products (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  name              text not null,
  category          text references public.categories(slug) on delete set null,
  price             numeric(10,2) not null default 0 check (price >= 0),
  compare_at_price  numeric(10,2),
  short_description text not null default '',
  description       text not null default '',
  images            text[] not null default '{}',
  badge             text check (badge in ('handmade','custom','bestseller','new')),
  variants          jsonb not null default '[]'::jsonb,
  sku               text,
  featured          boolean not null default false,
  sold_out          boolean not null default false,
  active            boolean not null default true,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (active);
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------- finance (admin only)
create table if not exists public.finance_transactions (
  id             uuid primary key default gen_random_uuid(),
  type           text not null check (type in ('income','expense')),
  amount         numeric(12,2) not null check (amount >= 0),
  occurred_on    date not null default current_date,
  category       text not null default 'Other',
  description    text not null default '',
  payment_method text,
  receipt_url    text,                 -- linked receipt file (Supabase Storage)
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists finance_type_idx on public.finance_transactions (type);
create index if not exists finance_date_idx on public.finance_transactions (occurred_on);
create trigger finance_set_updated_at before update on public.finance_transactions
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------- newsletter + contact
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text,
  message    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------- RLS
alter table public.categories             enable row level security;
alter table public.products               enable row level security;
alter table public.finance_transactions   enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages       enable row level security;

-- Catalog: world-readable when active.
create policy "Public read active categories"
  on public.categories for select using (active);
create policy "Public read active products"
  on public.products for select using (active);

-- Forms: anonymous inserts only (no public select).
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert with check (true);
create policy "Anyone can send a message"
  on public.contact_messages for insert with check (true);

-- finance_transactions: RLS on, no policies → no anon access. Admin uses the
-- service role key (bypasses RLS) from the server.
