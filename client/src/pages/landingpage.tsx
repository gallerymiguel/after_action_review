import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container
      maxWidth="md"
      className="home-container"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        px: isMobile ? 2 : 4, 
      }}
    >
      <Typography
        variant={isMobile ? "h4" : "h2"} 
        gutterBottom
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Welcome to the After Action Review (AAR) Platform
      </Typography>

      <Typography
        variant="h6" 
        color="textSecondary"
        paragraph
        sx={{ maxWidth: "600px" }} 
      >
        A structured process to analyze what happened, why it happened, and how it can be improved.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        href="/login"
        sx={{
          px: 4,
          py: 1.5,
          fontSize: "1.2rem",
          borderRadius: "8px",
          '&:hover': {
            backgroundColor: 'primary.dark',
            color: 'white',
          },
        }}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default LandingPage;
