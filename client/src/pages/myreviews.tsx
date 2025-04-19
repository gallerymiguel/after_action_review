// src/pages/myreviews.tsx

import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { GET_USER_MISSIONS } from "../utils/queries";
import { DELETE_MISSION } from "../utils/mutations";
import { useNavigate, Link } from "react-router-dom";
import Auth from "../utils/auth";

const MyReviews: React.FC = () => {
  // 1) Gate unauthorized users with a friendly full‑page prompt
  if (!Auth.loggedIn()) {
    return (
      <Box textAlign="center" mt={10} px={2}>
        <Typography variant="h5" gutterBottom>
          You need an account to view your saved reviews.
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ mx: 1, mt: 2 }}
        >
          Log In
        </Button>
        <Button
          component={Link}
          to="/register"
          variant="outlined"
          sx={{ mx: 1, mt: 2 }}
        >
          Sign Up
        </Button>
        <Typography variant="body2" mt={3}>
          Or{" "}
          <Link to="/mission/new" style={{ textDecoration: "underline" }}>
            start a new review
          </Link>{" "}
          right now—no signup required!
        </Typography>
      </Box>
    );
  }

  // 2) Fetch the user's missions
  const { loading, error, data } = useQuery(GET_USER_MISSIONS, {
    fetchPolicy: "network-only",
  });
  const [missionList, setMissionList] = useState<any[]>([]);
  const [deleteMission] = useMutation(DELETE_MISSION);
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.userMissions) {
      setMissionList(data.userMissions);
    }
  }, [data]);

  // 3) Handle loading and error states
  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Container maxWidth="md">
        <Typography color="error" align="center" mt={5}>
          ❌ Failed to load your missions. Please try again later.
        </Typography>
      </Container>
    );

  // 4) Render the list of saved missions
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        My Saved Missions
      </Typography>

      {missionList.length === 0 ? (
        <Typography align="center" mt={4}>
          You haven't saved any missions yet.
        </Typography>
      ) : (
        missionList.map((mission: any) => (
          <Paper key={mission._id} sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {mission.missionName}
            </Typography>
            <Typography>
              Date: {new Date(mission.missionDate).toLocaleDateString()}
            </Typography>
            <Typography>Unit: {mission.missionUnit}</Typography>

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/mission/${mission._id}`)}
                sx={{ mr: 2 }}
              >
                View Details
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={async () => {
                  const confirm = window.confirm(
                    "Are you sure you want to delete this mission?"
                  );
                  if (!confirm) return;
                  try {
                    await deleteMission({
                      variables: { id: mission._id },
                    });
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
            </Box>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default MyReviews;
