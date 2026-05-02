import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Check server-side idle timeout
    const lastActivity = request.cookies.get("admin_last_activity");
    if (lastActivity) {
      const elapsed = Date.now() - parseInt(lastActivity.value, 10);
      if (elapsed > IDLE_TIMEOUT_MS) {
        // Session idle too long — force re-login
        const response = NextResponse.redirect(
          new URL("/admin/login?expired=1", request.url)
        );
        response.cookies.delete("admin_session");
        response.cookies.delete("admin_last_activity");
        return response;
      }
    }

    // Refresh last activity timestamp
    const response = NextResponse.next();
    response.cookies.set("admin_last_activity", Date.now().toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Prevent browser from caching admin pages (back-button after logout)
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
