import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

async function unsubscribe(token: string | null) {
  const db = getSupabaseAdmin();
  if (db && token) {
    await db
      .from("newsletter_subscribers")
      .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
      .eq("unsubscribe_token", token);
  }
}

// Browser click → update + show a friendly page.
export async function GET(req: Request) {
  await unsubscribe(new URL(req.url).searchParams.get("token"));
  return NextResponse.redirect(new URL("/newsletter/unsubscribed", req.url));
}

// One-click (RFC 8058 List-Unsubscribe-Post) → 200, no redirect.
export async function POST(req: Request) {
  await unsubscribe(new URL(req.url).searchParams.get("token"));
  return NextResponse.json({ ok: true });
}
