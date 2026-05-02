"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateString, isValidObjectId } from "@/lib/utils";

export interface Place {
  id: string;
  name: string;
  image: string;
  description: string;
  order: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  image: string;
  order: number;
}

export interface Music {
  id: string;
  title: string;
  artist: string;
  cover: string;
  spotifyUrl: string;
  order: number;
}

const DB_NAME = "portfolio";

async function getCollection(name: string) {
  const client = await clientPromise;
  return client.db(DB_NAME).collection(name);
}

// ─── PLACES ───────────────────────────────────────────────

export async function getPlaces(): Promise<Place[]> {
  const collection = await getCollection("places");
  const docs = await collection.find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    description: doc.description,
    order: doc.order,
  }));
}

export async function addPlace(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const name = formData.get("name");
  const image = formData.get("image");
  const description = formData.get("description");

  if (
    !validateString(name, 200) ||
    !validateString(image, 1000) ||
    !validateString(description, 2000)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection("places");
    const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
    const order = last.length > 0 ? last[0].order + 1 : 0;

    await collection.insertOne({ name, image, description, order });
  } catch {
    return { error: "Failed to add place. Please try again." };
  }
  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function updatePlace(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const id = formData.get("id");
  const name = formData.get("name");
  const image = formData.get("image");
  const description = formData.get("description");

  if (!isValidObjectId(id)) return { error: "Invalid place ID" };

  if (
    !validateString(name, 200) ||
    !validateString(image, 1000) ||
    !validateString(description, 2000)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection("places");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, image, description } }
    );
    if (result.matchedCount === 0) return { error: "Place not found" };
  } catch {
    return { error: "Failed to update place. Please try again." };
  }

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function deletePlace(id: string): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  if (!isValidObjectId(id)) return { error: "Invalid place ID" };

  try {
    const collection = await getCollection("places");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return { error: "Place not found" };
  } catch {
    return { error: "Failed to delete place. Please try again." };
  }

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

// ─── BOOKS ────────────────────────────────────────────────

export async function getBooks(): Promise<Book[]> {
  const collection = await getCollection("books");
  const docs = await collection.find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    author: doc.author,
    image: doc.image,
    order: doc.order,
  }));
}

export async function addBook(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const title = formData.get("title");
  const author = formData.get("author");
  const image = formData.get("image");

  if (
    !validateString(title, 200) ||
    !validateString(author, 200) ||
    !validateString(image, 1000)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection("books");
    const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
    const order = last.length > 0 ? last[0].order + 1 : 0;

    await collection.insertOne({ title, author, image, order });
  } catch {
    return { error: "Failed to add book. Please try again." };
  }
  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateBook(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const id = formData.get("id");
  const title = formData.get("title");
  const author = formData.get("author");
  const image = formData.get("image");

  if (!isValidObjectId(id)) return { error: "Invalid book ID" };

  if (
    !validateString(title, 200) ||
    !validateString(author, 200) ||
    !validateString(image, 1000)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection("books");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, author, image } }
    );
    if (result.matchedCount === 0) return { error: "Book not found" };
  } catch {
    return { error: "Failed to update book. Please try again." };
  }

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteBook(id: string): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  if (!isValidObjectId(id)) return { error: "Invalid book ID" };

  try {
    const collection = await getCollection("books");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return { error: "Book not found" };
  } catch {
    return { error: "Failed to delete book. Please try again." };
  }

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

// ─── MUSIC ────────────────────────────────────────────────

export async function getMusic(): Promise<Music[]> {
  const collection = await getCollection("music");
  const docs = await collection.find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    artist: doc.artist,
    cover: doc.cover,
    spotifyUrl: doc.spotifyUrl,
    order: doc.order,
  }));
}

export async function addMusic(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const title = formData.get("title");
  const artist = formData.get("artist");
  const cover = formData.get("cover");
  const spotifyUrl = formData.get("spotifyUrl");

  if (
    !validateString(title, 200) ||
    !validateString(artist, 200) ||
    !validateString(cover, 1000) ||
    !validateString(spotifyUrl, 500)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection("music");
    const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
    const order = last.length > 0 ? last[0].order + 1 : 0;

    await collection.insertOne({ title, artist, cover, spotifyUrl, order });
  } catch {
    return { error: "Failed to add track. Please try again." };
  }
  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function updateMusic(
  _prevState: { error?: string; success?: boolean } | null,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const id = formData.get("id");
  const title = formData.get("title");
  const artist = formData.get("artist");
  const cover = formData.get("cover");
  const spotifyUrl = formData.get("spotifyUrl");

  if (!isValidObjectId(id)) return { error: "Invalid track ID" };

  if (
    !validateString(title, 200) ||
    !validateString(artist, 200) ||
    !validateString(cover, 1000) ||
    !validateString(spotifyUrl, 500)
  ) {
    return { error: "All fields are required and must not exceed length limits" };
  }

  try {
    const collection = await getCollection("music");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, artist, cover, spotifyUrl } }
    );
    if (result.matchedCount === 0) return { error: "Track not found" };
  } catch {
    return { error: "Failed to update track. Please try again." };
  }

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMusic(id: string): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  if (!isValidObjectId(id)) return { error: "Invalid track ID" };

  try {
    const collection = await getCollection("music");
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return { error: "Track not found" };
  } catch {
    return { error: "Failed to delete track. Please try again." };
  }

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}
