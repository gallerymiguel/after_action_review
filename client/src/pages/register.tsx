import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "../graphql/mutations";
import { Container, TextField, Button, Typography, Paper, Box, Grid } from "@mui/material";

const CreateAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // ✅ Apollo Client mutation hook
  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const { data } = await registerUser({
        variables: {
          registerInput: {
            username: formState.username,
            email: formState.email,
            password: formState.password,
          },
        },
      });

      // ✅ Store token in localStorage
      localStorage.setItem("token", data.register.token);

      // ✅ Dispatch global auth event to update state in Navigation
      window.dispatchEvent(new Event("authChange"));

      // ✅ Redirect to /home after successful registration
      navigate("/");
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, width: "100%" }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Create Account</Typography>
        </Box>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                variant="outlined"
                value={formState.username}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                variant="outlined"
                value={formState.email}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                value={formState.password}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                variant="outlined"
                value={formState.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                {loading ? "Registering..." : "Register"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Error message */}
        {error && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default CreateAccountPage;