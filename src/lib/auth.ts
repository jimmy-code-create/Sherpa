import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SECRET = process.env.SHERPA_SESSION_SECRET ?? "sherpa-dev-secret-do-not-use-in-production";
export const SESSION_COOKIE = "sherpa_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  iat: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function signSession(payload: SessionPayload): string {
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", SECRET).update(body).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export { passwordStrength, isValidEmail } from "./password";
export type { PasswordStrength } from "./password";

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function safeNext(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/app";
  return next;
}
