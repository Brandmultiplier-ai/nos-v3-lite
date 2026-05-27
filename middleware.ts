import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/content") {
    return NextResponse.redirect(new URL("/content/social", request.url));
  }
  if (pathname === "/outreach") {
    return NextResponse.redirect(new URL("/outreach/email", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/content", "/outreach"],
};
