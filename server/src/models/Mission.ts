import mongoose from "mongoose";

const ImprovementSchema = new mongoose.Schema({
  observation: String,
  howToFix: String,
  whoWillFix: String,
  whenWillFix: String,
});

const EventSchema = new mongoose.Schema({
  eventName: String,
  sustainDetails: [String],
  improveDetailsArray: [ImprovementSchema],
});

const MissionSchema = new mongoose.Schema(
  {
    missionName: { type: String, required: true },
    missionDate: { type: String, required: true },
    missionUnit: { type: String, required: true },
    summary: String,
    hero: String,
    events: [EventSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Mission = mongoose.model("Mission", MissionSchema);
export default Mission;

