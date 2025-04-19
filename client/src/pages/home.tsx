// src/pages/home.tsx
import { Navigate } from "react-router-dom";
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import Auth from "../utils/auth";

const Home: React.FC = () => {
  // No state or useEffect needed—synchronously read auth
  const isLoggedIn = Auth.loggedIn();
  const user = isLoggedIn ? Auth.getProfile() : null;
  if (!isLoggedIn) {
         // kick unauthenticated users to the real landing page
         return <Navigate to="/landingpage" replace />;
       }
       
  return (
    <Container maxWidth="md" className="home-container">
      <Box textAlign="center" mt={5}>
        {user ? (
          <>
            <Typography variant="h4" gutterBottom>
              Welcome, {user.username}!
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              You are now logged in. Start reviewing your missions below.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h2" gutterBottom>
              Welcome to the After Action Review (AAR) Platform
            </Typography>
            <Typography variant="h5" color="textSecondary" paragraph>
              A structured process to analyze what happened, why it happened, and how it can be improved.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Get Started
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;
