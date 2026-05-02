"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface Project {
  id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  imageUrl: string;
}

const DB_NAME = "portfolio";
const COLLECTION = "projects";

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(COLLECTION);
}

export async function getProjects(): Promise<Project[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).sort({ order: 1, _id: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    link: doc.link,
    tags: doc.tags,
    imageUrl: doc.imageUrl,
  }));
}

export async function addProject(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const tagsRaw = formData.get("tags") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!title || !description || !link || !tagsRaw || !imageUrl) {
    return { error: "All fields are required" };
  }

  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  const collection = await getCollection();
  const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
  const order = last.length > 0 && typeof last[0].order === "number" ? last[0].order + 1 : 0;
  await collection.insertOne({ title, description, link, tags, imageUrl, order });

  revalidatePath("/");
  revalidatePath("/pages/projects");
  revalidatePath("/admin");

  return { success: true };
}

export async function updateProject(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const link = formData.get("link") as string;
  const tagsRaw = formData.get("tags") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!id || !title || !description || !link || !tagsRaw || !imageUrl) {
    return { error: "All fields are required" };
  }

  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  const collection = await getCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, description, link, tags, imageUrl } }
  );

  if (result.matchedCount === 0) {
    return { error: "Project not found" };
  }

  revalidatePath("/");
  revalidatePath("/pages/projects");
  revalidatePath("/admin");

  return { success: true };
}

export async function deleteProject(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) {
    return { error: "Unauthorized" };
  }

  const collection = await getCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return { error: "Project not found" };
  }

  revalidatePath("/");
  revalidatePath("/pages/projects");
  revalidatePath("/admin");

  return { success: true };
}
