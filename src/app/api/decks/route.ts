import connectDB from "@/lib/db/mongoose";
import { Deck } from "@/lib/db/models/deck";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const format = searchParams.get("format");

    // Build query
    const query: any = {};
    if (userId) query["author.id"] = userId;
    if (format) query.format = format;

    // Only show public decks unless specifically querying user's decks
    if (!userId) query.isPublic = true;

    const decks = await Deck.find(query);
    return NextResponse.json({ success: true, decks });
  } catch (error) {
    console.error("Failed to fetch decks:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch decks" },
      { status: 500 }
    );
  }
}
