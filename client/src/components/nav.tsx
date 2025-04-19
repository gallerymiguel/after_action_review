// src/components/NavigationBar.tsx

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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Home as HomeIcon,
  RateReview,
  LibraryBooks,
  ExitToApp,
  Login as LoginIcon,
  AccountCircle,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Auth from "../utils/auth";

const NavigationBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isLoggedIn = Auth.loggedIn();
  const navigate = useNavigate();

  const handleLogout = () => {
    Auth.logout();
    navigate("/home", { replace: true });
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/home" },
    { text: "New Review", icon: <RateReview />, path: "/mission/new" },
    { text: "My Reviews", icon: <LibraryBooks />, path: "/myreviews" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const desktopButtons = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {menuItems.map(({ text, icon, path }) => (
        <Button
          key={text}
          component={Link as React.ElementType}
          to={path}
          replace
          startIcon={icon}
          color="inherit"
          sx={{
            mx: 1,
            textTransform: "none",
            "&:hover": { backgroundColor: "primary.dark", color: "white" },
          }}
        >
          {text}
        </Button>
      ))}

      {isLoggedIn ? (
        <Button
          onClick={handleLogout}
          startIcon={<ExitToApp />}
          color="inherit"
          sx={{
            mx: 1,
            textTransform: "none",
            "&:hover": { backgroundColor: "primary.dark", color: "white" },
          }}
        >
          Log Out
        </Button>
      ) : (
        <>
          <Button
            component={Link as React.ElementType}
            to="/login"
            replace
            startIcon={<LoginIcon />}
            color="inherit"
            sx={{
              mx: 1,
              textTransform: "none",
              "&:hover": { backgroundColor: "primary.dark", color: "white" },
            }}
          >
            Log In
          </Button>
          <Button
            component={Link as React.ElementType}
            to="/register"
            replace
            startIcon={<AccountCircle />}
            color="inherit"
            sx={{
              mx: 1,
              textTransform: "none",
              "&:hover": { backgroundColor: "primary.dark", color: "white" },
            }}
          >
            Sign Up
          </Button>
        </>
      )}
    </Box>
  );

  const mobileDrawer = (
    <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
      <List sx={{ width: 250 }}>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem
            key={text}
            button
            component={Link as React.ElementType}
            to={path}
            replace
            onClick={handleDrawerToggle}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}

        {isLoggedIn ? (
          <ListItem
            button
            onClick={() => {
              handleLogout();
              handleDrawerToggle();
            }}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItem>
        ) : (
          <>
            <ListItem
              button
              component={Link as React.ElementType}
              to="/login"
              replace
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Log In" />
            </ListItem>
            <ListItem
              button
              component={Link as React.ElementType}
              to="/register"
              replace
              onClick={handleDrawerToggle}
            >
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: 1301 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontSize: "1.8rem", fontWeight: "bold" }}>
            AAR Platform
          </Typography>

          {isMobile ? (
            <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            desktopButtons
          )}
        </Toolbar>
      </Container>

      {mobileDrawer}
    </AppBar>
  );
};

export default NavigationBar;
