"use server";

import { createSession, destroySession, verifyPassword } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const password = formData.get("password") as string;

  if (!password) {
    return { error: "Password is required" };
  }

  if (!verifyPassword(password)) {
    return { error: "Invalid password" };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}
