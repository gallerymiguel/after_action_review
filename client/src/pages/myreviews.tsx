import React from "react";
import { useQuery } from "@apollo/client";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { GET_USER_MISSIONS } from "../utils/queries";
import { useNavigate } from "react-router-dom";


const MyReviews = () => {
  const { loading, error, data } = useQuery(GET_USER_MISSIONS);
  const missions = data?.userMissions || [];
  const navigate = useNavigate();
  
  if (loading) return <Typography>Loading missions...</Typography>;
  if (error) return <Typography color="error">Failed to load missions.</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        My Saved Missions
      </Typography>

      {missions.length === 0 ? (
        <Typography align="center">No saved missions found.</Typography>
      ) : (
        missions.map((mission: any) => (
          <Paper key={mission._id} sx={{ padding: 3, marginBottom: 2 }}>
            <Typography variant="h6">
              <strong>{mission.missionName}</strong>
            </Typography>
            <Typography>Date: {new Date(mission.missionDate).toDateString()}</Typography>
            <Typography>Unit: {mission.missionUnit}</Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/mission/${mission._id}`)}
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
