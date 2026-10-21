"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Mail, Phone, RotateCw } from "lucide-react";
import { defaultLocale, isLocale, type Locale } from "@/lib/locales";
import { site } from "@/lib/site";
import { Button, Tag } from "./ui";

/*
 * Shared look for not-found.tsx, error.tsx and global-error.tsx. The copy is
 * hard-coded on purpose: these pages must still render when the CMS (D1) is the
 * thing that failed. not-found/error get no route params, so the language comes
 * from the URL.
 */

type Kind = "404" | "500";

const copy = {
  vi: {
    "404": {
      tag: "Lỗi 404",
      title: "Bạn đã đi lạc",
      accent: "giữa vườn điều",
      body: "Trang bạn tìm không tồn tại, đã đổi địa chỉ hoặc tạm được gỡ xuống. Hãy quay về trang chủ hoặc chọn một lối đi bên dưới.",
    },
    "500": {
      tag: "Lỗi 500",
      title: "Dây chuyền",
      accent: "đang tạm dừng",
      body: "Hệ thống gặp lỗi ngoài ý muốn khi tải trang này — lỗi từ phía chúng tôi, không phải do bạn. Hãy thử lại sau giây lát; nếu vẫn lỗi, liên hệ VSAP kèm mã lỗi bên dưới.",
    },
    home: "Về trang chủ",
    back: "Quay lại",
    retry: "Thử lại",
    digest: "Mã lỗi",
    linksTitle: "Có thể bạn đang tìm",
    help: "Cần hỗ trợ ngay?",
    links: [
      { path: "/products", label: "Sản phẩm", note: "Nhân điều, macca và dòng bán lẻ" },
      { path: "/quality", label: "Chất lượng", note: "Quy trình, tiêu chuẩn và chứng nhận" },
      { path: "/news", label: "Tin tức", note: "Thị trường và hoạt động VSAP" },
      { path: "/contact", label: "Liên hệ", note: "Báo giá và hợp tác xuất khẩu" },
    ],
  },
  en: {
    "404": {
      tag: "Error 404",
      title: "You’ve wandered",
      accent: "off the orchard path",
      body: "The page you’re looking for doesn’t exist, has moved or was taken down. Head back home or pick a path below.",
    },
    "500": {
      tag: "Error 500",
      title: "The line has",
      accent: "briefly stopped",
      body: "Something went wrong on our side while loading this page — it’s not you. Please try again in a moment; if it keeps happening, contact VSAP with the error ID below.",
    },
    home: "Back to home",
    back: "Go back",
    retry: "Try again",
    digest: "Error ID",
    linksTitle: "You might be looking for",
    help: "Need help right away?",
    links: [
      { path: "/products", label: "Products", note: "Cashew kernels, macadamia and retail packs" },
      { path: "/quality", label: "Quality", note: "Process, standards and certifications" },
      { path: "/news", label: "News", note: "Market updates and VSAP stories" },
      { path: "/contact", label: "Contact", note: "Quotes and export partnerships" },
    ],
  },
} as const;

// Each "0" in the code is drawn as a round nut photo.
const zeros = ["/images/macadamia.webp", "/images/cashew.webp"];

