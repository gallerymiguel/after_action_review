// src/pages/login.tsx
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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

// Paste this at the top, before the component:
interface LocationState {
  returnTo?: string;
  draft?: {
    mission: {
      missionName: string;
      missionDate: string;
      missionUnit: string;
    };
    events: Array<{
      eventName: string;
      sustainDetails: string[];
      improveDetailsArray: Array<{
        observation: string;
        howToFix: string;
        whoWillFix: string;
        whenWillFix: string;
      }>;
    }>;
    summary: string;
    hero: string;
  };
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Cast location.state once so TS knows its shape
  const { returnTo, draft } = (location.state ?? {}) as LocationState;
  console.log("[LoginPage] got from location.state:", { returnTo, draft });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [login, { error: mutationError }] = useMutation(LOGIN_USER);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { loginInput: { email, password } },
      });

      if (data?.login?.token) {
        Auth.login(data.login.token);
        console.log("[LoginPage] after successful login, redirecting with:", {
          returnTo,
          draft,
        });
        // If we have a draft, go back to that page with the same draft
        if (draft) {
          navigate(returnTo ?? "/home", { state: { draft } });
        } else {
          navigate(returnTo ?? "/home");
        }
      } else {
        setError("Login failed: no token returned.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Check your credentials.");
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
      <Paper elevation={3} sx={{ p: 3, width: "100%" }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4">Login</Typography>
        </Box>
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
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

        {mutationError && (
          <Box textAlign="center" mt={2}>
            <Typography color="error">{mutationError.message}</Typography>
          </Box>
        )}
        {error && (
          <Box textAlign="center" mt={2}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Box textAlign="center" mt={2}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/register" state={{ returnTo, draft }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
