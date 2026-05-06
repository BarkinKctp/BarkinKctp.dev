"use server";

import { validateString } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import pool from "@/lib/db";

export const saveContact = async (formData: FormData) => {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const { success } = rateLimit(ip);
  if (!success) {
    return {
      error: "Too many requests. Please try again in a minute.",
    };
  }

  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  try {
    await pool.query(
      "INSERT INTO messages (sender_email, message) VALUES ($1, $2)",
      [senderEmail, message]
    );
  } catch (error: unknown) {
    console.error("Failed to save message:", error);
    return {
      error: "Failed to save message. Please try again.",
    };
  }

  return {
    data: { success: true },
  };
};
