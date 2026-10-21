// Admin session: a single password (Worker secret ADMIN_PASSWORD) exchanged for an
// HMAC-signed cookie. No user table to manage; rotate the password to sign
// everyone out (the signing key is derived from it unless ADMIN_SESSION_SECRET is set).
import { env } from "cloudflare:workers";

export const SESSION_COOKIE = "vsap_admin";
/** Session lifetime in seconds. */
export const SESSION_TTL = 60 * 60 * 24 * 7;

type Secrets = { ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string };
const secrets = () => env as unknown as Secrets;

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const s = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(key: string, data: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(await crypto.subtle.sign("HMAC", k, enc.encode(data)));
}

function signingKey() {
  const { ADMIN_SESSION_SECRET, ADMIN_PASSWORD } = secrets();
  const base = ADMIN_SESSION_SECRET || ADMIN_PASSWORD;
  return base ? `vsap-session:${base}` : null;
}

export const adminConfigured = () => Boolean(secrets().ADMIN_PASSWORD);

/** Constant-time password check (compares HMACs, never the raw strings). */
export async function checkPassword(input: string) {
  const expected = secrets().ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([hmac("pw", input), hmac("pw", expected)]);
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.min(a.length, b.length); i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSession() {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const payload = b64url(enc.encode(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_TTL })));
  return `${payload}.${await hmac(key, payload)}`;
}

export async function verifySession(token: string | undefined | null) {
  const key = signingKey();
  if (!key || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || (await hmac(key, payload)) !== sig) return false;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp: number };
    return exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function sessionCookie(value: string, secure: boolean, maxAge = SESSION_TTL) {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

export function readCookie(header: string | null, name = SESSION_COOKIE) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}
