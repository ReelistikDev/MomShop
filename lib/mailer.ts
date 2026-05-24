import { Resend } from "resend";
import { BRAND } from "./brand";

let cached: Resend | null = null;

/** True when a Resend API key is present. */
export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function client(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!cached) cached = new Resend(process.env.RESEND_API_KEY);
  return cached;
}

export function mailFrom(): string {
  // Must be a verified-domain sender in your Resend account. `onboarding@resend.dev`
  // works for testing but only delivers to your own account email.
  const addr = process.env.MAIL_FROM || "onboarding@resend.dev";
  return addr.includes("<") ? addr : `${BRAND.name} <${addr}>`;
}

/** Absolute base URL for links inside emails (no request context available). */
export function appUrl(): string {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

/** Wrap content in a warm, on-brand HTML email shell with an unsubscribe footer. */
export function renderEmail({
  heading,
  bodyHtml,
  unsubscribeUrl,
}: {
  heading: string;
  bodyHtml: string;
  unsubscribeUrl?: string;
}): { html: string; text: string } {
  const footer = unsubscribeUrl
    ? `<p style="margin:24px 0 0;font-size:12px;color:#978f81;">You're receiving this because you joined the ${BRAND.name} list. <a href="${unsubscribeUrl}" style="color:#687457;">Unsubscribe</a>.</p>`
    : "";
  const html = `<!doctype html><html><body style="margin:0;background:#f8f6f2;padding:32px 0;font-family:Helvetica,Arial,sans-serif;color:#34302a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fdfbf7;border:1px solid #e6e0d5;border-radius:16px;padding:32px;">
      <tr><td>
        <p style="margin:0 0 4px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#8b9a7b;">${BRAND.name}</p>
        <h1 style="margin:0 0 16px;font-size:24px;font-weight:500;color:#34302a;">${heading}</h1>
        <div style="font-size:15px;line-height:1.6;color:#6f685c;">${bodyHtml}</div>
        ${footer}
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
  const text = `${heading}\n\n${bodyHtml.replace(/<[^>]+>/g, "")}${
    unsubscribeUrl ? `\n\nUnsubscribe: ${unsubscribeUrl}` : ""
  }`;
  return { html, text };
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}) {
  const resend = client();
  if (!resend) throw new Error("Mail is not configured (RESEND_API_KEY missing)");
  const { data, error } = await resend.emails.send({
    from: mailFrom(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    headers: opts.headers,
  });
  if (error) throw new Error(error.message || "Resend send failed");
  return data;
}
