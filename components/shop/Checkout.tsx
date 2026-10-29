"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, ShoppingBag, Trash2, Wallet } from "lucide-react";
import { formatPrice } from "@/lib/shop";
import type { Province } from "@/lib/vn-admin";
import { useShop } from "./CartProvider";
import { QtyStepper } from "./Dialog";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; id: number | null } | { kind: "error"; message: string };

const input =
  "mt-1.5 w-full rounded-xl border border-mist-200 bg-surface px-4 py-3 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/15";

/** Cart review and delivery form; the order is priced again on the server. */
type PolicyLink = { href: string; label: string } | null;

export function Checkout({ terms, privacy }: { terms: PolicyLink; privacy: PolicyLink }) {
  const { t, locale, priced, subtotal, setQty, remove, clear, ready } = useShop();
  const [state, setState] = useState<State>({ kind: "idle" });

  if (state.kind === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-mist-50 p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-12 text-forest-600" />
        <h2 className="heading mt-5 text-3xl text-heading">{t.successTitle}</h2>
        <p className="mt-3 text-ink-600">{t.successBody.replace("{id}", state.id ? String(state.id) : "")}</p>
        <Link href={`/${locale}/products`} className="mt-8 inline-flex rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-forest-800">
          {t.continueShopping}
        </Link>
      </div>
    );
  }

  if (!ready) return <div className="h-64" />;

  if (priced.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl bg-mist-50 p-10 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-surface text-forest-600">
          <ShoppingBag className="size-7" />
        </span>
        <p className="text-ink-600">{t.cartEmpty}</p>
        <Link href={`/${locale}/products`} className="rounded-full bg-forest-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-forest-800">
          {t.continueShopping}
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const field = (k: string) => String(form.get(k) ?? "").trim();
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: field("name"),
            phone: field("phone"),
            email: field("email"),
            province: field("province"),
            ward: field("ward"),
            street: field("street"),
            note: field("note"),
          },
          items: priced.map((p) => ({ id: p.line.id, qty: p.qty })),
          locale,
          page: location.pathname,
          website: field("website"),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: number | null };
      if (!res.ok || !data.ok) throw new Error();
      clear();
      setState({ kind: "done", id: data.id ?? null });
      window.scrollTo({ top: 0 });
    } catch {
      setState({ kind: "error", message: t.error });
    }
  }

  const sending = state.kind === "sending";

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <form onSubmit={submit} className="order-2 lg:order-1 lg:col-span-7">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm text-ink-600">
            {t.name} <span className="text-chili-600">*</span>
            <input name="name" required maxLength={120} autoComplete="name" className={input} />
          </label>
          <label className="block text-sm text-ink-600">
            {t.phone} <span className="text-chili-600">*</span>
            <input name="phone" type="tel" required maxLength={40} pattern="[0-9+ ().-]{8,}" autoComplete="tel" inputMode="tel" className={input} />
          </label>
          <label className="block text-sm text-ink-600 sm:col-span-2">
            {t.email}
            <input name="email" type="email" maxLength={160} autoComplete="email" className={input} />
          </label>
          <AddressFields />
          <label className="block text-sm text-ink-600 sm:col-span-2">
            {t.note}
            <textarea name="note" maxLength={2000} rows={3} placeholder={t.notePlaceholder} className={input} />
          </label>
          {/* Honeypot: hidden from people, filled in by bots. */}
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
        </div>

        <p className="mt-6 flex items-center gap-3 rounded-2xl bg-mist-50 px-4 py-3 text-sm text-ink-900">
          <Wallet className="size-5 shrink-0 text-forest-600" />
          <span>
            {t.payment} <span className="text-ink-600">{t.shippingNote}</span>
          </span>
        </p>

        {terms && privacy && (
          <p className="mt-4 text-xs leading-relaxed text-ink-600">
            {t.agree.split(/(\{terms\}|\{privacy\})/).map((part, i) => {
              const link = part === "{terms}" ? terms : part === "{privacy}" ? privacy : null;
              return link ? (
                <Link key={i} href={link.href} target="_blank" className="font-medium text-heading underline underline-offset-2 hover:text-forest-600">
                  {link.label}
                </Link>
              ) : (
                part
              );
            })}
          </p>
        )}

        {state.kind === "error" && (
          <p role="alert" className="mt-4 rounded-xl bg-chili-600/10 px-4 py-3 text-sm text-chili-600">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-6 w-full rounded-full bg-sun-400 px-6 py-4 font-medium text-forest-950 transition hover:bg-sun-500 disabled:opacity-60 sm:w-auto sm:min-w-64"
        >
          {sending ? t.placing : `${t.placeOrder} · ${formatPrice(subtotal, locale)}`}
        </button>
      </form>

      <aside className="order-1 lg:order-2 lg:col-span-5">
        <div className="rounded-3xl bg-mist-50 p-5 sm:p-6 lg:sticky lg:top-28">
          <h2 className="heading text-2xl text-heading">{t.yourOrder}</h2>
          <ul className="mt-4 divide-y divide-mist-200">
            {priced.map(({ line, item, price, qty }) => (
              <li key={line.id} className="flex gap-3 py-4">
                <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  {item.images[0] && <img src={item.images[0]} alt="" className="size-full object-contain p-1" />}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={item.href} className="block text-sm font-medium text-ink-900 hover:text-forest-600">
                    {item.name}
                  </Link>
                  <p className="text-xs text-ink-600">{item.flavor}</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <QtyStepper size="sm" value={qty} onChange={(n) => setQty(line.id, n)} labels={t} />
                    <span className="text-sm font-medium tabular-nums">{formatPrice(price * qty, locale)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(line.id)}
                  aria-label={`${t.remove} ${item.name}`}
                  className="grid size-8 shrink-0 place-items-center self-start rounded-full text-ink-400 transition hover:bg-surface hover:text-chili-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between border-t border-mist-200 pt-4">
            <span className="text-sm text-ink-600">{t.subtotal}</span>
            <span className="text-2xl font-medium tabular-nums text-heading">{formatPrice(subtotal, locale)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

/**
 * Delivery address on Vietnam's post-2025 two-level map: province → ward/commune
 * (lists in lib/vn-admin, loaded only on this page), then house number and street.
 */
function AddressFields() {
  const { t } = useShop();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");

  useEffect(() => {
    let live = true;
    import("@/lib/vn-admin").then((m) => live && setProvinces(m.provinces));
    return () => {
      live = false;
    };
  }, []);

  const wards = provinces.find(([name]) => name === province)?.[1] ?? [];
  const req = <span className="text-chili-600">*</span>;

  return (
    <fieldset className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
      <legend className="mb-3 text-sm font-medium text-ink-900">{t.address}</legend>
      <label className="block text-sm text-ink-600">
        {t.province} {req}
        <select
          name="province"
          required
          value={province}
          onChange={(e) => {
            setProvince(e.target.value);
            setWard("");
          }}
          autoComplete="address-level1"
          className={input}
        >
          <option value="">{t.selectProvince}</option>
          {provinces.map(([name]) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink-600">
        {t.ward} {req}
        <select name="ward" required value={ward} onChange={(e) => setWard(e.target.value)} disabled={!province} autoComplete="address-level2" className={`${input} disabled:opacity-60`}>
          <option value="">{t.selectWard}</option>
          {wards.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-ink-600 sm:col-span-2">
        {t.street} {req}
        <input name="street" required maxLength={200} placeholder={t.streetPlaceholder} autoComplete="address-line1" className={input} />
      </label>
    </fieldset>
  );
}
