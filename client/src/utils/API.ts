import type {User} from '../models/User.js';
//import type {Report} from '../models/Report.js';
//import missionForm from '../components/mission_form.js';

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

// export const newReport= (reportData: Report)=> {
//     return fetch('/api/reports', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(reportData),
//     });
// };

// export const deleteReport= (reportId: string, token: string) => {
//     return fetch(`/api/users/reports/${reportId}`, {
//         method: 'DELETE',
//         headers: {
//             authorization: `Bearer ${token}`,
//         },
//     });
// };

export const newMission= (missionData: missionForm) => {
    return fetch('api/missions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(missionData),
    });
};

export const deleteMission= (missionId: string, token: string) => {
    return fetch(`api/users/missions/${missionId}`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};

export const fetchMissions = async () => {
    try {
      const response = await fetch("https://your-api-url.com/missions");
      return response.json();
    } catch (error) {
      console.error("Error fetching missions:", error);
      return [];
    }
  };

  
  
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

let missions = [];

app.post("/missions", (req, res) => {
  const newMission = req.body;
  missions.push(newMission);
  res.status(201).json({ message: "Mission saved", mission: newMission });
});

app.get("/missions", (req, res) => {
  res.json(missions);
});

// 📌 Delete a mission (optional)
app.delete("/missions/:missionName", (req, res) => {
    const { missionName } = req.params;
    missions = missions.filter((m) => m.mission.missionName !== missionName);
    res.json({ message: `Mission "${missionName}" deleted.` });
  });
  
  // 📌 Start the server
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });