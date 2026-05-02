"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateString, isValidObjectId } from "@/lib/utils";

export interface Skill {
  id: string;
  name: string;
  order: number;
}

const DB_NAME = "portfolio";
const COLLECTION = "skills";

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

export async function getSkills(): Promise<Skill[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    order: doc.order,
  }));
}

export async function addSkill(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const name = formData.get("name");

  if (!validateString(name, 100)) return { error: "Skill name is required (max 100 chars)" };

  try {
    const collection = await getCollection();
    // Get max order to append at end
    const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
    const order = last.length > 0 ? last[0].order + 1 : 0;

    await collection.insertOne({ name, order });
  } catch {
    return { error: "Failed to add skill. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateSkill(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const id = formData.get("id");
  const name = formData.get("name");

  if (!isValidObjectId(id)) return { error: "Invalid skill ID" };
  if (!validateString(name, 100)) return { error: "All fields are required" };

  try {
    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name } }
    );

    if (result.matchedCount === 0) return { error: "Skill not found" };
  } catch {
    return { error: "Failed to update skill. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteSkill(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  if (!isValidObjectId(id)) return { error: "Invalid skill ID" };

  try {
    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return { error: "Skill not found" };
  } catch {
    return { error: "Failed to delete skill. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
