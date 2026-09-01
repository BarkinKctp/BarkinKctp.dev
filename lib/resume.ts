import clientPromise from "./mongodb";

const DB_NAME = "portfolio";

interface ResumeSettings {
  _id: string;
  url: string;
  updatedAt: Date;
}

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
    .collection<ResumeSettings>("resumeSettings")
    .findOne({ _id: "current" });
  return doc?.url ?? null;
}

export async function setResumeUrl(url: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<ResumeSettings>("resumeSettings")
    .updateOne(
      { _id: "current" },
      { $set: { url, updatedAt: new Date() } },
      { upsert: true },
    );
}

export async function recordResumeDownload(
  ipHash: string,
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

  // Check if this visitor already exists (same computer = same number)
  const existing = await col.findOne({ ipHash });
  if (existing) {
    await col.updateOne(
      { ipHash },
      {
        $inc: { downloads: 1 },
        $set: { lastDownloadedAt: new Date() },
      },
    );
  } else {
    // Assign the next visitor number
    const maxDoc = await col
      .find()
      .sort({ visitorNumber: -1 })
      .limit(1)
      .toArray();
    const nextNumber = (maxDoc[0]?.visitorNumber ?? 0) + 1;

    await col.insertOne({
      ipHash,
      downloads: 1,
      visitorNumber: nextNumber,
      firstDownloadedAt: new Date(),
      lastDownloadedAt: new Date(),
    });
  }
}

export interface ResumeDownloadEntry {
  visitorNumber: number;
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
      visitorNumber: (d.visitorNumber as number) ?? 0,
      downloads: d.downloads as number,
      lastDownloadedAt: new Date(d.lastDownloadedAt).toISOString(),
      firstDownloadedAt: new Date(d.firstDownloadedAt).toISOString(),
    })),
  };
}
