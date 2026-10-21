// Password hashing for Studio accounts: PBKDF2-SHA256 with a random salt, via Web
// Crypto (works in Workers and Node). 100k iterations is the Workers maximum.
// Stored as "pbkdf2$<iterations>$<salt b64url>$<hash b64url>".

const ITERATIONS = 100_000;
const enc = new TextEncoder();

export function b64url(bytes: ArrayBuffer | Uint8Array) {
  const s = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0)) as Uint8Array<ArrayBuffer>;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

export function constantTimeEqual(a: Uint8Array | string, b: Uint8Array | string) {
  const x = typeof a === "string" ? enc.encode(a) : a;
  const y = typeof b === "string" ? enc.encode(b) : b;
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${b64url(salt)}$${b64url(await derive(password, salt, ITERATIONS))}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, iter, salt, hash] = stored.split("$");
  const iterations = Number(iter);
  if (scheme !== "pbkdf2" || !salt || !hash || !Number.isInteger(iterations) || iterations < 1 || iterations > ITERATIONS) return false;
  return constantTimeEqual(await derive(password, fromB64url(salt), iterations), fromB64url(hash));
}

/** Burn the same time as a real check, so unknown usernames can't be told apart by timing. */
export async function dummyVerify(password: string) {
  await derive(password, new Uint8Array(16), ITERATIONS);
  return false;
}

/** Readable random password for new accounts (no 0/O/1/l look-alikes). */
export function generatePassword(length = 14) {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  // Rejection sampling keeps every character equally likely.
  const limit = 256 - (256 % chars.length);
  let out = "";
  while (out.length < length) {
    for (const b of crypto.getRandomValues(new Uint8Array(length * 2))) {
      if (b < limit && out.length < length) out += chars[b % chars.length];
    }
  }
  return out;
}
