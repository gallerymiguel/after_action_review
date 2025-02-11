import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
  Alert,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const CreateAccountPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // ✅ Email field remains
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [addUser, { error: mutationError }] = useMutation(ADD_USER);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const { data } = await addUser({
        variables: {
          registerInput: {
            username: username,
            email: email,
            password: password,
          },
        },
      });

      console.log("✅ User Created:", data);
      Auth.login(data.register.token);
  
      // Show success message
      setSuccessMessage("🎉 Account created successfully! Redirecting...");
  
      // Wait 2 seconds before navigating to the home page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
  
    } catch (err) {
      console.error("❌ Error Registering User:", err);
      setError("Signup failed. Try again.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Create Account</Typography>
        </Box>
        {/* Success Message */}
        {successMessage && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="success">
              {successMessage}
            </Typography>
          </Box>
        )}
        {/* Show error alert if signup fails */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            {/* Username Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>

            {/* Password Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* GraphQL Mutation Error Message */}
        {mutationError && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="error">
              {mutationError.message}
            </Typography>
          </Box>
        )}

        {/* Link to Login Page */}
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateAccountPage;
