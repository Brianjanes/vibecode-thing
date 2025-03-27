import mongoose from "mongoose";
import { Card } from "@/types/mtg";
import {
  calculateAverageMV,
  calculateColorDistribution,
  countCardsByType,
} from "../utils/deck-stats";

export interface DeckDocument extends mongoose.Document {
  name: string;
  format: string;
  cards: Array<{
    card: Card;
    quantity: number;
    isSideboard: boolean;
  }>;
  author: {
    id: string;
    name: string;
  };
  isPublic: boolean;
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  tags?: string[];
  stats: {
    averageManaValue: number;
    colorDistribution: Record<string, number>;
    landCount: number;
    creatureCount: number;
  };
}

const deckSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    format: { type: String, required: true },
    cards: [
      {
        card: {
          id: { type: String, required: true },
          name: { type: String, required: true },
          // Only store essential card data, rest can be fetched from Scryfall
          mana_cost: String,
          type_line: String,
          cmc: Number,
        },
        quantity: { type: Number, required: true, min: 1 },
        isSideboard: { type: Boolean, default: false },
      },
    ],
    author: {
      id: { type: String, required: true, index: true },
      name: { type: String, required: true },
    },
    isPublic: { type: Boolean, default: true },
    colors: [{ type: String, enum: ["W", "U", "B", "R", "G", "C"] }],
    description: String,
    tags: [String],
    stats: {
      averageManaValue: Number,
      colorDistribution: { type: Map, of: Number },
      landCount: Number,
      creatureCount: Number,
    },
  },
  {
    timestamps: true,
    // Add indexes for common queries
    indexes: [
      { author: 1 },
      { format: 1 },
      { isPublic: 1 },
      { colors: 1 },
      { "cards.card.id": 1 },
    ],
  }
);

// Add middleware to update stats before saving
deckSchema.pre("save", function (next) {
  // Calculate deck statistics
  const cards = this.cards.filter((c) => !c.isSideboard);
  this.stats = {
    averageManaValue: calculateAverageMV(cards),
    colorDistribution: calculateColorDistribution(cards),
    landCount: countCardsByType(cards, "Land"),
    creatureCount: countCardsByType(cards, "Creature"),
  };
  next();
});

export const Deck =
  mongoose.models.Deck || mongoose.model<DeckDocument>("Deck", deckSchema);
