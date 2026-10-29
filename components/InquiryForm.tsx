"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import type { UiStrings } from "@/lib/cms/types";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "mt-1.5 block w-full rounded-xl border border-mist-200 bg-surface px-4 py-3 text-ink-900 placeholder:text-ink-400 outline-none transition focus:border-forest-600 focus:ring-4 focus:ring-sun-400/50";
const label = "text-sm font-medium text-ink-900";

export type ProductChoice = { value: string; label: string };

/** `products` are the CMS products (slug + name in this language); "other" is always offered last. */
export function InquiryForm({ t, products, defaultProduct }: { t: UiStrings["form"]; products: ProductChoice[]; defaultProduct?: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), locale: document.documentElement.lang, page: location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl bg-forest-900 p-10 text-center">
        <CheckCircle2 className="size-12 text-sun-400" />
        <p className="mt-4 text-lg font-medium text-white">{t.success}</p>
      </div>
    );
  }

  const req = <span className="text-chili-600" title={t.required}>*</span>;

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      {/* Honeypot: hidden from people, bots tend to fill it. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="block">
        <span className={label}>{t.name} {req}</span>
        <input name="name" required maxLength={120} autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className={label}>{t.company}</span>
        <input name="company" maxLength={160} autoComplete="organization" className={field} />
      </label>
      <label className="block">
        <span className={label}>{t.email} {req}</span>
        <input name="email" type="email" required maxLength={160} autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className={label}>{t.phone}</span>
        <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={field} />
      </label>
      <label className="block">
        <span className={label}>{t.country}</span>
        <input name="country" maxLength={80} autoComplete="country-name" className={field} />
      </label>
      <label className="block">
        <span className={label}>{t.product}</span>
        <select
          name="product"
          defaultValue={products.some((p) => p.value === defaultProduct) ? defaultProduct : (products[0]?.value ?? "other")}
          className={field}
        >
          {products.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
          <option value="other">{t.productOptions.other}</option>
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>{t.quantity}</span>
        <input name="quantity" maxLength={120} placeholder={t.quantityPlaceholder} className={field} />
      </label>
      <label className="block sm:col-span-2">
        <span className={label}>{t.message} {req}</span>
        <textarea name="message" required rows={5} maxLength={4000} placeholder={t.messagePlaceholder} className={field} />
      </label>

      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun-400 px-6 py-3 text-sm font-medium text-forest-950 transition hover:bg-sun-500 disabled:opacity-60"
        >
          {status === "sending" ? t.sending : t.submit}
          {status === "sending" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </button>
        {status === "error" && (
          <p role="alert" className="text-sm text-chili-600">
            {t.error}
          </p>
        )}
      </div>
    </form>
  );
}
