import clientPromise from "./mongodb";

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

export async function getPlacesFromDb(): Promise<Place[]> {
  const client = await clientPromise;
  const docs = await client.db(DB_NAME).collection("places").find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    image: doc.image,
    description: doc.description,
    order: doc.order,
  }));
}

export async function getBooksFromDb(): Promise<Book[]> {
  const client = await clientPromise;
  const docs = await client.db(DB_NAME).collection("books").find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    author: doc.author,
    image: doc.image,
    order: doc.order,
  }));
}

export async function getMusicFromDb(): Promise<Music[]> {
  const client = await clientPromise;
  const docs = await client.db(DB_NAME).collection("music").find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    artist: doc.artist,
    cover: doc.cover,
    spotifyUrl: doc.spotifyUrl,
    order: doc.order,
  }));
}
