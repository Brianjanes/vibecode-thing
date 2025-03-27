import mongoose from "mongoose";

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: Cached | undefined;
}

const cached: Cached = global.mongoose || { conn: null, promise: null };
if (!global.mongoose) {
  global.mongoose = cached;
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Creating new database connection");

    const opts = {
      bufferCommands: false,
      dbName: "mtg-deckbuilder-db",
    };

    // TypeScript knows uri is string here because of the check above
    cached.promise = mongoose.connect(uri as string, opts).then((mongoose) => {
      console.log("MongoDB connected successfully!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error("Failed to establish MongoDB connection:", error);
    throw error;
  }

  return cached.conn;
}

export async function testConnection() {
  try {
    await connectDB();
    if (!mongoose.connection.db) {
      throw new Error("Database connection not established");
    }
    await mongoose.connection.db.admin().ping();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return true;
  } catch (error) {
    console.error("Connection test failed:", error);
    return false;
  }
}
