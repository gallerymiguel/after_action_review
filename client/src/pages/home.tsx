import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_ME } from "../graphql/queries";
import { Container, Typography, CircularProgress, Button } from "@mui/material";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage
  const [shouldRedirect, setShouldRedirect] = useState(false); // ✅ Track redirection

  const { loading, error, data } = useQuery(GET_ME, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    },
    skip: !token, // ✅ Skip query if no token exists
  });

  // ✅ Delay navigation until after first render
  useEffect(() => {
    if (!token) {
      console.warn("❌ No token found. Redirecting to login...");
      setShouldRedirect(true); // ✅ Set state instead of navigating immediately
    }
  }, [token]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/login"); // ✅ Navigate after rendering is done
    }
  }, [shouldRedirect, navigate]);

  if (!token || shouldRedirect) {
    return null; // ✅ Prevents rendering while redirecting
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

  if (error || !data?.me) {
    console.error("❌ Error fetching user data:", error);
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          {error?.message === "❌ Not logged in"
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

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h4">
        Welcome, {data.me?.username || "User"}!
      </Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is your home dashboard. Manage your missions and reviews here.
      </Typography>
    </Container>
  );
};

export default Home;