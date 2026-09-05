"use server";

import React from "react";
import { Resend } from "resend";
import { checkBotId } from "botid/server";
import { validateString } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";
import ContactFormEmail from "@/email/contact-form-email";
import { headers } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  // Bot check first — cheapest rejection, and keeps spam off the rate-limit counter.
  const verification = await checkBotId();
  if (verification.isBot) {
    return {
      error: "Request blocked. Please try again.",
    };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const { success } = await rateLimit(ip);
  if (!success) {
    return {
      error: "Too many requests. Please try again in a minute.",
    };
  }

  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  // simple server-side validation
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

  let data;
  try {
    data = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "barkinkocatepe12@gmail.com",
      subject: "Message from contact form",
      replyTo: senderEmail,
      react: React.createElement(ContactFormEmail, {
        message: message,
        senderEmail: senderEmail,
      }),
    });
  } catch (error: unknown) {
    console.error("Email send failed:", error);
    return {
      error: "Failed to send message. Please try again.",
    };
  }

  return {
    data,
  };
};