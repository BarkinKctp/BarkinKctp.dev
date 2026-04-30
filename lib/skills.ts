import clientPromise from "./mongodb";

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

export async function getSkillsFromDb(): Promise<Skill[]> {
  const collection = await getCollection();
  const docs = await collection.find({}).sort({ order: 1 }).toArray();
  return docs.map((doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    order: doc.order,
  }));
}
