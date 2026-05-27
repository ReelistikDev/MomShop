-- MomShop — link orders to their Square hosted-checkout records so the webhook
-- can match a completed payment back to our order.
--
-- Apply with: node scripts/db-migrate.mjs 0005_order_square_ids.sql

alter table public.orders
  add column if not exists square_order_id text,
  add column if not exists payment_link_id text;

create index if not exists orders_square_order_idx on public.orders (square_order_id);
