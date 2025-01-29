import React, { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, Box, CssBaseline, Link } from "@mui/material";
import "../styles/layout.css";

type CorporateLayoutProps = {
  children: ReactNode;
};

const CorporateLayout: React.FC<CorporateLayoutProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      {/* Navigation Bar */}
      <AppBar position="static" color="primary" className="navbar" sx={{ width: "100%" }}>
        <Toolbar>
          <Typography variant="h6" className="navbar-title">
            Corporate Platform
          </Typography>
          <Link href="#" className="navbar-link">Home</Link>
          <Link href="#" className="navbar-link">About</Link>
          <Link href="#" className="navbar-link">Services</Link>
          <Link href="#" className="navbar-link">Contact</Link>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" className="main-content">
        <Box>{children}</Box>
      </Container>

      {/* Footer */}
      <Box component="footer" className="footer" sx={{ width: "100%" }}>
        <Typography variant="body2">&copy; {new Date().getFullYear()} Corporate Platform</Typography>
        <Box>
          <Link href="#" className="footer-link">Privacy Policy</Link>
          <Link href="#" className="footer-link">Terms of Service</Link>
          <Link href="#" className="footer-link">Support</Link>
        </Box>
      </Box>
    </>
  );
};

export default CorporateLayout;