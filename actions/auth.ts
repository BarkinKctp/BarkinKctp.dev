"use server";

import {
  createSession,
  destroySession,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  resetAttempts,
} from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const rateLimit = checkRateLimit();
  if (rateLimit.locked) {
    return { error: `Too many failed attempts. Try again in ${formatDuration(rateLimit.remainingSeconds)}.` };
  }

  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  if (!verifyPassword(password)) {
    recordFailedAttempt();
    const remaining = checkRateLimit();
    if (remaining.locked) {
      return { error: `Account locked. Try again in ${formatDuration(remaining.remainingSeconds)}.` };
    }
    return { error: "Invalid password" };
  }

  resetAttempts();
  await createSession();
  redirect("/admin");
}

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.ceil(seconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes > 1 ? "s" : ""}`;
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function destroySessionAction() {
  await destroySession();
}
