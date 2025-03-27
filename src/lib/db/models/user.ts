import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  clerkId: string;
  username: string;
  email: string;
  imageUrl?: string;
  preferences: {
    defaultFormat: string;
    showPrices: boolean;
    theme: "light" | "dark" | "system";
  };
  stats: {
    totalDecks: number;
    publicDecks: number;
    favoriteFormats: string[];
    favoriteColors: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    imageUrl: String,
    preferences: {
      defaultFormat: {
        type: String,
        default: "Standard",
        enum: [
          "Standard",
          "Modern",
          "Pioneer",
          "Legacy",
          "Vintage",
          "Commander",
        ],
      },
      showPrices: {
        type: Boolean,
        default: true,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    stats: {
      totalDecks: {
        type: Number,
        default: 0,
      },
      publicDecks: {
        type: Number,
        default: 0,
      },
      favoriteFormats: [
        {
          type: String,
          enum: [
            "Standard",
            "Modern",
            "Pioneer",
            "Legacy",
            "Vintage",
            "Commander",
          ],
        },
      ],
      favoriteColors: [
        {
          type: String,
          enum: ["W", "U", "B", "R", "G", "C"],
        },
      ],
    },
  },
  {
    timestamps: true,
    // Add indexes for common queries
    indexes: [{ clerkId: 1 }, { username: 1 }, { email: 1 }],
  }
);

// Add middleware to update stats when decks are created/deleted
userSchema.methods.updateDeckStats = async function () {
  const { Deck } = await import("./deck");

  const [totalDecks, publicDecks] = await Promise.all([
    Deck.countDocuments({ "author.id": this.clerkId }),
    Deck.countDocuments({ "author.id": this.clerkId, isPublic: true }),
  ]);

  this.stats.totalDecks = totalDecks;
  this.stats.publicDecks = publicDecks;
  await this.save();
};

export const User =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);
