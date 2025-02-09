import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ME } from "../graphql/queries";
import { Container, Typography, CircularProgress, Button } from "@mui/material";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  console.log("🛠 Token Before Query:", token);

  const { loading, error, data } = useQuery(GET_ME, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    skip: !token,
  });

  useEffect(() => {
    console.log("📡 Fetching user data...");
    console.log("🛠 Query Response:", { loading, error, data });

    if (!loading && (!data || !data.me)) {
      console.warn("⚠️ User data is null. Redirecting...");
      navigate("/login");
    }
  }, [loading, data, navigate]);

  if (!token) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          No token found. Redirecting to login...
        </Typography>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading user data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    console.error("❌ Error fetching user data:", error);
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error.message.includes("Not logged in")
            ? "Session expired. Please log in again."
            : "An error occurred. Please try again."}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!data || !data.me) {
    console.warn("⚠️ User data is null. Redirecting...");
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4">Welcome, {data.me.username}!</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is your home dashboard. Manage your missions and reviews here.
      </Typography>
    </Container>
  );
};

export default Home;