import { Schema, model, type Document } from 'mongoose';
import type { MissionDocument } from './Mission.js';

export interface UnitDocument extends Document {
  id: string;
  name: string;
  missions: MissionDocument['_id'][];
}

const unitSchema = new Schema<UnitDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    missions: [{
      type: Schema.Types.ObjectId,
      ref: 'Mission'
    }]
  },
  {
    toJSON: {
      virtuals: true,
    },
    timestamps: true
  }
);

const Unit = model<UnitDocument>('Unit', unitSchema);

export default Unit;