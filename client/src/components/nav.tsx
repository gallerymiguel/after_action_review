import React, { useState } from "react";
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
  Login,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";
import Auth from "../utils/auth"; // Import Auth to check login status

const NavigationBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isLoggedIn = Auth.loggedIn(); // Check login status

  // Define menu items
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "New Review", icon: <RateReview />, path: "/review" },
    { text: "My Reviews", icon: <LibraryBooks />, path: "/myreviews" },
    isLoggedIn
      ? { text: "Logout", icon: <ExitToApp />, action: Auth.logout }
      : { text: "Login", icon: <Login />, path: "/login" },
  ];

  // Handle Mobile Menu Toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 1301 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Title */}
          <Typography variant="h6" sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
            AAR Platform
          </Typography>

          {/* Desktop Menu */}
          {!isMobile ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {menuItems.map((item) =>
                item.action ? (
                  <Button
                    key={item.text}
                    startIcon={item.icon}
                    color="inherit"
                    onClick={() => {
                      item.action();
                      window.location.assign("/"); // Redirect after logout
                    }}
                    sx={{
                      mx: 1,
                      "&:hover": { backgroundColor: "primary.dark", color: "white" },
                    }}
                  >
                    {item.text}
                  </Button>
                ) : (
                  <Button
                    key={item.text}
                    component={Link as React.ElementType}
                    to={item.path}
                    startIcon={item.icon}
                    color="inherit"
                    sx={{
                      mx: 1,
                      "&:hover": { backgroundColor: "primary.dark", color: "white" },
                    }}
                  >
                    {item.text}
                  </Button>
                )
              )}

              {/* Show "My Profile" if logged in */}
              {isLoggedIn && (
                <Button
                  component={Link as React.ElementType}
                  to="/profile"
                  startIcon={<AccountCircle />}
                  color="inherit"
                  sx={{
                    mx: 1,
                    "&:hover": { backgroundColor: "primary.dark", color: "white" },
                  }}
                >
                  My Profile
                </Button>
              )}
            </Box>
          ) : (
            // Mobile Menu Button
            <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={item.path ? (Link as React.ElementType) : "button"}
              to={item.path}
              onClick={() => {
                if (item.action) {
                  item.action();
                  window.location.assign("/");
                }
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default NavigationBar;
