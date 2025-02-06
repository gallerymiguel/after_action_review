import express from "express";
import type Mission from "models/Mission"; // Import the Mongoose model

const router = express.Router();

// **GET all missions**
router.get("/", async (req, res) => {
  try {
    const missions = await Mission.find();
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching missions", error });
  }
});

// **GET a single mission by ID**
router.get("/:id", async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) return res.status(404).json({ message: "Mission not found" });
    res.status(200).json(mission);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mission", error });
  }
});

// **POST a new mission**
router.post("/", async (req, res) => {
  try {
    const newMission = new Mission(req.body);
    await newMission.save();
    res.status(201).json(newMission);
  } catch (error) {
    res.status(400).json({ message: "Error creating mission", error });
  }
});

// **PUT (Update) an existing mission**
router.put("/:id", async (req, res) => {
  try {
    const updatedMission = await Mission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedMission) return res.status(404).json({ message: "Mission not found" });
    res.status(200).json(updatedMission);
  } catch (error) {
    res.status(400).json({ message: "Error updating mission", error });
  }
});

// **DELETE a mission**
router.delete("/:id", async (req, res) => {
  try {
    const deletedMission = await Mission.findByIdAndDelete(req.params.id);
    if (!deletedMission) return res.status(404).json({ message: "Mission not found" });
    res.status(200).json({ message: "Mission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mission", error });
  }
});

export default router;
