-- MomShop — online orders (Square checkout).
--
-- Security model: orders and order_items have RLS enabled with NO policies, so
-- the anon key can neither read nor write them. The checkout route writes them
-- with the SERVICE ROLE key (bypasses RLS) from the server only.
--
-- Apply with: node scripts/db-migrate.mjs 0003_orders.sql

-- --------------------------------------------------------------------- orders
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  status             text not null default 'pending'
                       check (status in ('pending','paid','failed')),
  customer_name      text not null,
  customer_email     text not null,
  ship_line1         text,
  ship_line2         text,
  ship_city          text,
  ship_state         text,
  ship_postal        text,
  ship_country       text not null default 'US',
  subtotal           numeric(10,2) not null default 0 check (subtotal >= 0),
  total              numeric(10,2) not null default 0 check (total >= 0),
  currency           text not null default 'USD',
  square_payment_id  text,
  square_receipt_url text,
  note               text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists orders_status_idx  on public.orders (status);
create index if not exists orders_created_idx on public.orders (created_at);
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- order_items
create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  name        text not null,
  unit_price  numeric(10,2) not null check (unit_price >= 0),
  quantity    int not null check (quantity > 0),
  gift_note   text,
  engraving   text,
  options     jsonb not null default '{}'::jsonb
);
create index if not exists order_items_order_idx on public.order_items (order_id);

-- --------------------------------------------------------------------- RLS
-- Enabled with no policies → service role only (server). No anon access.
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;
