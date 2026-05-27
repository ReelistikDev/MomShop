-- The Myrtle Turtle — per-product inventory tracking.
--
-- products.stock: NULL = not tracked (unlimited); a number = units available.
-- Apply with: node scripts/db-migrate.mjs 0006_product_stock.sql

alter table public.products
  add column if not exists stock integer check (stock is null or stock >= 0);

-- Atomic, clamped decrement called by the checkout webhook when an order is
-- paid. No-ops for untracked products (stock is null).
create or replace function public.decrement_product_stock(p_id uuid, p_qty int)
returns void language sql as $$
  update public.products
     set stock = greatest(0, stock - p_qty)
   where id = p_id and stock is not null;
$$;
