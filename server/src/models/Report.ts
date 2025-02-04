import {Schema, type Document} from 'mongoose';

export interface ReportDocument extends Document {
    reportId: string;
    description: string;
}

const reportSchema= new Schema <ReportDocument>({
    description: {
        type: String,
        required: true,
    },
});

export default reportSchema;