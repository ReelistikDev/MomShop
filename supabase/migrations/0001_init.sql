-- MomShop — initial commerce schema
-- Catalog (collections, products) is publicly readable; newsletter + contact
-- accept anonymous inserts but are not publicly readable.

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------- collections
create table if not exists public.collections (
  slug        text primary key,
  name        text not null,
  tagline     text not null,
  description text not null,
  image       text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------------- products
create table if not exists public.products (
  id               text primary key,
  slug             text unique not null,
  name             text not null,
  collection_slug  text not null references public.collections(slug) on delete restrict,
  price            numeric(10,2) not null check (price >= 0),
  images           text[] not null default '{}',
  badge            text check (badge in ('handmade','custom','bestseller','new')),
  short_description text not null,
  description      text not null,
  materials        text[] not null default '{}',
  details          text[] not null default '{}',
  care             text[] not null default '{}',
  variants         jsonb  not null default '[]'::jsonb,
  personalizable   boolean not null default false,
  best_seller      boolean not null default false,
  is_new           boolean not null default false,
  active           boolean not null default true,
  sort_order       int     not null default 0,
  created_at       timestamptz not null default now()
);
create index if not exists products_collection_idx on public.products (collection_slug);
create index if not exists products_active_idx on public.products (active);

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
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------- RLS
alter table public.collections             enable row level security;
alter table public.products                enable row level security;
alter table public.newsletter_subscribers  enable row level security;
alter table public.contact_messages        enable row level security;

-- Catalog: world-readable.
create policy "Public read collections"
  on public.collections for select using (true);

create policy "Public read active products"
  on public.products for select using (active);

-- Forms: anonymous inserts allowed; no public select (privacy).
create policy "Anyone can subscribe"
  on public.newsletter_subscribers for insert with check (true);

create policy "Anyone can send a message"
  on public.contact_messages for insert with check (true);
