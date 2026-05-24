import { BRAND } from "./brand";
import { appUrl, isMailConfigured, renderEmail, sendMail } from "./mailer";

/** Escape user-supplied text before interpolating into email HTML. */
function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function listUnsubscribe(url: string) {
  return {
    "List-Unsubscribe": `<${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

/** Sent after a subscriber confirms (double opt-in complete). */
export async function sendWelcomeEmail(email: string, unsubscribeToken: string) {
  if (!isMailConfigured()) return;
  const unsubscribeUrl = `${appUrl()}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const { html, text } = renderEmail({
    heading: `Welcome to ${BRAND.name}`,
    bodyHtml: `<p>You're on the list — thank you for joining ${esc(BRAND.name)}.</p>
      <p>We'll send a gentle note when new pieces land and the moment the shop opens. No noise, we promise.</p>`,
    unsubscribeUrl,
  });
  try {
    await sendMail({
      to: email,
      subject: `Welcome to ${BRAND.name}`,
      html,
      text,
      headers: listUnsubscribe(unsubscribeUrl),
    });
  } catch (err) {
    console.error("[email] welcome failed:", err);
  }
}

/** Auto-reply to a customer who submitted the contact / request form. */
export async function sendContactAck(name: string, email: string) {
  if (!isMailConfigured()) return;
  const { html, text } = renderEmail({
    heading: "We received your message",
    bodyHtml: `<p>Hi ${esc(name)}, thanks for reaching out to ${esc(BRAND.name)}.</p>
      <p>Your message landed safely — we read every note and will get back to you soon, usually within a day or two.</p>`,
  });
  try {
    await sendMail({
      to: email,
      subject: `We received your message — ${BRAND.name}`,
      html,
      text,
    });
  } catch (err) {
    console.error("[email] contact ack failed:", err);
  }
}

/** Heads-up to the shop owner that a new inquiry/request arrived (if ADMIN_EMAIL set). */
export async function notifyAdminOfContact(msg: {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}) {
  const to = process.env.ADMIN_EMAIL;
  if (!isMailConfigured() || !to) return;
  const { html, text } = renderEmail({
    heading: "New inquiry",
    bodyHtml: `<p><strong>${esc(msg.name)}</strong> &lt;${esc(msg.email)}&gt;</p>
      ${msg.subject ? `<p><em>${esc(msg.subject)}</em></p>` : ""}
      <p style="white-space:pre-wrap;">${esc(msg.message)}</p>
      <p style="font-size:12px;color:#978f81;">Reply to this email to respond directly.</p>`,
  });
  try {
    await sendMail({
      to,
      subject: `New inquiry from ${msg.name}`,
      html,
      text,
      replyTo: msg.email,
    });
  } catch (err) {
    console.error("[email] admin notify failed:", err);
  }
}

interface AnnounceProduct {
  name: string;
  slug: string;
  short_description?: string | null;
  images?: string[] | null;
}

/** "New in the shop" email featuring a product; returns the number sent. */
export async function sendProductAnnouncement(
  product: AnnounceProduct,
  recipients: { email: string; unsubscribe_token: string }[]
): Promise<number> {
  if (!isMailConfigured()) return 0;
  const base = appUrl();
  const subject = `New in the shop: ${product.name}`;
  const img = product.images?.[0];
  let sent = 0;
  for (const r of recipients) {
    const unsubscribeUrl = `${base}/api/newsletter/unsubscribe?token=${r.unsubscribe_token}`;
    const bodyHtml = `${
      img ? `<p><img src="${esc(img)}" alt="" style="max-width:100%;border-radius:12px;" /></p>` : ""
    }
      <p style="font-size:18px;color:#34302a;"><strong>${esc(product.name)}</strong></p>
      ${product.short_description ? `<p>${esc(product.short_description)}</p>` : ""}
      <p style="margin:20px 0;"><a href="${base}/products/${esc(product.slug)}" style="display:inline-block;background:#34302a;color:#f8f6f2;text-decoration:none;padding:12px 22px;border-radius:999px;font-size:14px;">See it in the shop</a></p>`;
    const { html, text } = renderEmail({ heading: "New in the shop", bodyHtml, unsubscribeUrl });
    try {
      await sendMail({
        to: r.email,
        subject,
        html,
        text,
        headers: listUnsubscribe(unsubscribeUrl),
      });
      sent++;
    } catch (err) {
      console.error("[email] announcement failed:", r.email, err);
    }
  }
  return sent;
}
