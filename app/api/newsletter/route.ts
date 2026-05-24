import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isMailConfigured, renderEmail, sendMail } from "@/lib/mailer";
import { BRAND } from "@/lib/brand";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

interface Row {
  id: string;
  status: string;
  confirm_token: string;
  unsubscribe_token: string;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    console.log("[newsletter] no database configured — would subscribe:", email);
    return NextResponse.json({ ok: true, confirmed: true });
  }

  // Find or create the subscriber.
  const { data: existing } = await db
    .from("newsletter_subscribers")
    .select("id, status, confirm_token, unsubscribe_token")
    .eq("email", email)
    .maybeSingle();

  let row = existing as Row | null;

  if (row?.status === "confirmed") {
    return NextResponse.json({ ok: true, confirmed: true }); // already subscribed
  }

  if (!row) {
    const { data: inserted, error } = await db
      .from("newsletter_subscribers")
      .insert({ email, status: "pending" })
      .select("id, status, confirm_token, unsubscribe_token")
      .single();
    if (error || !inserted) {
      return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
    }
    row = inserted as Row;
  } else if (row.status === "unsubscribed") {
    await db
      .from("newsletter_subscribers")
      .update({ status: "pending", unsubscribed_at: null })
      .eq("id", row.id);
  }

  // Send the confirmation email if SMTP is configured; otherwise auto-confirm
  // so the signup isn't left stuck before email is wired up.
  if (isMailConfigured()) {
    const origin = new URL(req.url).origin;
    const confirmUrl = `${origin}/api/newsletter/confirm?token=${row.confirm_token}`;
    const { html, text } = renderEmail({
      heading: "One quick step to confirm",
      bodyHtml: `<p>Thanks for joining ${BRAND.name}. Please confirm your email so we can let you know the moment the shop opens.</p>
        <p style="margin:24px 0;"><a href="${confirmUrl}" style="display:inline-block;background:#34302a;color:#f8f6f2;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;">Confirm my subscription</a></p>
        <p style="font-size:13px;color:#978f81;">If you didn't sign up, you can ignore this email.</p>`,
    });
    try {
      await sendMail({ to: email, subject: `Confirm your ${BRAND.name} subscription`, html, text });
    } catch (err) {
      console.error("[newsletter] confirmation send failed:", err);
      return NextResponse.json({ error: "Could not send confirmation email." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, confirmed: false });
  }

  await db
    .from("newsletter_subscribers")
    .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
    .eq("id", row.id);
  return NextResponse.json({ ok: true, confirmed: true });
}
