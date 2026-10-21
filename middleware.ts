import { NextResponse, type NextRequest } from "next/server";
import { readCookie, verifySession } from "@/lib/cms/auth";

/**
 * - /admin and /api/admin need a valid admin session (except the login page/API).
 * - Public pages opened with ?__preview=1 by a signed-in admin render the draft:
 *   we pass that on as the x-vsap-preview request header, read by getContent().
 */
export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin/");
  const isLogin = pathname === "/admin/login" || pathname === "/api/admin/login";

  // Never let a client forge the preview header.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.delete("x-vsap-preview");

  const wantsPreview = searchParams.has("__preview");
  const authed = (isAdminArea && !isLogin) || wantsPreview ? await verifySession(readCookie(req.headers.get("cookie"))) : false;

  if (isAdminArea && !isLogin && !authed) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  if (wantsPreview && authed) requestHeaders.set("x-vsap-preview", "1");
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (isAdminArea || (wantsPreview && authed)) {
    res.headers.set("Cache-Control", "private, no-store");
    res.headers.set("X-Robots-Tag", "noindex");
  }
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*", "/vi", "/vi/:path*", "/en", "/en/:path*"],
};
