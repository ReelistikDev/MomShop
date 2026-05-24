import { SignJWT, jwtVerify } from "jose";

/** httpOnly session cookie name. */
export const ADMIN_COOKIE = "ww_admin";
const ALG = "HS256";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function secretKey(): Uint8Array | null {
  const s = process.env.ADMIN_JWT_SECRET;
  return s ? new TextEncoder().encode(s) : null;
}

/** Sign a short admin session token. Throws if the secret isn't configured. */
export async function createSessionToken(): Promise<string> {
  const key = secretKey();
  if (!key) throw new Error("ADMIN_JWT_SECRET is not set");
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(key);
}

/** Verify a session token. Safe (never throws) — returns false on any problem. */
export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const key = secretKey();
  if (!key) return false;
  try {
    await jwtVerify(token, key, { algorithms: [ALG] });
    return true;
  } catch {
    return false;
  }
}

/** Constant-time-ish comparison of the submitted password to the env value. */
export function verifyPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string" || input.length !== expected.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export const SESSION_MAX_AGE = MAX_AGE_SECONDS;

/** True when admin login can function (password + secret configured). */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_JWT_SECRET);
}
