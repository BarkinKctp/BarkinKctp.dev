"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateString, isValidObjectId } from "@/lib/utils";

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  description: string;
  duration: string;
}

const DB_NAME = "portfolio";
const COLLECTION = "experiences";

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

export async function getExperiences(): Promise<Experience[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).sort({ order: 1, _id: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    company: doc.company,
    title: doc.title,
    location: doc.location,
    description: doc.description,
    duration: doc.duration,
  }));
}

export async function addExperience(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const company = formData.get("company");
  const title = formData.get("title");
  const location = formData.get("location");
  const description = formData.get("description");
  const duration = formData.get("duration");

  if (
    !validateString(company, 200) ||
    !validateString(title, 200) ||
    !validateString(location, 200) ||
    !validateString(description, 2000) ||
    !validateString(duration, 100)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection();
    const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
    const order = last.length > 0 && typeof last[0].order === "number" ? last[0].order + 1 : 0;
    await collection.insertOne({ company, title, location, description, duration, order });
  } catch {
    return { error: "Failed to add experience. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateExperience(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const id = formData.get("id");
  const company = formData.get("company");
  const title = formData.get("title");
  const location = formData.get("location");
  const description = formData.get("description");
  const duration = formData.get("duration");

  if (!isValidObjectId(id)) {
    return { error: "Invalid experience ID" };
  }

  if (
    !validateString(company, 200) ||
    !validateString(title, 200) ||
    !validateString(location, 200) ||
    !validateString(description, 2000) ||
    !validateString(duration, 100)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { company, title, location, description, duration } }
    );

    if (result.matchedCount === 0) return { error: "Experience not found" };
  } catch {
    return { error: "Failed to update experience. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteExperience(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  if (!isValidObjectId(id)) {
    return { error: "Invalid experience ID" };
  }

  try {
    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return { error: "Experience not found" };
  } catch {
    return { error: "Failed to delete experience. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
