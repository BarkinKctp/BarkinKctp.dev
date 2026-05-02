import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "admin_session";
const ACTIVITY_COOKIE = "admin_last_activity";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

/* ======================== RATE LIMITING ======================== */

const ATTEMPTS_PER_TIER = 3;
const LOCKOUT_DURATIONS = [
  5 * 60 * 1000,      // Tier 1: 5 minutes
  15 * 60 * 1000,     // Tier 2: 15 minutes
  45 * 60 * 1000,     // Tier 3: 45 minutes
  2 * 60 * 60 * 1000, // Tier 4: 2 hours
  4 * 60 * 60 * 1000, // Tier 5: 4 hours
  8 * 60 * 60 * 1000, // Tier 6: 8 hours (max)
];
const FULL_RESET_AFTER = 24 * 60 * 60 * 1000; // 24 hours of no attempts → full reset

const rateLimitState = {
  tier: 0,               // current lockout tier (0 = no lockout yet)
  attemptsInTier: 0,     // failed attempts since last lockout
  lockedUntil: 0,        // timestamp when current lockout expires
  lastAttempt: 0,        // timestamp of last failed attempt
};

export function checkRateLimit(): { locked: boolean; remainingSeconds: number } {
  // Full reset if 24h passed since last attempt
  if (rateLimitState.lastAttempt > 0 && Date.now() - rateLimitState.lastAttempt > FULL_RESET_AFTER) {
    resetAttempts();
  }

  // Check if currently locked out
  if (rateLimitState.lockedUntil > Date.now()) {
    const remaining = Math.ceil((rateLimitState.lockedUntil - Date.now()) / 1000);
    return { locked: true, remainingSeconds: remaining };
  }

  return { locked: false, remainingSeconds: 0 };
}

export function recordFailedAttempt(): void {
  rateLimitState.lastAttempt = Date.now();
  rateLimitState.attemptsInTier++;

  if (rateLimitState.attemptsInTier >= ATTEMPTS_PER_TIER) {
    // Escalate to next tier
    const tierIndex = Math.min(rateLimitState.tier, LOCKOUT_DURATIONS.length - 1);
    const lockoutMs = LOCKOUT_DURATIONS[tierIndex];
    rateLimitState.lockedUntil = Date.now() + lockoutMs;
    rateLimitState.tier++;
    rateLimitState.attemptsInTier = 0;
  }
}

export function resetAttempts(): void {
  rateLimitState.tier = 0;
  rateLimitState.attemptsInTier = 0;
  rateLimitState.lockedUntil = 0;
  rateLimitState.lastAttempt = 0;
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

  const inputBuf = Buffer.from(password);
  const expectedBuf = Buffer.from(adminPassword);

  if (inputBuf.length !== expectedBuf.length) return false;
  return timingSafeEqual(inputBuf, expectedBuf);
}
