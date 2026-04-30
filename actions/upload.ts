"use server";

import { put, del } from "@vercel/blob";
import { verifySession } from "@/lib/auth";

const MAX_SIZE = 4 * 1024 * 1024; // 4MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function uploadImage(
  formData: FormData
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
    return { error: "Invalid file type. Use PNG, JPEG, WebP, or GIF." };
  }

  if (file.size > MAX_SIZE) {
    return { error: "File too large. Maximum 4MB." };
  }

  const blob = await put(`projects/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return { url: blob.url };
}

export async function deleteImage(url: string): Promise<void> {
  const authenticated = await verifySession();
  if (!authenticated) return;

  try {
    await del(url);
  } catch {
    // Ignore deletion errors (image may already be gone)
  }
}
