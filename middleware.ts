import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

function verifySignedCookie(signed: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return false;

  const value = signed.slice(0, lastDot);
  const signature = signed.slice(lastDot + 1);

  const expected = createHmac("sha256", secret).update(value).digest("hex");

  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");

  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie || !verifySignedCookie(sessionCookie.value)) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("admin_session");
      response.cookies.delete("admin_last_activity");
      return response;
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
