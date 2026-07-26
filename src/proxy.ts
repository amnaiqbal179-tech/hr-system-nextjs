import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Agar user logout kar raha hai toh jaane dein
  if (pathname.startsWith("/api/auth/logout")) {
    return NextResponse.next();
  }

  // AGAR TOKEN NAHI HAI: Aur user admin ya employee page par hai -> Foran Login par bhejo
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/employee"))) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/employee/:path*"],
};