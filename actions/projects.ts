"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateString, isValidObjectId } from "@/lib/utils";

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

  const title = formData.get("title");
  const description = formData.get("description");
  const link = formData.get("link");
  const tagsRaw = formData.get("tags");
  const imageUrl = formData.get("imageUrl");

  if (
    !validateString(title, 200) ||
    !validateString(description, 2000) ||
    !validateString(link, 500) ||
    !validateString(tagsRaw, 500) ||
    !validateString(imageUrl, 1000)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  try {
    const collection = await getCollection();
    const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
    const order = last.length > 0 && typeof last[0].order === "number" ? last[0].order + 1 : 0;
    await collection.insertOne({ title, description, link, tags, imageUrl, order });
  } catch {
    return { error: "Failed to add project. Please try again." };
  }

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

  const id = formData.get("id");
  const title = formData.get("title");
  const description = formData.get("description");
  const link = formData.get("link");
  const tagsRaw = formData.get("tags");
  const imageUrl = formData.get("imageUrl");

  if (!isValidObjectId(id)) {
    return { error: "Invalid project ID" };
  }

  if (
    !validateString(title, 200) ||
    !validateString(description, 2000) ||
    !validateString(link, 500) ||
    !validateString(tagsRaw, 500) ||
    !validateString(imageUrl, 1000)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);

  try {
    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, link, tags, imageUrl } }
    );

    if (result.matchedCount === 0) {
      return { error: "Project not found" };
    }
  } catch {
    return { error: "Failed to update project. Please try again." };
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

  if (!isValidObjectId(id)) {
    return { error: "Invalid project ID" };
  }

  try {
    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { error: "Project not found" };
    }
  } catch {
    return { error: "Failed to delete project. Please try again." };
  }

  revalidatePath("/");
  revalidatePath("/pages/projects");
  revalidatePath("/admin");

  return { success: true };
}
