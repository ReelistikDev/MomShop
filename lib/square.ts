import { SquareClient, SquareEnvironment } from "square";

/**
 * SERVER-ONLY Square client. Never import into client components — it carries
 * the access token. Returns `null` until `SQUARE_ACCESS_TOKEN` is configured,
 * mirroring the Supabase helpers so the app builds without payment env.
 *
 * Defaults to the Production environment; set `SQUARE_ENVIRONMENT=sandbox` to
 * target Square Sandbox during development.
 */
let cached: SquareClient | null = null;

export function getSquareClient(): SquareClient | null {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) return null;
  if (!cached) {
    cached = new SquareClient({
      token,
      environment:
        process.env.SQUARE_ENVIRONMENT === "sandbox"
          ? SquareEnvironment.Sandbox
          : SquareEnvironment.Production,
    });
  }
  return cached;
}

/** The Square location to attribute orders/payments to. */
export function getSquareLocationId(): string {
  return process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
}

/** Absolute site URL (no trailing slash) for redirect + webhook URLs. */
export function getAppUrl(): string {
  return (process.env.APP_URL ?? "").replace(/\/$/, "");
}

/** Signature key for verifying incoming Square webhooks. */
export function getSquareWebhookSignatureKey(): string {
  return process.env.SQUARE_WEBHOOK_SIGNATURE_KEY ?? "";
}

/** True when Square checkout (payment links) can be created. */
export function isSquareConfigured(): boolean {
  return Boolean(process.env.SQUARE_ACCESS_TOKEN && getSquareLocationId());
}
