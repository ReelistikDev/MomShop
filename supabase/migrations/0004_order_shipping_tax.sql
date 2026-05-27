-- MomShop — add computed shipping + tax amounts to orders.
--
-- Apply with: node scripts/db-migrate.mjs 0004_order_shipping_tax.sql

alter table public.orders
  add column if not exists shipping numeric(10,2) not null default 0 check (shipping >= 0),
  add column if not exists tax      numeric(10,2) not null default 0 check (tax >= 0);
