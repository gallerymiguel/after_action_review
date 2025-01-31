import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Tooltip, Container } from "@mui/material";
import { Home, Assessment, Dashboard, ContactMail } from "@mui/icons-material";
import { Link } from "react-router-dom";

const NavigationBar: React.FC = () => {
  const menuItems = [
    { text: "Home", icon: <Home />, path: "/" },
    { text: "Reviews", icon: <Assessment />, path: "/reviews" },
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Contact", icon: <ContactMail />, path: "/contact" },
  ];

  return (
    <AppBar position="static" color="primary" className="navbar">
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" className="navbar-title" sx={{ flexGrow: 1 }}>
            AAR Platform
          </Typography>
          {menuItems.map((item) => (
            <Tooltip title={item.text} key={item.text}>
              <Button
                component={Link as React.ElementType}
                to={item.path}
                startIcon={item.icon}
                color="inherit"
                sx={{ mx: 1 }}
              >
                {item.text}
              </Button>
            </Tooltip>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavigationBar;
