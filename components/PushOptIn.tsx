"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, X } from "lucide-react";
import type { UiStrings } from "@/lib/cms/types";
import { currentSubscription, pushSupport, subscribe, type PushSupport } from "@/lib/push-client";

type T = UiStrings["push"];

async function post(body: object) {
  const res = await fetch("/api/push", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const data = (await res.json()) as { topics?: string[]; error?: string };
  if (!res.ok) throw new Error(data.error || String(res.status));
  return data.topics ?? [];
}

/** Footer link that opens a small card to turn news + offer notifications on or off. */
export function PushOptIn({ t, locale }: { t: T; locale: string }) {
  const [open, setOpen] = useState(false);
  const [support, setSupport] = useState<PushSupport>("unsupported");
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSupport(pushSupport());
    currentSubscription()
      .then((sub) => (sub ? post({ action: "status", endpoint: sub.endpoint }) : []))
      .then((topics) => setOn(topics.includes("news")))
      .catch(() => {});
  }, []);

  const toggle = async () => {
    setBusy(true);
    setError("");
    try {
      if (on) {
        const sub = await currentSubscription();
        if (sub) await post({ action: "unsubscribe", subscription: sub.toJSON(), locale });
        setOn(false);
      } else {
        const sub = await subscribe();
        if (!sub) {
          setSupport(pushSupport());
          return;
        }
        const topics = await post({ action: "subscribe", subscription: sub, topics: ["news", "broadcast"], locale });
        setOn(topics.includes("news"));
      }
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  };

  const note = support === "ios-install" ? t.iosHint : support === "denied" ? t.blocked : support === "unsupported" ? t.unsupported : on ? t.enabled : "";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-white/80 transition hover:text-sun-400">
        {on ? <BellRing className="size-4" /> : <Bell className="size-4" />}
        {t.optIn}
      </button>
      {open && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-4 sm:items-center" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label={t.optInTitle} className="w-full max-w-sm rounded-3xl bg-surface p-6 text-ink-900 shadow-2xl">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-forest-900 text-white">
                <BellRing className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="heading text-lg text-heading">{t.optInTitle}</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-600">{t.optInBody}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="-mt-1 -mr-1 rounded-full p-1.5 text-ink-600 hover:bg-mist-100">
                <X className="size-5" />
              </button>
            </div>
            {note && <p className="mt-4 rounded-xl bg-mist-50 px-4 py-3 text-sm leading-relaxed text-ink-600">{note}</p>}
            {error && <p className="mt-3 text-sm text-chili-600">{error}</p>}
            {(support === "ok" || on) && (
              <button
                type="button"
                onClick={toggle}
                disabled={busy}
                className={`mt-5 w-full rounded-full px-5 py-3 text-sm font-medium transition disabled:opacity-60 ${on ? "border border-mist-200 text-ink-900 hover:bg-mist-50" : "bg-forest-900 text-white hover:bg-forest-800"}`}
              >
                {on ? t.disable : t.enable}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/** After checkout: offer updates about this one order. Hidden where push can't work at all. */
export function OrderPushOptIn({ t, locale, id, token }: { t: T; locale: string; id: number; token: string }) {
  const [support, setSupport] = useState<PushSupport>("unsupported");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setSupport(pushSupport()), []);

  if (support === "unsupported") return null;
  if (done) return <p className="mt-6 inline-flex items-center gap-2 text-sm text-forest-600"><BellRing className="size-4" /> {t.orderOptedIn}</p>;
  if (support !== "ok") return <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-ink-400">{support === "denied" ? t.blocked : t.iosHint}</p>;

  const go = async () => {
    setBusy(true);
    setError("");
    try {
      const sub = await subscribe();
      if (!sub) return setSupport(pushSupport());
      await post({ action: "subscribe", subscription: sub, order: { id, token }, locale });
      setDone(true);
    } catch {
      setError(t.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-6">
      <button type="button" onClick={go} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-forest-900/30 px-5 py-2.5 text-sm font-medium text-heading transition hover:bg-surface disabled:opacity-60">
        <Bell className="size-4" /> {t.orderOptIn}
      </button>
      {error && <p className="mt-2 text-sm text-chili-600">{error}</p>}
    </div>
  );
}
