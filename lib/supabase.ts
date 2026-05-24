import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAnon: SupabaseClient | null = null;
let cachedAdmin: SupabaseClient | null = null;

/**
 * Public (anon) Supabase client, or `null` when the project hasn't been
 * provisioned yet (no env vars). Subject to RLS. Use for public catalog reads
 * and form inserts. Callers fall back to seed data / no-op without a database.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!cachedAnon) {
    cachedAnon = createClient(url, key, { auth: { persistSession: false } });
  }
  return cachedAnon;
}

/**
 * SERVER-ONLY admin client using the service role key — bypasses RLS. Never
 * import this into client components. Returns `null` until env is configured.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cachedAdmin) {
    cachedAdmin = createClient(url, key, { auth: { persistSession: false } });
  }
  return cachedAdmin;
}

/** True when admin persistence (service role) is configured. */
export function isDatabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
