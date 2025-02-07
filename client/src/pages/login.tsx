import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import  LOGIN_USER  from "../graphql/mutations";
import { Container, TextField, Button, Typography, Paper, Box, Grid,} from "@mui/material";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // ✅ Apollo Client mutation hook
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({
        variables: {
          loginInput: {
            email: formState.email,
            password: formState.password,
          },
        },
      });

      // ✅ Store token in localStorage
      localStorage.setItem("token", data.login.token);

      // ✅ Redirect to home after successful login
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Login</Typography>
        </Box>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
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
              <Button type="submit" fullWidth variant="contained" color="primary">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;