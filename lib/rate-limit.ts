import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const WINDOW_SEC = 60; // 1 minute window
const MAX_REQUESTS = 3; // max 3 per minute per IP

export async function rateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
}> {
  const key = `ratelimit:contact:${identifier}`;
  const count = await redis.incr(key);

  if (count === 1) {
    await redis.expire(key, WINDOW_SEC);
  }

  if (count > MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: MAX_REQUESTS - count };
}
