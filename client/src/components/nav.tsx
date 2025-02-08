import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Home,
  RateReview,
  LibraryBooks,
  ExitToApp,
  Login as LoginIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom"; // ✅ Import `useLocation`
import { useTheme, useMediaQuery } from "@mui/material";

const NavigationBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Track location changes

  // ✅ Update `isAuthenticated` when `location` changes (ensures state updates after login/logout)
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
  }, [location]);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    setIsAuthenticated(false); // Update state
    navigate("/login"); // Redirect to login page
  };

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "New Review", icon: <RateReview />, path: "/review" },
    { text: "My Reviews", icon: <LibraryBooks />, path: "/myreviews" },
  ];

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Title */}
          <Typography variant="h6" sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
            AAR Platform
          </Typography>

          {/* Desktop Menu */}
          {!isMobile ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {menuItems.map((item) => (
                <Button
                  component={Link as React.ElementType}
                  to={item.path}
                  startIcon={item.icon}
                  color="inherit"
                  sx={{ mx: 1, "&:hover": { backgroundColor: "primary.dark", color: "white" } }}
                  key={item.text}
                >
                  {item.text}
                </Button>
              ))}
              {!isAuthenticated ? (
                <Button component={Link as React.ElementType} to="/login" startIcon={<LoginIcon />} color="inherit" sx={{ mx: 1 }}>
                  Login
                </Button>
              ) : (
                <Button startIcon={<ExitToApp />} color="inherit" sx={{ mx: 1 }} onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Box>
          ) : (
            <IconButton edge="end" color="inherit" onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <ListItem button component={Link as React.ElementType} to={item.path} key={item.text} onClick={() => setMobileOpen(false)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          {!isAuthenticated ? (
            <ListItem button component={Link as React.ElementType} to="/login" onClick={() => setMobileOpen(false)}>
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          ) : (
            <ListItem
              component="div"
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default NavigationBar;