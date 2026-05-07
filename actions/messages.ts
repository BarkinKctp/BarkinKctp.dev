"use server";

import pool from "@/lib/db";

export type Message = {
  id: number;
  sender_email: string;
  message: string;
  created_at: string;
};

export async function getMessages(): Promise<Message[]> {
  const result = await pool.query(
    "SELECT id, sender_email, message, created_at FROM messages ORDER BY created_at DESC"
  );
  return result.rows.map((row) => ({
    ...row,
    created_at: row.created_at.toISOString(),
  }));
}

export async function deleteMessage(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await pool.query("DELETE FROM messages WHERE id = $1", [id]);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to delete message:", error);
    return { success: false, error: "Failed to delete message" };
  }
}
