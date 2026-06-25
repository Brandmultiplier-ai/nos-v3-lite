import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "nos_auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and the auth API through without a cookie check.
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Gate everything else behind the auth cookie.
  const isAuthenticated = request.cookies.get(COOKIE_NAME)?.value === "1";
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // ── Existing slug redirects ──────────────────────────────────────────────
  if (pathname === "/content") {
    return NextResponse.redirect(new URL("/content/social", request.url));
  }
  if (pathname === "/outreach") {
    return NextResponse.redirect(new URL("/outreach/email", request.url));
  }
  if (pathname === "/search") {
    return NextResponse.redirect(new URL("/search/seo", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
