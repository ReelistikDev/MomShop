import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/emails";

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  const db = getSupabaseAdmin();

  if (db && token) {
    const { data: row } = await db
      .from("newsletter_subscribers")
      .select("email, status, unsubscribe_token")
      .eq("confirm_token", token)
      .maybeSingle();

    // Only confirm + welcome a pending subscriber (idempotent on repeat clicks).
    if (row && row.status === "pending") {
      await db
        .from("newsletter_subscribers")
        .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
        .eq("confirm_token", token);
      await sendWelcomeEmail(row.email, row.unsubscribe_token);
    }
  }

  return NextResponse.redirect(new URL("/newsletter/confirmed", req.url));
}
