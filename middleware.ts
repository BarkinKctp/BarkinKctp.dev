import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

async function verifySignedCookie(signed: string): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return false;

  const value = signed.slice(0, lastDot);
  const signature = signed.slice(lastDot + 1);

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  if (signature.length !== expected.length) return false;

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("admin_session");

    if (!sessionCookie || !(await verifySignedCookie(sessionCookie.value))) {
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
