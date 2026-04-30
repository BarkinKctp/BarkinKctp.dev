import clientPromise from "./mongodb";

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

export async function getProjectsFromDb(): Promise<Project[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    link: doc.link,
    tags: doc.tags,
    imageUrl: doc.imageUrl,
  }));
}
