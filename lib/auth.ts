import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

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
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
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
