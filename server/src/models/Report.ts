<<<<<<< HEAD
import { Schema, Document, model } from "mongoose";

// Define the ReportDocument interface
export interface ReportDocument extends Document {
    reportId: string;
    description: string;
}

// Define the Report schema
const reportSchema = new Schema<ReportDocument>({
    reportId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
});

// ✅ Export the Report model correctly
const Report = model<ReportDocument>("Report", reportSchema);
export default Report;
=======
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
>>>>>>> 1de292f5dc328a24fb9acb701a8653fcf366e971
