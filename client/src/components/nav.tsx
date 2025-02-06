import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Home, RateReview, LibraryBooks, ExitToApp, Login, Menu as MenuIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";

const NavigationBar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "New Review", icon: <RateReview />, path: "/review" },
    { text: "My Reviews", icon: <LibraryBooks />, path: "/myreviews" },
    { text: "Login", icon: <Login />, path: "/login" }

  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
                  sx={{
                    mx: 1,
                    "&:hover": {
                      backgroundColor: "primary.dark",
                      color: "white",
                    },
                  }}
                  key={item.text}
                >
                  {item.text}
                </Button>
              ))}
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
            <ListItem button component={Link as React.ElementType} to={item.path} key={item.text} onClick={handleDrawerToggle}>
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
