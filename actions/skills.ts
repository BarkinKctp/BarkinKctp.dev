"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

  const name = formData.get("name") as string;

  if (!name) return { error: "Skill name is required" };

  const collection = await getCollection();
  // Get max order to append at end
  const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
  const order = last.length > 0 ? last[0].order + 1 : 0;

  await collection.insertOne({ name, order });

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

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;

  if (!id || !name) return { error: "All fields are required" };

  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name } }
  );

  if (result.matchedCount === 0) return { error: "Skill not found" };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteSkill(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) return { error: "Skill not found" };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
