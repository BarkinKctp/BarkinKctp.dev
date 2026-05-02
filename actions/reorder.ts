"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "@/lib/utils";

const DB_NAME = "portfolio";
const ALLOWED_COLLECTIONS = new Set([
  "projects",
  "experiences",
  "skills",
  "places",
  "books",
  "music",
]);

export async function reorderItems(
  collection: string,
  orderedIds: string[]
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  if (!ALLOWED_COLLECTIONS.has(collection)) {
    return { error: "Invalid collection" };
  }

  if (orderedIds.length > 200) {
    return { error: "Too many items" };
  }

  if (!orderedIds.every(isValidObjectId)) {
    return { error: "Invalid item ID" };
  }

  try {
    const client = await clientPromise;
    const col = client.db(DB_NAME).collection(collection);

    const ops = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index } },
      },
    }));

    await col.bulkWrite(ops);
  } catch {
    return { error: "Failed to reorder items. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/pages/about-me");
  revalidatePath("/pages/projects");
  return { success: true };
}
