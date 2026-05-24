import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const db = getSupabaseAdmin();
  if (db && token) {
    await db
      .from("newsletter_subscribers")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("confirm_token", token)
      .neq("status", "unsubscribed");
  }
  return NextResponse.redirect(new URL("/newsletter/confirmed", req.url));
}
