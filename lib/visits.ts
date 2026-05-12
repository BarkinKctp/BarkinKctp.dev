import clientPromise from "./mongodb";

const DB_NAME = "portfolio";
const VISITOR_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days

let indexesEnsured = false;

async function getDb() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  if (!indexesEnsured) {
    indexesEnsured = true;
    const visitors = db.collection("visitors");
    // Fast lookups on the upsert key
    await visitors.createIndex({ ipHash: 1 }, { unique: true }).catch(() => {});
    // Auto-delete visitor docs 90 days after last activity
    await visitors
      .createIndex({ lastSeen: 1 }, { expireAfterSeconds: VISITOR_TTL_SECONDS })
      .catch(() => {});
  }

  return db;
}

export async function recordVisit(ipHash: string, path: string) {
  const db = await getDb();

  // Increment total visit counter
  await db.collection<{ totalVisits: number; lastVisited: Date }>("siteStats").updateOne(
    { _id: "counters" } as any,
    { $inc: { totalVisits: 1 }, $set: { lastVisited: new Date() } },
    { upsert: true }
  );

  // Upsert visitor by IP hash for unique count
  await db.collection("visitors").updateOne(
    { ipHash },
    {
      $inc: { visits: 1 },
      $set: { lastSeen: new Date(), lastPath: path },
      $setOnInsert: { firstSeen: new Date() },
    },
    { upsert: true }
  );
}

export async function getVisitStats() {
  const db = await getDb();

  const counters = await db
    .collection<{ totalVisits: number; lastVisited: Date }>("siteStats")
    .findOne({ _id: "counters" } as any);

  const uniqueVisitors = await db.collection("visitors").countDocuments();

  const recentVisitors = await db
    .collection("visitors")
    .find()
    .sort({ lastSeen: -1 })
    .limit(10)
    .toArray();

  return {
    totalVisits: (counters?.totalVisits as number) ?? 0,
    uniqueVisitors,
    lastVisited: counters?.lastVisited
      ? new Date(counters.lastVisited).toISOString()
      : null,
    recentVisitors: recentVisitors.map((v) => ({
      ipHash: (v.ipHash as string).slice(0, 8) + "...",
      visits: v.visits as number,
      lastSeen: new Date(v.lastSeen).toISOString(),
      firstSeen: new Date(v.firstSeen).toISOString(),
    })),
  };
}
