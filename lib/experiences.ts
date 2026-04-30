import clientPromise from "./mongodb";

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

export async function getExperiencesFromDb(): Promise<Experience[]> {
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
