import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema for individual improvement details
const ImproveDetailsSchema = new Schema({
  observation: { type: String, required: true },
  howToFix: { type: String, required: true },
  whoWillFix: { type: String, required: true },
  whenWillFix: { type: String, required: true },
});

// Define the schema for an event
const EventSchema = new Schema({
  eventName: { type: String, required: true },
  type: { type: String, enum: ["sustain", "improve"], required: true },
  sustainDetails: [{ type: String }], // Array of sustain details
  improveDetails: [ImproveDetailsSchema], // Array of improvement details
});

// Define the main mission schema
const MissionSchema = new Schema({
  missionName: { type: String, required: true },
  missionDate: { type: Date, required: true },
  missionUnit: { type: String, required: true },
  events: [EventSchema], // Array of event objects
  summary: { type: String, required: false },
  hero: { type: String, required: false },
}, { timestamps: true });

const Mission = model("Mission", MissionSchema);

export default Mission;
