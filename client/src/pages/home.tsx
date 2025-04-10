<<<<<<< HEAD
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Auth from "../utils/auth"; // Import Auth to get user info

const Home: React.FC = () => {
  const user = Auth.loggedIn() ? Auth.getProfile() : null; // Get logged-in user

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
            <Button variant="contained" color="primary" href="/login">
              Get Started
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;
=======
import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Auth from "../utils/auth"; // Import Auth to get user info

const Home: React.FC = () => {
  const user = Auth.loggedIn() ? Auth.getProfile() : null; // Get logged-in user

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
            <Button variant="contained" color="primary" href="/login">
              Get Started
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Home;
>>>>>>> 9a20c4f775b653321cfb348e698a4850a9212902
