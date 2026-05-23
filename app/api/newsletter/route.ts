import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });
    // A repeat signup (unique violation) is fine — treat as success.
    if (error && !/(duplicate|unique|23505)/i.test(error.message)) {
      console.error("[newsletter] insert failed:", error.message);
      return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
    }
  } else {
    console.log("[newsletter] no database configured — would subscribe:", email);
  }

  return NextResponse.json({ ok: true });
}
