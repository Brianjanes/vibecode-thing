import mongoose from "mongoose";

export interface FormatDocument extends mongoose.Document {
  name: string;
  minDeckSize: number;
  maxDeckSize: number | null;
  maxCopies: number;
  allowedSets: string[];
  sideboardSize: number | null;
}

const formatSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  minDeckSize: { type: Number, required: true },
  maxDeckSize: { type: Number, default: null },
  maxCopies: { type: Number, required: true },
  allowedSets: [{ type: String }],
  sideboardSize: { type: Number, default: 15 },
});

export const Format =
  mongoose.models.Format ||
  mongoose.model<FormatDocument>("Format", formatSchema);
