"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";
import { appUrl, isMailConfigured, renderEmail, sendMail } from "@/lib/mailer";

export async function sendBroadcast(formData: FormData) {
  const subject = String(formData.get("subject") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const db = getSupabaseAdmin();
  if (!db || !subject || !body || !isMailConfigured()) return;

  const { data: subs } = await db
    .from("newsletter_subscribers")
    .select("email, unsubscribe_token")
    .eq("status", "confirmed");
  const recipients = subs ?? [];

  const { data: bc } = await db
    .from("broadcasts")
    .insert({ subject, body, status: "sending", recipient_count: recipients.length })
    .select("id")
    .single();
  const id = bc?.id as string | undefined;

  const base = appUrl();
  const bodyHtml = body
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  let sent = 0;
  for (const r of recipients) {
    const unsubscribeUrl = `${base}/api/newsletter/unsubscribe?token=${r.unsubscribe_token}`;
    const { html, text } = renderEmail({ heading: subject, bodyHtml, unsubscribeUrl });
    try {
      await sendMail({
        to: r.email,
        subject,
        html,
        text,
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      sent++;
    } catch (err) {
      console.error("[broadcast] send failed:", r.email, err);
    }
  }

  if (id) {
    await db
      .from("broadcasts")
      .update({
        status: sent > 0 || recipients.length === 0 ? "sent" : "failed",
        sent_count: sent,
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);
  }
  revalidatePath("/admin/broadcasts");
}
