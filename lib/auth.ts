import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { Redis } from "@upstash/redis";

const SESSION_COOKIE = "admin_session";
const ACTIVITY_COOKIE = "admin_last_activity";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/* ======================== RATE LIMITING ======================== */

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

const ATTEMPTS_PER_TIER = 3;
const LOCKOUT_DURATIONS_SEC = [
  5 * 60,       // Tier 1: 5 minutes
  15 * 60,      // Tier 2: 15 minutes
  45 * 60,      // Tier 3: 45 minutes
  2 * 60 * 60,  // Tier 4: 2 hours
  4 * 60 * 60,  // Tier 5: 4 hours
  8 * 60 * 60,  // Tier 6: 8 hours (max)
];
const FULL_RESET_SEC = 24 * 60 * 60; // 24 hours TTL on keys

function keyAttempts(ip: string) { return `ratelimit:login:${ip}:attempts`; }
function keyTier(ip: string) { return `ratelimit:login:${ip}:tier`; }
function keyLockout(ip: string) { return `ratelimit:login:${ip}:lockout`; }

export async function checkRateLimit(ip: string): Promise<{ locked: boolean; remainingSeconds: number }> {
  const ttl = await redis.ttl(keyLockout(ip));

  if (ttl > 0) {
    return { locked: true, remainingSeconds: ttl };
  }

  return { locked: false, remainingSeconds: 0 };
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  // INCR is atomic — safe against concurrent requests
  const attempts = await redis.incr(keyAttempts(ip));

  // Set TTL on first attempt so it auto-expires after 24h
  if (attempts === 1) {
    await redis.expire(keyAttempts(ip), FULL_RESET_SEC);
  }

  if (attempts >= ATTEMPTS_PER_TIER) {
    const tier = (await redis.get<number>(keyTier(ip))) ?? 0;
    const tierIndex = Math.min(tier, LOCKOUT_DURATIONS_SEC.length - 1);
    const lockoutSec = LOCKOUT_DURATIONS_SEC[tierIndex];

    // Lockout key auto-expires when the lockout period ends
    await redis.set(keyLockout(ip), 1, { ex: lockoutSec });

    // Escalate tier and reset attempt counter
    await redis.incr(keyTier(ip));
    await redis.expire(keyTier(ip), FULL_RESET_SEC);
    await redis.del(keyAttempts(ip));
  }
}

export async function resetAttempts(ip: string): Promise<void> {
  await redis.del(keyAttempts(ip), keyTier(ip), keyLockout(ip));
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(value: string): string {
  const secret = getSecret();
  const signature = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${signature}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;

  const value = signed.slice(0, lastDot);
  const signature = signed.slice(lastDot + 1);

  const secret = getSecret();
  const expected = createHmac("sha256", secret).update(value).digest("hex");

  const sigBuf = Buffer.from(signature, "hex");
  const expBuf = Buffer.from(expected, "hex");

  if (sigBuf.length !== expBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expBuf)) return null;

  return value;
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify({
    authenticated: true,
    createdAt: Date.now(),
  });
  const signed = sign(sessionData);

  cookieStore.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });

  cookieStore.set(ACTIVITY_COOKIE, Date.now().toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(ACTIVITY_COOKIE);
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);

  if (!cookie) return false;

  const payload = verify(cookie.value);
  if (!payload) return false;

  try {
    const data = JSON.parse(payload);
    const age = Date.now() - data.createdAt;
    if (age > SESSION_MAX_AGE * 1000) return false;
    return data.authenticated === true;
  } catch {
    return false;
  }
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const inputHash = createHash("sha256").update(password).digest();
  const expectedHash = createHash("sha256").update(adminPassword).digest();
  return timingSafeEqual(inputHash, expectedHash);
}
