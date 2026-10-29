"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { useShop } from "./CartProvider";

const round = "grid size-9 place-items-center rounded-full text-white transition hover:opacity-85";

/** "Share:" row under the product gallery: Facebook, X, the phone's share sheet and copy link. */
export function ShareBar({ title }: { title: string }) {
  const { t } = useShop();
  const [url, setUrl] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(location.href.split("#")[0]);
    setCanShare(typeof navigator.share === "function");
  }, []);

  const enc = encodeURIComponent;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-ink-600">
      <span className="mr-1">{t.share}:</span>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${round} bg-[#1877f2]`}>
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3h-1.4c-2 0-2.7.8-2.7 2.7V12h3.9l-.7 3.7h-3.2V24C19.4 23.2 24 18.2 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z" />
        </svg>
      </a>
      <a href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer" aria-label="X" className={`${round} bg-black`}>
        <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden>
          <path d="M18.9 1.2h3.7l-8 9.2L24 22.8h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9Zm-1.3 19.4h2L6.5 3.2H4.3Z" />
        </svg>
      </a>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ title, url }).catch(() => {})} aria-label={t.share} className={`${round} bg-forest-600`}>
          <Share2 className="size-4" />
        </button>
      )}
      <button type="button" onClick={copy} aria-label={copied ? t.copied : t.copyLink} title={copied ? t.copied : t.copyLink} className={`${round} bg-ink-400`}>
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </button>
    </div>
  );
}
