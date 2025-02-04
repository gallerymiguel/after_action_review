import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
      <Box>
        <Typography variant="h2" color="error" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Oops! The page you're looking for doesn't exist.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;