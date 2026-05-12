import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const DB_NAME = "portfolio";
const COLLECTION = "guess-the-word-leaderboard";

function getTodayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") || "today";

  const client = await clientPromise;
  const col = client.db(DB_NAME).collection(COLLECTION);

  const filter = scope === "today" ? { date: getTodayKey() } : {};
  const entries = await col
    .find(filter)
    .sort({ guesses: 1, hintsUsed: 1, createdAt: 1 })
    .limit(50)
    .toArray();

  return NextResponse.json(
    entries.map((e) => ({
      name: e.name,
      guesses: e.guesses,
      hintsUsed: e.hintsUsed,
      ...(scope === "all" ? { date: e.date } : {}),
    })),
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, guesses, hintsUsed } = body;

  // Validate input
  if (
    typeof name !== "string" ||
    name.trim().length === 0 ||
    name.trim().length > 20
  ) {
    return NextResponse.json(
      { error: "Name must be 1-20 characters" },
      { status: 400 },
    );
  }

  if (
    typeof guesses !== "number" ||
    guesses < 1 ||
    guesses > 6 ||
    !Number.isInteger(guesses)
  ) {
    return NextResponse.json({ error: "Invalid guesses" }, { status: 400 });
  }

  if (
    typeof hintsUsed !== "number" ||
    hintsUsed < 0 ||
    hintsUsed > 3 ||
    !Number.isInteger(hintsUsed)
  ) {
    return NextResponse.json({ error: "Invalid hints" }, { status: 400 });
  }

  const today = getTodayKey();
  const client = await clientPromise;
  const col = client.db(DB_NAME).collection(COLLECTION);

  // Sanitize name
  const sanitizedName = name.trim().slice(0, 20);

  await col.insertOne({
    name: sanitizedName,
    guesses,
    hintsUsed,
    date: today,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: true });
}
