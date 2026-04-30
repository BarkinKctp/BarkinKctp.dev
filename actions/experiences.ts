"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
  const docs = await collection.find({}).sort({ _id: 1 }).toArray();
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

  const company = formData.get("company") as string;
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const duration = formData.get("duration") as string;

  if (!company || !title || !location || !description || !duration) {
    return { error: "All fields are required" };
  }

  const collection = await getCollection();
  await collection.insertOne({ company, title, location, description, duration });

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

  const id = formData.get("id") as string;
  const company = formData.get("company") as string;
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const duration = formData.get("duration") as string;

  if (!id || !company || !title || !location || !description || !duration) {
    return { error: "All fields are required" };
  }

  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { company, title, location, description, duration } }
  );

  if (result.matchedCount === 0) return { error: "Experience not found" };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteExperience(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) return { error: "Experience not found" };

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
