import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { notifyAdminOfContact, sendContactAck } from "@/lib/emails";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !EMAIL.test(email) || !message) {
    return NextResponse.json(
      { error: "Please add your name, a valid email, and a message." },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("contact_messages")
      .insert({ name, email, subject: subject || null, message });
    if (error) {
      console.error("[contact] insert failed:", error.message);
      return NextResponse.json({ error: "Could not send message." }, { status: 500 });
    }
  } else {
    console.log("[contact] no database configured — message from:", email);
  }

  // Fire the lifecycle emails (no-op if mail isn't configured; never blocks the
  // response on a send failure since the message is already saved).
  await Promise.allSettled([
    sendContactAck(name, email),
    notifyAdminOfContact({ name, email, subject, message }),
  ]);

  return NextResponse.json({ ok: true });
}
