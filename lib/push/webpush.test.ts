import { describe, expect, it } from "vitest";
import { b64url, encryptPayload, fromB64url, generateVapidKeys, vapidHeader } from "./webpush";

const enc = new TextEncoder();

async function hmac(key: Uint8Array, data: Uint8Array) {
  const k = await crypto.subtle.importKey("raw", key as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, data as BufferSource));
}
const cat = (...p: Uint8Array[]) => {
  const o = new Uint8Array(p.reduce((n, x) => n + x.length, 0));
  let i = 0;
  for (const x of p) (o.set(x, i), (i += x.length));
  return o;
};

/** The browser side of RFC 8291: decrypt with the subscription's private key. */
async function decrypt(body: Uint8Array, ua: CryptoKeyPair, auth: Uint8Array) {
  const salt = body.slice(0, 16);
  const idlen = body[20];
  const asPublic = body.slice(21, 21 + idlen);
  const cipher = body.slice(21 + idlen);
  const uaPublic = new Uint8Array((await crypto.subtle.exportKey("raw", ua.publicKey)) as ArrayBuffer);
  const asKey = await crypto.subtle.importKey("raw", asPublic, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const shared = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: asKey }, ua.privateKey, 256));
  const ikm = (await hmac(await hmac(auth, shared), cat(enc.encode("WebPush: info\0"), uaPublic, asPublic, new Uint8Array([1])))).slice(0, 32);
  const prk = await hmac(salt, ikm);
  const cek = (await hmac(prk, cat(enc.encode("Content-Encoding: aes128gcm\0"), new Uint8Array([1])))).slice(0, 16);
  const nonce = (await hmac(prk, cat(enc.encode("Content-Encoding: nonce\0"), new Uint8Array([1])))).slice(0, 12);
  const key = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["decrypt"]);
  const plain = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce }, key, cipher));
  expect(plain[plain.length - 1]).toBe(2);
  return new TextDecoder().decode(plain.slice(0, -1));
}

describe("web push", () => {
  it("base64url round-trips", () => {
    const bytes = new Uint8Array([0, 255, 62, 63, 128, 7]);
    expect([...fromB64url(b64url(bytes))]).toEqual([...bytes]);
  });

  it("encrypts a payload the subscriber can decrypt (aes128gcm)", async () => {
    const ua = (await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"])) as CryptoKeyPair;
    const auth = crypto.getRandomValues(new Uint8Array(16));
    const sub = { endpoint: "https://push.example/x", keys: { p256dh: b64url((await crypto.subtle.exportKey("raw", ua.publicKey)) as ArrayBuffer), auth: b64url(auth) } };
    const message = JSON.stringify({ title: "Đơn hàng mới #12", body: "Nguyễn Văn A · 185.000 ₫", url: "/admin?view=orders&id=12" });
    const body = await encryptPayload(sub, message);
    expect(new DataView(body.buffer, body.byteOffset).getUint32(16)).toBe(4096);
    expect(body[20]).toBe(65);
    expect(await decrypt(body, ua, auth)).toBe(message);
  });

  it("signs a VAPID JWT for the push service origin", async () => {
    const keys = await generateVapidKeys();
    expect(fromB64url(keys.publicKey)).toHaveLength(65);
    const header = await vapidHeader("https://fcm.googleapis.com/fcm/send/abc", keys, "https://vsap.com.vn", Date.UTC(2026, 10, 27));
    const [, jwt, k] = header.match(/^vapid t=([^,]+), k=(.+)$/)!;
    expect(k).toBe(keys.publicKey);
    const [h, c, s] = jwt.split(".");
    expect(JSON.parse(new TextDecoder().decode(fromB64url(c)))).toMatchObject({ aud: "https://fcm.googleapis.com", sub: "https://vsap.com.vn" });
    const pub = await crypto.subtle.importKey("raw", fromB64url(keys.publicKey), { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    expect(await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pub, fromB64url(s), enc.encode(`${h}.${c}`))).toBe(true);
  });
});
