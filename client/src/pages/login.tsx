import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grid,
} from "@mui/material";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
import Auth from "../utils/auth";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
  const [login, { error: mutationError }] = useMutation(LOGIN_USER);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const { data } = await login({
        variables: {
          loginInput: { email, password },
        },
      });
  
      console.log("🔍 Full Response from GraphQL:", data);
  
      if (data && data.login && data.login.token) {
        console.log("✅ Login Successful. Token:", data.login.token);
        Auth.login(data.login.token);
        navigate("/");
      } else {
        console.error("❌ No Token Returned from Server");
        setError("Login failed. No token received.");
      }
    } catch (err) {
      console.error("❌ Login Error:", err);
      setError("Login failed. Check your credentials.");
    }
  };

  console.log("🔍 Sending Login Input:", { loginInput: { email, password } });


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
          <Typography variant="h4">Login</Typography>
        </Box>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            {/* Email Field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
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
                Login
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Error Message */}
        {mutationError && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="error">
              {mutationError.message}
            </Typography>
          </Box>
        )}

        {/* Show Custom Error */}
        {error && (
          <Box textAlign="center" mt={2}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Box>
        )}
        {/* Link to Signup Page */}
        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Sign up</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
