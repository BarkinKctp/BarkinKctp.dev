import { NextRequest, NextResponse } from "next/server";
import { getResumeUrl, recordResumeDownload } from "@/lib/resume";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const BOT_UA_RE =
  /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|linkedinbot|embedly|quora|pinterest|semrush|ahref|bytespider|gptbot/i;

const RATE_WINDOW = 60; // 1 minute
const RATE_MAX = 3;     // max 3 download tracks per IP per minute

export async function GET(request: NextRequest) {
  const url = await getResumeUrl();

  if (!url) {
    return NextResponse.json({ url: null });
  }

  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT_UA_RE.test(ua)) {
    return NextResponse.json({ url });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Rate limit via Redis to avoid cluttering MongoDB
  const rateKey = `ratelimit:resume:${ip}`;
  const count = await redis.incr(rateKey);
  if (count === 1) await redis.expire(rateKey, RATE_WINDOW);
  if (count > RATE_MAX) {
    return NextResponse.json({ url }); // still return URL, just skip tracking
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(ip + (process.env.IP_HASH_SALT ?? ""));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const ipHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await recordResumeDownload(ipHash, ua);

  return NextResponse.json({ url });
}
