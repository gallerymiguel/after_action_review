import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";

const MyReviews = () => {
  const [missions, setMissions] = useState([]);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/missions/all", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Get token from localStorage
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMissions(data);
        } else {
          alert("Failed to retrieve missions.");
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
      }
    };

    fetchMissions();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        My Saved Missions
      </Typography>

      {missions.length === 0 ? (
        <Typography align="center">No saved missions found.</Typography>
      ) : (
        missions.map((mission) => (
          <Paper key={mission._id} sx={{ padding: 3, marginBottom: 2 }}>
            <Typography variant="h6">
              <strong>{mission.missionName}</strong>
            </Typography>
            <Typography>Date: {new Date(mission.missionDate).toDateString()}</Typography>
            <Typography>Unit: {mission.missionUnit}</Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => alert("View Mission Details Coming Soon!")}
              sx={{ mt: 2 }}
            >
              View Details
            </Button>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default MyReviews;
