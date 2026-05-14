"use server";

import { verifySession } from "@/lib/auth";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import {
  setResumeUrl as setUrl,
  getResumeStats as getStats,
  type ResumeStats,
} from "@/lib/resume";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["application/pdf"];

export async function uploadResume(
  formData: FormData,
): Promise<{ url?: string; error?: string }> {
  const authenticated = await verifySession();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No file provided" };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Invalid file type. Only PDF is allowed." };
  }

  if (file.size > MAX_SIZE) {
    return { error: "File too large. Maximum 10MB." };
  }

  const safeName = `resume/${Date.now()}-${randomUUID()}.pdf`;
  const blob = await put(safeName, file, {
    access: "public",
    contentType: "application/pdf",
  });

  await setUrl(blob.url);

  return { url: blob.url };
}

export async function getResumeStats(): Promise<ResumeStats> {
  const authenticated = await verifySession();
  if (!authenticated) {
    return { uniqueDownloaders: 0, totalDownloads: 0, recentDownloads: [], resumeUrl: null };
  }

  return await getStats();
}
