import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongoose";
import { Deck } from "@/lib/db/models";

// Temporarily disable auth for testing
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("Attempting to connect to MongoDB...");
    console.log("Using database: mtg-deckbuilder-db");

    // Test database connection
    await connectDB();

    console.log("Connection successful, attempting to create test deck...");

    // Create a test deck
    const testDeck = await Deck.create({
      name: "Test Deck",
      format: "Standard",
      cards: [
        {
          card: {
            id: "test-card-1",
            name: "Test Card",
            lang: "en",
            released_at: "2024-03-24",
            uri: "test-uri",
            scryfall_uri: "test-scryfall-uri",
            layout: "normal",
            image_uris: {
              small: "test-small",
              normal: "test-normal",
              large: "test-large",
              png: "test-png",
              art_crop: "test-art-crop",
              border_crop: "test-border-crop",
            },
            mana_cost: "{1}{R}",
            cmc: 2,
            type_line: "Creature — Test",
            oracle_text: "Test creature text",
            colors: ["R"],
            color_identity: ["R"],
            legalities: new Map([["standard", "legal"]]),
            set: "test",
            set_name: "Test Set",
            collector_number: "1",
            rarity: "common",
            power: "2",
            toughness: "2",
          },
          quantity: 4,
          isSideboard: false,
        },
      ],
      author: {
        id: "test-author",
        name: "Test User",
      },
    });

    console.log("Test deck created successfully:", testDeck._id);

    // Fetch the created deck
    const fetchedDeck = await Deck.findById(testDeck._id);
    console.log("Test deck fetched successfully");

    // Clean up - delete the test deck
    await Deck.findByIdAndDelete(testDeck._id);
    console.log("Test deck deleted successfully");

    return NextResponse.json({
      success: true,
      message: "Database connection and operations successful",
      testResults: {
        created: testDeck._id ? true : false,
        fetched: fetchedDeck ? true : false,
        deleted: true,
      },
    });
  } catch (error) {
    console.error("Database test failed:", error);
    // More detailed error information
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
        message: "Database test failed",
        error: errorDetails,
      },
      { status: 500 }
    );
  }
}
