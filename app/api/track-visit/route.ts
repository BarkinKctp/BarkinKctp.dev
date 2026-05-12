import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/lib/visits";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const BOT_UA_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|linkedinbot|embedly|quora|pinterest|semrush|ahref|bytespider|gptbot/i;

const VISIT_RATE_WINDOW = 60; // 1 minute
const VISIT_RATE_MAX = 5;     // max 5 hits per IP per minute

export async function POST(request: NextRequest) {
  try {
    // Origin check — only accept requests from our own domain
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ ok: true });
    }

    const ua = request.headers.get("user-agent") ?? "";
    if (!ua || BOT_UA_RE.test(ua)) {
      return NextResponse.json({ ok: true });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    // Rate limit to prevent abuse
    const rateKey = `ratelimit:visit:${ip}`;
    const count = await redis.incr(rateKey);
    if (count === 1) await redis.expire(rateKey, VISIT_RATE_WINDOW);
    if (count > VISIT_RATE_MAX) {
      return NextResponse.json({ ok: true }); // silent drop
    }

    // Hash the IP for privacy
    const encoder = new TextEncoder();
    const data = encoder.encode(ip + (process.env.IP_HASH_SALT ?? ""));
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const ipHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const body = await request.json().catch(() => ({}));
    const path =
      typeof body.path === "string" ? body.path.slice(0, 200) : "/";

    await recordVisit(ipHash, path);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to track visit:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
