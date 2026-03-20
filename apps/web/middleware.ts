import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    (token && request.nextUrl.pathname == "/login") ||
    (token && request.nextUrl.pathname == "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
