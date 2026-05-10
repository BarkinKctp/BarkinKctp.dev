import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { getDailyWord, getDailyWordIndex, ENGLISH_ANSWERS } from "@/lib/wordle-words";
import { ObjectId } from "mongodb";

const DB_NAME = "portfolio";
const COLLECTION = "wordle-leaderboard";

export async function GET() {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clientPromise;
  const col = client.db(DB_NAME).collection(COLLECTION);

  const todayWord = getDailyWord();
  const wordIndex = getDailyWordIndex(ENGLISH_ANSWERS);

  // Today's date key
  const d = new Date();
  const today = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

  // Stats
  const [todayEntries, totalEntries] = await Promise.all([
    col.find({ date: today }).sort({ guesses: 1, hintsUsed: 1, createdAt: 1 }).toArray(),
    col.countDocuments(),
  ]);

  // All-time entries (latest 100)
  const allEntries = await col
    .find()
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  return NextResponse.json({
    todayWord,
    wordIndex,
    totalAnswers: ENGLISH_ANSWERS.length,
    today,
    stats: {
      todayCount: todayEntries.length,
      totalCount: totalEntries,
    },
    todayEntries: todayEntries.map((e) => ({
      id: e._id.toString(),
      name: e.name,
      guesses: e.guesses,
      hintsUsed: e.hintsUsed,
      date: e.date,
      createdAt: e.createdAt,
    })),
    allEntries: allEntries.map((e) => ({
      id: e._id.toString(),
      name: e.name,
      guesses: e.guesses,
      hintsUsed: e.hintsUsed,
      date: e.date,
      createdAt: e.createdAt,
    })),
  });
}

export async function DELETE(req: NextRequest) {
  const authenticated = await verifySession();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const clearAll = searchParams.get("clearAll");

  const client = await clientPromise;
  const col = client.db(DB_NAME).collection(COLLECTION);

  if (clearAll === "today") {
    const d = new Date();
    const today = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    await col.deleteMany({ date: today });
    return NextResponse.json({ ok: true, cleared: "today" });
  }

  if (clearAll === "all") {
    await col.deleteMany({});
    return NextResponse.json({ ok: true, cleared: "all" });
  }

  if (id) {
    await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Missing id or clearAll param" }, { status: 400 });
}
