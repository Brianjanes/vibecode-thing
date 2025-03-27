import { NextResponse } from "next/server";
import { testConnection } from "@/lib/db/mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const isConnected = await testConnection();

    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: "Successfully connected to MongoDB!",
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to connect to MongoDB",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test connection failed:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to MongoDB",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
