import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 2,
        px: 2,
        backgroundColor: "#1976d2", // matches your navbar
        color: "#ffffff",
        textAlign: "center",
        fontSize: "0.875rem",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} After Action Review Platform | Built by Miguel Urdiales
      </Typography>
    </Box>
  );
};

export default Footer;
