import { NextResponse, type NextRequest } from "next/server";
import { sessionUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/roles";
import { isLocale, LOCALE_COOKIE, preferredLocale } from "@/lib/locales";
import { isSitePublic } from "@/lib/cms/visibility";

/**
 * - / redirects to the visitor's language (saved choice, else device language); so does any other path
 *   without a locale prefix (/products → /vi/products, /typo → the localized 404).
 * - /admin and /api/admin need a valid admin session (except the login page/API).
 * - Public pages opened with ?__preview=1 by a signed-in editor render the draft:
 *   we pass that on as the x-vsap-preview request header, read by getContent().
 * - When the site is not public (Studio › Cài đặt › Hiển thị website), visitors get the
 *   "Coming soon" page with a 503; signed-in Studio accounts see the real site with a
 *   small notice (x-vsap-hidden request header, read by the [locale] layout).
 */
export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Language from the visitor's saved choice or their device (see preferredLocale).
  const head = pathname.split("/")[1] ?? "";
  if (!isLocale(head) && !["admin", "api", "media", "coming-soon"].includes(head)) {
    const lang = preferredLocale(req.headers.get("accept-language"), req.cookies.get(LOCALE_COOKIE)?.value);
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.redirect(url, 302);
    res.headers.set("Vary", "Accept-Language, Cookie");
    return res;
  }
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/");
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";

  // Never let a client forge the headers set below.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("x-vsap-preview");
  requestHeaders.delete("x-vsap-hidden");

  const wantsPreview = searchParams.has("__preview");
  // Website pages while the site is hidden: only Studio accounts get through.
  const hidden = isLocale(head) && !(await isSitePublic());
  const user = (isAdminArea && !isLogin) || wantsPreview || hidden ? await sessionUser(req.headers.get("cookie")) : null;
  // Route handlers check each permission; here we only need "signed in" and "may see drafts".
  const authed = Boolean(user);
  const canPreview = wantsPreview && can(user?.role, "content.read");

  if (isAdminArea && !isLogin && !authed) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (hidden && !authed) {
    // 503 + Retry-After tells search engines the pages are away for now, not gone.
    const url = req.nextUrl.clone();
    url.pathname = `/coming-soon/${head}`;
    url.search = "";
    const res = NextResponse.rewrite(url, { status: 503, request: { headers: requestHeaders } });
    res.headers.set("Retry-After", "86400");
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("Vary", "Cookie");
    return res;
  }

  if (canPreview) requestHeaders.set("x-vsap-preview", "1");
  if (hidden) requestHeaders.set("x-vsap-hidden", "1");
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (isAdminArea || canPreview || hidden) {
    res.headers.set("Cache-Control", "private, no-store");
    res.headers.set("X-Robots-Tag", "noindex");
  }
  return res;
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/vi",
    "/vi/:path*",
    "/en",
    "/en/:path*",
    "/zh",
    "/zh/:path*",
    "/ja",
    "/ja/:path*",
    "/ko",
    "/ko/:path*",
    // Locale-less page paths (to redirect them). Skips files (anything with a dot) and framework/dev internals.
    "/((?!(?:vi|en|zh|ja|ko|admin|api|media|coming-soon|_next|cdn-cgi|node_modules)(?:/|$)|@|__|.*\\.).*)",
  ],
};
