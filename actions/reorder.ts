"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const DB_NAME = "portfolio";

export async function reorderItems(
  collection: string,
  orderedIds: string[]
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const client = await clientPromise;
  const col = client.db(DB_NAME).collection(collection);

  const ops = orderedIds.map((id, index) => ({
    updateOne: {
      filter: { _id: new ObjectId(id) },
      update: { $set: { order: index } },
    },
  }));

  await col.bulkWrite(ops);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/pages/about-me");
  revalidatePath("/pages/projects");
  return { success: true };
}
