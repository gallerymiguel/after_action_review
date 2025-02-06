import express from "express";
import type {User} from '../models/User.js';
import Mission from '../models/Mission.js';

export const getMe= (token: string) => {
    return fetch('/api/users/me', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
};

export const createUser= (userData: User) => {
    return fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(userData), 
    });
};

export const loginUser= (userData: User) => {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};

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

// export const newMission= (missionData: missionForm) => {
//     return fetch('api/missions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(missionData),
//     });
// };

// export const deleteMission= (missionId: string, token: string) => {
//     return fetch(`api/users/missions/${missionId}`, {
//         method: 'DELETE',
//         headers: {
//             authorization: `Bearer ${token}`,
//         },
//     });
// };

// export const fetchMissions = async () => {
//     try {
//       const response = await fetch("https://your-api-url.com/missions");
//       return response.json();
//     } catch (error) {
//       console.error("Error fetching missions:", error);
//       return [];
//     }
//   };

  
  
// const express = require("express");
// const cors = require("cors");
// const app = express();

// app.use(express.json());
// app.use(cors());

// let missions = [];

// app.post("/missions", (req, res) => {
//   const newMission = req.body;
//   missions.push(newMission);
//   res.status(201).json({ message: "Mission saved", mission: newMission });
// });

// app.get("/missions", (req, res) => {
//   res.json(missions);
// });

// // 📌 Delete a mission (optional)
// app.delete("/missions/:missionName", (req, res) => {
//     const { missionName } = req.params;
//     missions = missions.filter((m) => m.mission.missionName !== missionName);
//     res.json({ message: `Mission "${missionName}" deleted.` });
//   });
  



export const saveMission = async (payload: any) => {
    const response = await fetch(`${API_URL}/missions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to save mission");
    return response.json();
  };
  
  // 📌 Start the server
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });