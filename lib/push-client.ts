// Browser side of push notifications, shared by the website opt-ins and Studio.
// Registers /sw.js, asks for permission only after a click, and hands the
// subscription to the server.

export type PushSupport = "ok" | "unsupported" | "ios-install" | "denied";

const isIos = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const standalone = () => window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** Whether this browser can get push now; iPhones need the site added to the Home Screen first. */
export function pushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  const apis = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (!apis) return isIos() && !standalone() ? "ios-install" : "unsupported";
  if (Notification.permission === "denied") return "denied";
  return "ok";
}

async function registration() {
  const existing = await navigator.serviceWorker.getRegistration("/");
  const reg = existing ?? (await navigator.serviceWorker.register("/sw.js", { scope: "/" }));
  await navigator.serviceWorker.ready;
  return reg;
}

/** This browser's subscription, if it has one (does not prompt). */
export async function currentSubscription() {
  if (pushSupport() !== "ok") return null;
  const reg = await navigator.serviceWorker.getRegistration("/");
  return (await reg?.pushManager.getSubscription()) ?? null;
}

function keyBytes(b64: string) {
  const bin = atob(b64.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((b64.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

/** Ask permission (must run from a click) and subscribe; null when the visitor says no. */
export async function subscribe(): Promise<PushSubscriptionJSON | null> {
  if (Notification.permission !== "granted" && (await Notification.requestPermission()) !== "granted") return null;
  const reg = await registration();
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const { publicKey } = (await (await fetch("/api/push")).json()) as { publicKey: string };
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(publicKey) });
  }
  return sub.toJSON();
}
