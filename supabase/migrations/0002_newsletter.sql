-- Self-hosted subscribe engine: double opt-in, unsubscribe, and broadcasts.
-- Idempotent (safe to re-run).

-- Subscriber lifecycle on newsletter_subscribers ---------------------------
alter table public.newsletter_subscribers
  add column if not exists status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed')),
  add column if not exists confirm_token uuid not null default gen_random_uuid(),
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid(),
  add column if not exists confirmed_at timestamptz,
  add column if not exists unsubscribed_at timestamptz;

-- Anyone who signed up before double opt-in existed is already opted in.
update public.newsletter_subscribers
  set status = 'confirmed', confirmed_at = coalesce(confirmed_at, created_at)
  where status = 'pending' and created_at < now() - interval '1 minute';

create index if not exists newsletter_status_idx
  on public.newsletter_subscribers (status);
create index if not exists newsletter_confirm_token_idx
  on public.newsletter_subscribers (confirm_token);
create index if not exists newsletter_unsub_token_idx
  on public.newsletter_subscribers (unsubscribe_token);

-- Broadcasts (email campaigns) ---------------------------------------------
create table if not exists public.broadcasts (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  body            text not null,
  status          text not null default 'draft'
                    check (status in ('draft', 'sending', 'sent', 'failed')),
  recipient_count int not null default 0,
  sent_count      int not null default 0,
  sent_at         timestamptz,
  created_at      timestamptz not null default now()
);

alter table public.broadcasts enable row level security;
-- No public policies: broadcasts are admin-only via the service role.
