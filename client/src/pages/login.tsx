import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { LOGIN_USER } from "../graphql/mutations";
import { Container, TextField, Button, Typography, Paper, Box, Grid } from "@mui/material";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const { data } = await loginUser({
        variables: { loginInput: formState },
      });

      if (data && data.login.token) {
        console.log("✅ Token received:", data.login.token);
        localStorage.setItem("token", data.login.token); // ✅ Store token
        navigate("/home"); // ✅ Redirect to home
      } else {
        setError("❌ Login failed. No token received.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h4" textAlign="center" mb={3}>Login</Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" name="email" variant="outlined" value={formState.email} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Password" name="password" type="password" variant="outlined" value={formState.password} onChange={handleInputChange} required />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Typography variant="body2" color="error" textAlign="center" mt={2}>
            {error}
          </Typography>
        )}
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Create Account</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;