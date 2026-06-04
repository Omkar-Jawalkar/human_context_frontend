import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { TOKEN_COOKIE_NAME } from "@/lib/auth/token";

const PUBLIC_PATHS = ["/", "/login", "/register"];

const AUTH_ENTRY_PATHS = ["/login", "/register"];

function matchesPath(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => matchesPath(pathname, path));
}

function isAuthEntryPath(pathname: string): boolean {
  return AUTH_ENTRY_PATHS.some((path) => matchesPath(pathname, path));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Signed-in users should not see login/register, but may visit `/` (dashboard home).
  if (token && isAuthEntryPath(pathname)) {
    const homeUrl = request.nextUrl.clone();
    homeUrl.pathname = "/";
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
