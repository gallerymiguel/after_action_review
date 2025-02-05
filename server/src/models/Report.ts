import mongoose, { Schema, Document, Model } from "mongoose";

// Define the TypeScript interface for the report document
export interface IReport extends Document {
  title: string;
  description: string;
  createdAt: Date;
}

// Define the Schema
const ReportSchema: Schema = new Schema<IReport>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Create the Model
const Report: Model<IReport> = mongoose.model<IReport>("Report", ReportSchema);

export default Report; // Make sure this is a default export
