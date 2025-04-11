import React from "react";
import { CssBaseline, Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./components/nav";
import "./App.css";
import Footer from "./components/footer";

// Debug Component to Log Current Location
const DebugLocation: React.FC = () => {
  const location = useLocation();
  console.log("Current Path:", location.pathname);
  return null; // This component doesn't render anything on the UI
};

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <NavigationBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh", // Limit total height to prevent scrolling
          // overflow: "hidden",
        }}
      >
        {/* Main Content Area */}
        <Container
          maxWidth={false}
          sx={{
            width: "100vw",
            maxWidth: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 0,
          }}
        >
          <DebugLocation />
          <Outlet />
        </Container>

        {/* Footer at the bottom */}
        <Footer />
      </Box>
    </>
  );
};

export default App;
