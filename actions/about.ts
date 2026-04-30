"use server";

import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;
  const description = formData.get("description") as string;

  if (!name || !image || !description) return { error: "All fields are required" };

  const collection = await getCollection("places");
  const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
  const order = last.length > 0 ? last[0].order + 1 : 0;

  await collection.insertOne({ name, image, description, order });
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

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const image = formData.get("image") as string;
  const description = formData.get("description") as string;

  if (!id || !name || !image || !description) return { error: "All fields are required" };

  const collection = await getCollection("places");
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, image, description } }
  );
  if (result.matchedCount === 0) return { error: "Place not found" };

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function deletePlace(id: string): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const collection = await getCollection("places");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return { error: "Place not found" };

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

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string;

  if (!title || !author || !image) return { error: "All fields are required" };

  const collection = await getCollection("books");
  const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
  const order = last.length > 0 ? last[0].order + 1 : 0;

  await collection.insertOne({ title, author, image, order });
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

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string;

  if (!id || !title || !author || !image) return { error: "All fields are required" };

  const collection = await getCollection("books");
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, author, image } }
  );
  if (result.matchedCount === 0) return { error: "Book not found" };

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteBook(id: string): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const collection = await getCollection("books");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return { error: "Book not found" };

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

  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const cover = formData.get("cover") as string;
  const spotifyUrl = formData.get("spotifyUrl") as string;

  if (!title || !artist || !cover || !spotifyUrl) return { error: "All fields are required" };

  const collection = await getCollection("music");
  const last = await collection.find({}).sort({ order: -1 }).limit(1).toArray();
  const order = last.length > 0 ? last[0].order + 1 : 0;

  await collection.insertOne({ title, artist, cover, spotifyUrl, order });
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

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const cover = formData.get("cover") as string;
  const spotifyUrl = formData.get("spotifyUrl") as string;

  if (!id || !title || !artist || !cover || !spotifyUrl) return { error: "All fields are required" };

  const collection = await getCollection("music");
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { title, artist, cover, spotifyUrl } }
  );
  if (result.matchedCount === 0) return { error: "Track not found" };

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}

export async function deleteMusic(id: string): Promise<{ error?: string; success?: boolean }> {
  const authenticated = await verifySession();
  if (!authenticated) return { error: "Unauthorized" };

  const collection = await getCollection("music");
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) return { error: "Track not found" };

  revalidatePath("/pages/about-me");
  revalidatePath("/admin");
  return { success: true };
}
