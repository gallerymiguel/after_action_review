import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { GET_USER_MISSIONS } from "../utils/queries";
import { DELETE_MISSION } from "../utils/mutations";
import { useNavigate } from "react-router-dom";

const MyReviews = () => {
  const { loading, error, data } = useQuery(GET_USER_MISSIONS, {
    fetchPolicy: "network-only",
  });  
  const [missionList, setMissionList] = useState([]);
  const [deleteMission] = useMutation(DELETE_MISSION);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.userMissions) {
      setMissionList(data.userMissions);
    }
  }, [data]);

  if (loading) return <Typography>Loading missions...</Typography>;
  if (error)
    return <Typography color="error">Failed to load missions.</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        My Saved Missions
      </Typography>

      {missionList.length === 0 ? (
        <Typography align="center">No saved missions found.</Typography>
      ) : (
        missionList.map((mission: any) => (
          <Paper key={mission._id} sx={{ padding: 3, marginBottom: 2 }}>
            <Typography variant="h6">
              <strong>{mission.missionName}</strong>
            </Typography>
            <Typography>
              Date: {new Date(mission.missionDate).toDateString()}
            </Typography>
            <Typography>Unit: {mission.missionUnit}</Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/mission/${mission._id}`)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.2rem",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  color: "white",
                },
              }}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{
                mt: 2,
                ml: 2,
                px: 4,
                py: 1.5,
                margin: "0 auto",
                fontSize: "1.2rem",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "error.dark",
                  color: "white",
                },
              }}
              onClick={async () => {
                const confirm = window.confirm(
                  "Are you sure you want to delete this mission?"
                );
                if (!confirm) return;

                try {
                  await deleteMission({ variables: { id: mission._id } });
                  setMissionList((prev) =>
                    prev.filter((m) => m._id !== mission._id)
                  );
                } catch (err) {
                  alert("❌ Failed to delete mission");
                  console.error(err);
                }
              }}
            >
              Delete
            </Button>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default MyReviews;
