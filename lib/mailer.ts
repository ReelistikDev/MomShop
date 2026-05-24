import nodemailer, { type Transporter } from "nodemailer";
import { BRAND } from "./brand";

let cached: Transporter | null = null;

/** True when SMTP creds are present (your own mailbox). */
export function isMailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
}

export function getMailer(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (!cached) {
    const port = Number(process.env.SMTP_PORT || 587);
    cached = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return cached;
}

export function mailFrom(): string {
  const addr = process.env.MAIL_FROM || process.env.SMTP_USER || "";
  // Friendly "Brand <addr>" form when only a bare address is given.
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
  const t = getMailer();
  if (!t) throw new Error("Mail is not configured");
  return t.sendMail({
    from: mailFrom(),
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    headers: opts.headers,
  });
}
