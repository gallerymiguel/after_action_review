import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // ✅ Check if user is logged in
  const isAuthenticated = !!localStorage.getItem("token");

  // ✅ Handle Button Click (Dynamic Redirect)
  const handleRedirect = () => {
    if (isAuthenticated) {
      navigate("/review"); // ✅ Redirect to Review Page if logged in
    } else {
      navigate("/login"); // ✅ Redirect to Login Page if logged out
    }
  };

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
        onClick={handleRedirect} // ✅ Handle dynamic redirect
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
        {isAuthenticated ? "New Review" : "Get Started"}
        {/* ✅ Button text changes dynamically */}
      </Button>
    </Container>
  );
};

export default LandingPage;