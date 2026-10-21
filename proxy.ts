import { NextResponse, type NextRequest } from "next/server";
import { sessionUser } from "@/lib/cms/auth";
import { can } from "@/lib/cms/roles";
import { isLocale } from "@/lib/locales";

/**
 * - / redirects to /vi or /en by the browser's language; so does any other path
 *   without a locale prefix (/products → /vi/products, /typo → the localized 404).
 * - /admin and /api/admin need a valid admin session (except the login page/API).
 * - Public pages opened with ?__preview=1 by a signed-in editor render the draft:
 *   we pass that on as the x-vsap-preview request header, read by getContent().
 */
export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Pick the visitor's language: Vietnamese (or no preference, e.g. crawlers) → /vi, anything else → /en.
  const head = pathname.split("/")[1] ?? "";
  if (!isLocale(head) && !["admin", "api", "media"].includes(head)) {
    const accept = (req.headers.get("accept-language") ?? "").toLowerCase();
    const first = accept.split(",")[0]?.trim() ?? "";
    const url = req.nextUrl.clone();
    url.pathname = (!first || first.startsWith("vi") || first === "*" ? "/vi" : "/en") + (pathname === "/" ? "" : pathname);
    const res = NextResponse.redirect(url, 302);
    res.headers.set("Vary", "Accept-Language");
    return res;
  }
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/");
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";

  // Never let a client forge the preview header.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("x-vsap-preview");

  const wantsPreview = searchParams.has("__preview");
  const user = (isAdminArea && !isLogin) || wantsPreview ? await sessionUser(req.headers.get("cookie")) : null;
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

  if (canPreview) requestHeaders.set("x-vsap-preview", "1");
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (isAdminArea || canPreview) {
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
    // Locale-less page paths (to redirect them). Skips files (anything with a dot) and framework/dev internals.
    "/((?!(?:vi|en|admin|api|media|_next|cdn-cgi|node_modules)(?:/|$)|@|__|.*\\.).*)",
  ],
};
