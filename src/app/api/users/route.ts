import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db/mongoose";
import { User } from "@/lib/db/models/user";

export const dynamic = "force-dynamic";

// Get current user
export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// Create or update user
export async function POST() {
  try {
    const { userId, user } = auth();

    if (!userId || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // Try to find existing user
    let dbUser = await User.findOne({ clerkId: userId });

    if (!dbUser) {
      // Create new user
      dbUser = await User.create({
        clerkId: userId,
        username:
          user.username || user.firstName || `user_${userId.slice(0, 8)}`,
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl,
      });
    } else {
      // Update existing user
      dbUser.username = user.username || dbUser.username;
      dbUser.email = user.emailAddresses[0]?.emailAddress || dbUser.email;
      dbUser.imageUrl = user.imageUrl || dbUser.imageUrl;
      await dbUser.save();
    }

    return NextResponse.json({ success: true, user: dbUser });
  } catch (error) {
    console.error("Failed to create/update user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create/update user" },
      { status: 500 }
    );
  }
}

// Update user preferences
export async function PATCH(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json(
        { success: false, error: "No preferences provided" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Update only provided preferences
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to update user preferences:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user preferences" },
      { status: 500 }
    );
  }
}
