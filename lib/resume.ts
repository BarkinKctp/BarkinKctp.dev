import clientPromise from "./mongodb";

const DB_NAME = "portfolio";

let indexesEnsured = false;

async function getDb() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  if (!indexesEnsured) {
    indexesEnsured = true;
    const downloads = db.collection("resumeDownloads");
    await downloads.createIndex({ ipHash: 1 }, { unique: true }).catch(() => {});
    await downloads.createIndex({ lastDownloadedAt: -1 }).catch(() => {});
  }

  return db;
}

export async function getResumeUrl(): Promise<string | null> {
  const db = await getDb();
  const doc = await db
    .collection<{ url: string; updatedAt: Date }>("resumeSettings")
    .findOne({ _id: "current" } as any);
  return doc?.url ?? null;
}

export async function setResumeUrl(url: string): Promise<void> {
  const db = await getDb();
  await db
    .collection("resumeSettings")
    .updateOne(
      { _id: "current" } as any,
      { $set: { url, updatedAt: new Date() } },
      { upsert: true },
    );
}

export async function recordResumeDownload(
  ipHash: string,
  userAgent: string,
): Promise<void> {
  const db = await getDb();
  const col = db.collection("resumeDownloads");
  const cooldown = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h ago

  // Skip if this IP already downloaded in the last 24 hours
  const recent = await col.findOne({
    ipHash,
    lastDownloadedAt: { $gt: cooldown },
  });
  if (recent) return;

  await col.updateOne(
    { ipHash },
    {
      $inc: { downloads: 1 },
      $set: { lastDownloadedAt: new Date(), userAgent: userAgent.slice(0, 256) },
      $setOnInsert: { firstDownloadedAt: new Date() },
    },
    { upsert: true },
  );
}

export interface ResumeDownloadEntry {
  ipHash: string;
  userAgent: string;
  downloads: number;
  lastDownloadedAt: string;
  firstDownloadedAt: string;
}

export interface ResumeStats {
  uniqueDownloaders: number;
  totalDownloads: number;
  recentDownloads: ResumeDownloadEntry[];
  resumeUrl: string | null;
}

export async function getResumeStats(): Promise<ResumeStats> {
  const db = await getDb();
  const col = db.collection("resumeDownloads");

  const uniqueDownloaders = await col.countDocuments();

  const pipeline = [
    { $group: { _id: null, total: { $sum: "$downloads" } } },
  ];
  const aggResult = await col.aggregate(pipeline).toArray();
  const totalDownloads = aggResult[0]?.total ?? 0;

  const recentDocs = await col
    .find()
    .sort({ lastDownloadedAt: -1 })
    .limit(20)
    .toArray();

  const resumeUrl = await getResumeUrl();

  return {
    uniqueDownloaders,
    totalDownloads,
    resumeUrl,
    recentDownloads: recentDocs.map((d) => ({
      ipHash: (d.ipHash as string).slice(0, 8) + "...",
      userAgent: d.userAgent as string,
      downloads: d.downloads as number,
      lastDownloadedAt: new Date(d.lastDownloadedAt).toISOString(),
      firstDownloadedAt: new Date(d.firstDownloadedAt).toISOString(),
    })),
  };
}
