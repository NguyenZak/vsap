import { notFound } from "next/navigation";

// Any unknown path under /vi or /en: render [locale]/not-found.tsx inside the site layout.
export default function CatchAll(): never {
  notFound();
}
