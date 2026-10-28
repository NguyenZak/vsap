import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPage, categoryMetadata } from "@/components/CategoryPage";
import { PostPage, postMetadata } from "@/components/PostPage";
import { metadataLocale, resolveLocale } from "@/lib/i18n";

// News categories added in Studio live at /{category} and /{category}/{post}
// (news and health have their own routes). Any other unknown path renders
// [locale]/not-found.tsx inside the site layout.

type Props = { params: Promise<{ locale: string; rest: string[] }> };

export const dynamicParams = true;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, rest } = await params;
  const locale = metadataLocale(raw);
  if (rest.length === 1) return categoryMetadata(rest[0], locale);
  if (rest.length === 2) return postMetadata(Promise.resolve({ locale, slug: rest[1] }));
  return {};
}

export default async function CatchAll({ params }: Props) {
  const { locale: raw, rest } = await params;
  const locale = resolveLocale(raw);
  if (rest.length === 1) return <CategoryPage slug={rest[0]} locale={locale} />;
  if (rest.length === 2) return <PostPage params={Promise.resolve({ locale, slug: rest[1] })} channel={rest[0]} />;
  notFound();
}
