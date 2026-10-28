// The header menu as the site renders it: Studio's menu entries with labels in the
// visitor's language, site links prefixed with the locale, and automatic sub-menus
// filled from the product groups or news categories (pure, unit-testable).
import type { Locale } from "../locales";
import { localHref, pick } from "./links";
import type { MenuLink, SiteContent } from "./types";

export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children: NavLink[]; wide: boolean };

export function resolveMenu(content: Pick<SiteContent, "menu" | "products" | "categories">, locale: Locale): NavItem[] {
  const link = (l: MenuLink): NavLink => ({ label: pick(l.label, locale), href: localHref(l.href || "/", locale) });
  return content.menu
    .map((item) => {
      const auto: NavLink[] =
        item.auto === "productGroups"
          ? content.products.map((p) => ({ label: pick(p.name, locale), href: localHref(`/products/${p.slug}`, locale) }))
          : item.auto === "newsCategories"
            ? content.categories.map((c) => ({ label: pick(c.name, locale), href: localHref(`/${c.slug}`, locale) }))
            : [];
      return { ...link(item), children: [...auto, ...item.children.map(link)].filter((c) => c.label), wide: item.wide };
    })
    .filter((item) => item.label);
}
