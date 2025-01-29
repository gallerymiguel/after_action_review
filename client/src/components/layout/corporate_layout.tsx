import React, { ReactNode } from "react";
import { AppBar, Toolbar, Typography, Container, Box, CssBaseline, Link } from "@mui/material";

type CorporateLayoutProps = {
  children: ReactNode;
};

const CorporateLayout: React.FC<CorporateLayoutProps> = ({ children }) => {
  return (
    <>
      <CssBaseline />
      {/* Navigation Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AAR Platform
          </Typography>
          <Link href="#" color="inherit" sx={{ mx: 2 }}>Home</Link>
          <Link href="#" color="inherit" sx={{ mx: 2 }}>Reviews</Link>
          <Link href="#" color="inherit" sx={{ mx: 2 }}>Dashboard</Link>
          <Link href="#" color="inherit" sx={{ mx: 2 }}>Profile</Link>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Box sx={{ textAlign: "center", py: 4 }}>{children}</Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, textAlign: "center", mt: 4, bgcolor: "#f5f5f5" }}>
        <Typography variant="body2">&copy; {new Date().getFullYear()} AAR Platform</Typography>
        <Box>
          <Link href="#" sx={{ mx: 1 }}>Privacy</Link>
          <Link href="#" sx={{ mx: 1 }}>Terms</Link>
          <Link href="#" sx={{ mx: 1 }}>Support</Link>
        </Box>
      </Box>
    </>
  );
};

export default CorporateLayout;
