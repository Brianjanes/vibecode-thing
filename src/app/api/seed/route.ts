import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { seedDatabase } from "@/lib/db/seed-data";
import { Deck } from "@/lib/db/models/deck";
import { Format } from "@/lib/db/models/format";

export const dynamic = "force-dynamic"; // Prevent route caching

export async function POST() {
  try {
    console.log("Starting database seeding process...");
    const result = await seedDatabase();

    if (!result.success) {
      throw result.error;
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    });
  } catch (error) {
    console.error("Seeding failed with error:", error);
    const errorDetails =
      error instanceof Error
        ? {
            message: error.message,
            name: error.name,
            stack: error.stack,
          }
        : error;

    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}

// Add GET method to check seeding status
export async function GET() {
  try {
    await connectDB();

    const formatCount = await Format.countDocuments();
    const deckCount = await Deck.countDocuments();

    return NextResponse.json({
      success: true,
      counts: {
        formats: formatCount,
        decks: deckCount,
      },
    });
  } catch (error) {
    console.error("Failed to get counts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get database counts" },
      { status: 500 }
    );
  }
}
