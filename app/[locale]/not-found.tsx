import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// not-found.tsx gets no route params, so the page speaks both site languages.
const links = [
  { href: "/vi", vi: "Trang chủ", en: "Home" },
  { href: "/vi/products", vi: "Sản phẩm", en: "Products" },
  { href: "/vi/contact", vi: "Liên hệ", en: "Contact" },
];

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-forest-950 pt-28 pb-16 text-white">
      <img src="/images/highlands.webp" alt="" className="absolute inset-0 -z-10 size-full object-cover opacity-25" />
      <div className="container-page">
        <p className="accent text-[7rem] leading-none text-lime-300 sm:text-[10rem]">404</p>
        <h1 className="heading mt-4 text-4xl sm:text-5xl">
          Không tìm thấy trang
          <span className="accent block text-[1.05em] text-white/80">Page not found</span>
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
          Trang bạn tìm có thể đã được đổi tên hoặc không còn tồn tại. · The page you are looking for may have moved or no longer exists.
        </p>
        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm backdrop-blur-md transition hover:bg-lime-300 hover:text-forest-950">
                {l.vi} · {l.en}
                <ArrowUpRight className="size-4 transition group-hover:rotate-45" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