function Digits({ code }: { code: Kind }) {
  let zero = 0;
  return (
    <p
      aria-hidden
      className="accent flex items-center pr-[0.06em] text-[clamp(7.5rem,24vw,19rem)] leading-[0.8] tracking-[-0.04em] text-lime-300 select-none"
    >
      {code.split("").map((ch, i) =>
        ch === "0" ? (
          <span
            key={i}
            className="relative mx-[0.04em] inline-block size-[0.74em] shrink-0 overflow-hidden rounded-full ring-[0.025em] ring-lime-300/80 ring-offset-[0.03em] ring-offset-forest-950"
          >
            <img
              src={zeros[zero++ % zeros.length]}
              alt=""
              className="size-full scale-125 object-cover motion-safe:animate-[spin_48s_linear_infinite]"
            />
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </p>
  );
}

export function ErrorScreen({
  kind,
  reset,
  digest,
  standalone = false,
}: {
  kind: Kind;
  /** error.tsx's reset(): re-renders the segment. vinext doesn't pass it on the server render, so "retry" falls back to a reload. */
  reset?: () => void;
  digest?: string;
  /** global-error renders without the site header, so it brings its own logo. */
  standalone?: boolean;
}) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const first = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(first) ? first : defaultLocale;
  const t = copy[locale];
  const c = t[kind];
  const home = `/${locale}`;
  // Only the in-layout pages animate in via MotionMain; global-error has no MotionMain.
  const intro = standalone ? {} : { "data-intro": "" };

  const ghost =
    "group inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10";

  return (
    <>
      <section className="relative isolate overflow-hidden bg-forest-950 text-white">
        <img
          src="/images/highlands.webp"
          alt=""
          className="absolute inset-0 -z-20 size-full object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-forest-950/60 via-forest-950/70 to-forest-950" />

        <div className="container-page flex min-h-[88svh] flex-col justify-center pt-28 pb-16 sm:pb-20 lg:pt-32">
          {standalone && (
            <Link href={home} className="absolute top-5 -ml-2" aria-label="VSAP">
              <img src="/logo-light.svg" alt="VSAP – Good Food – Good Health" width={136} height={68} className="h-12 w-auto" />
            </Link>
          )}

          <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-8">
            <div className="lg:order-2 lg:col-span-6 lg:flex lg:justify-end" {...intro}>
              <Digits code={kind} />
            </div>

            <div className="lg:col-span-6" {...intro}>
              <Tag tone="glass">{c.tag}</Tag>
              <h1 className="heading mt-5 text-4xl sm:text-5xl lg:text-6xl">
                {c.title}
                <span className="accent block text-[1.1em] leading-[1] text-white/85">{c.accent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{c.body}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                {kind === "500" ? (
                  <button
                    type="button"
                    onClick={reset ?? (() => window.location.reload())}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-lime-300 px-5 py-3 text-sm font-medium text-forest-950 transition hover:bg-lime-400"
                  >
                    <RotateCw className="size-4 transition-transform duration-500 group-hover:rotate-180" />
                    {t.retry}
                  </button>
                ) : (
                  <Button href={home}>{t.home}</Button>
                )}
                {kind === "500" ? (
                  <Link href={home} className={ghost}>
                    {t.home}
                  </Link>
                ) : (
                  <button
                    type="button"
                    // Opened straight from a link or typed URL: there is no page to go back to.
                    onClick={() => (window.history.length > 1 ? router.back() : router.push(home))}
                    className={ghost}
                  >
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
                    {t.back}
                  </button>
                )}
              </div>

              {digest && (
                <p className="mt-6 text-xs text-white/55">
                  {t.digest}: <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-white/80 select-all">{digest}</code>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist-50">
        <div className="container-page grid gap-10 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 className="heading text-2xl sm:text-3xl">{t.linksTitle}</h2>
            <p className="mt-6 text-xs font-medium tracking-[0.18em] text-ink-400 uppercase">{t.help}</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`tel:${site.phoneE164}`} className="inline-flex items-center gap-2 text-ink-900 transition hover:text-forest-600">
                  <Phone className="size-4 text-forest-600" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-ink-900 transition hover:text-forest-600">
                  <Mail className="size-4 text-forest-600" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
            {t.links.map((l) => (
              <li key={l.path}>
                <Link
                  href={`${home}${l.path}`}
                  className="group flex h-full items-start justify-between gap-4 rounded-2xl bg-white p-5 ring-1 ring-mist-200 transition hover:-translate-y-0.5 hover:ring-forest-600/40 sm:p-6"
                >
                  <span>
                    <span className="block text-base font-medium text-ink-900">{l.label}</span>
                    <span className="mt-1 block text-sm text-ink-600">{l.note}</span>
                  </span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist-100 text-forest-900 transition group-hover:bg-lime-300">
                    <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
