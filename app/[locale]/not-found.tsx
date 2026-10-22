import type { Metadata } from "next";
import { ErrorScreen } from "@/components/ErrorScreen";
import { isLocale } from "@/lib/locales";

// vinext resolves this boundary's metadata with the matched params, and already adds robots noindex.
export async function generateMetadata({ params }: { params?: Promise<{ locale?: string }> }): Promise<Metadata> {
  const locale = (await params)?.locale ?? "";
  if (!isLocale(locale)) return { title: "Không tìm thấy trang · Page not found" };
  return { title: { vi: "Không tìm thấy trang", en: "Page not found", zh: "页面未找到", ja: "ページが見つかりません", ko: "페이지를 찾을 수 없습니다" }[locale] };
}

export default function NotFound() {
  return <ErrorScreen kind="404" />;
}
