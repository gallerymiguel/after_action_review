import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";

const LandingPage: React.FC = () => {
  return (
    <Container maxWidth="md" className="home-container">
      <Box textAlign="center" mt={5}>
        <Typography variant="h2" gutterBottom>
          Welcome to the After Action Review (AAR) Platform
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          A structured process to analyze what happened, why it happened, and how it can be improved.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="/login"
          sx={{
            '&:hover': {
              backgroundColor: 'primary.dark', 
              color: 'white',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default LandingPage;
