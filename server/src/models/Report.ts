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
