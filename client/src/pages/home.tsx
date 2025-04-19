// src/pages/home.tsx

import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import Auth from "../utils/auth";

const Home: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    if (Auth.loggedIn()) {
      const profile = Auth.getProfile();
      setUser(profile);
    }
  }, []);

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
              state={{ returnTo: location.pathname }}
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
