import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db("mtg-deckbuilder-db");

    // Get collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    return NextResponse.json({
      success: true,
      message: "Successfully accessed collections",
      collections: collectionNames,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Collection test failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to access collections",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
