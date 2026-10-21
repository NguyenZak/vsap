// Studio sign-in. Two kinds of account:
// - the built-in owner "admin", whose password is the Worker secret ADMIN_PASSWORD
//   (always works, even with an empty database, so nobody can be locked out);
// - accounts created in Studio (cms_users), each with a role from lib/cms/roles.
// A session is an HMAC-signed cookie carrying the user id and a version number;
// bumping the version (or rotating ADMIN_PASSWORD for the owner) signs that user out.
import { env } from "cloudflare:workers";
import { b64url, constantTimeEqual, dummyVerify, verifyPassword } from "./password";
import { OWNER_USERNAME, type Role } from "./roles";
import { findUser, findUserByName, touchLogin } from "./users";

export const SESSION_COOKIE = "vsap_admin";
/** Session lifetime in seconds. */
export const SESSION_TTL = 60 * 60 * 24 * 7;

export type SessionUser = { id: string; username: string; name: string; role: Role; owner: boolean };

type Secrets = { ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string };
const secrets = () => env as unknown as Secrets;

const enc = new TextEncoder();
const OWNER_ID = "owner";

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

const owner = (): SessionUser => ({ id: OWNER_ID, username: OWNER_USERNAME, name: "Chủ sở hữu", role: "admin", owner: true });

/** Changes whenever ADMIN_PASSWORD does, so old owner sessions stop working after a rotation. */
async function ownerVersion() {
  return (await hmac("vsap-owner-version", secrets().ADMIN_PASSWORD ?? "")).slice(0, 12);
}

/** Constant-time owner password check (compares HMACs, never the raw strings). */
async function checkOwnerPassword(input: string) {
  const expected = secrets().ADMIN_PASSWORD;
  if (!expected) return false;
  const [a, b] = await Promise.all([hmac("pw", input), hmac("pw", expected)]);
  return constantTimeEqual(a, b);
}

/** The account for a username/password pair, or null. */
export async function login(username: string, password: string): Promise<{ user: SessionUser; version: string | number } | null> {
  const name = username.trim().toLowerCase() || OWNER_USERNAME;
  if (name === OWNER_USERNAME) return (await checkOwnerPassword(password)) ? { user: owner(), version: await ownerVersion() } : null;
  const row = await findUserByName(name);
  if (!row || row.disabled) {
    await dummyVerify(password);
    return null;
  }
  if (!(await verifyPassword(password, row.password))) return null;
  await touchLogin(row.id);
  return { user: { id: row.id, username: row.username, name: row.name, role: row.role, owner: false }, version: row.version };
}

export async function createSession(user: SessionUser, version: string | number) {
  const key = signingKey();
  if (!key) throw new Error("ADMIN_PASSWORD is not set");
  const payload = b64url(enc.encode(JSON.stringify({ uid: user.id, v: version, exp: Math.floor(Date.now() / 1000) + SESSION_TTL })));
  return `${payload}.${await hmac(key, payload)}`;
}

/** The signed-in user for a cookie header, after checking the account is still active. */
export async function sessionUser(cookieHeader: string | null): Promise<SessionUser | null> {
  const key = signingKey();
  const token = readCookie(cookieHeader);
  if (!key || !token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !constantTimeEqual(await hmac(key, payload), sig)) return null;
  let claims: { uid?: string; v?: string | number; exp?: number };
  try {
    claims = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
  if (!claims.uid || !claims.exp || claims.exp <= Date.now() / 1000) return null;
  if (claims.uid === OWNER_ID) return claims.v === (await ownerVersion()) ? owner() : null;
  try {
    const row = await findUser(claims.uid);
    if (!row || row.disabled || row.version !== claims.v) return null;
    return { id: row.id, username: row.username, name: row.name, role: row.role, owner: false };
  } catch {
    return null;
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
