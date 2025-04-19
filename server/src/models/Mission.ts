// src/models/Mission.ts
import { Schema, model, Document, Types } from "mongoose";

// 1) Define sub‑document interfaces
export interface Improvement {
  observation: string;
  howToFix: string;
  whoWillFix: string;
  whenWillFix: string;
}

export interface EventEntry {
  eventName: string;
  sustainDetails: string[];
  improveDetailsArray: Improvement[];
}

// 2) Main interface for a Mission document
export interface MissionDocument extends Document {
  missionName: string;
  missionDate: string;
  missionUnit: string;
  summary?: string;
  hero?: string;
  events: EventEntry[];
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// 3) Sub‑schemas
const ImprovementSchema = new Schema<Improvement>(
  {
    observation: String,
    howToFix:    String,
    whoWillFix:  String,
    whenWillFix: String,
  },
  { _id: false } // improvements are embedded, no separate _id needed
);

const EventSchema = new Schema<EventEntry>(
  {
    eventName:            { type: String, required: true },
    sustainDetails:       { type: [String], default: [] },
    improveDetailsArray:  { type: [ImprovementSchema], default: [] },
  }
);

// 4) The Mission schema itself
const MissionSchema = new Schema<MissionDocument>(
  {
    missionName: { type: String, required: true },
    missionDate: { type: String, required: true },
    missionUnit: { type: String, required: true },
    summary:     String,
    hero:        String,
    events:      [EventSchema],
    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 5) Create & export the model
const Mission = model<MissionDocument>("Mission", MissionSchema);
export default Mission;
