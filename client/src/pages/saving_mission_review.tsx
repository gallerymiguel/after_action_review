import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reviewRef = useRef<HTMLDivElement>(null);

  // Retrieve state data safely
  const { mission, events, summary, hero } = location.state || {};

  const handleDownloadPDF = async () => {
    if (!reviewRef.current) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Convert HTML to Canvas
    const canvas = await html2canvas(reviewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    let imgWidth = pdfWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pdfHeight - 20) {
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
    }

    pdf.save("Mission_Review.pdf");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
        padding: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* SINGLE BORDER AROUND REVIEW SECTION */}
        <Box
          ref={reviewRef}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: "800px",
            textAlign: "center",
            border: "2px solid #ddd", // ONLY ONE BORDER
            borderRadius: "10px",
            marginBottom: 4, // Space before buttons
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Mission Review
          </Typography>

          {/* Mission Details */}
          {mission ? (
            <Box sx={{ borderBottom: "2px solid gray", pb: 2, mb: 3 }}>
              <Typography variant="h6">
                <strong>Mission Name:</strong> {mission.missionName}
              </Typography>
              <Typography variant="h6">
                <strong>Mission Date:</strong> {mission.missionDate?.toString()}
              </Typography>
              <Typography variant="h6">
                <strong>Mission Unit:</strong> {mission.missionUnit}
              </Typography>
            </Box>
          ) : (
            <Typography color="error">⚠️ No mission data found.</Typography>
          )}

          {/* Events Section */}
          {events && events.length > 0 ? (
            events.map((event, index) => (
              <Box
                key={index}
                sx={{
                  width: "100%",
                  borderBottom: "1px solid gray",
                  padding: 2,
                  marginBottom: 2,
                  textAlign: "left",
                }}
              >
                <Typography variant="h5">{event.eventName}</Typography>

                {/* Sustain Section */}
                {event.sustainDetails && event.sustainDetails.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="h6">Sustain Details:</Typography>
                    {event.sustainDetails.map((sustain, i) => (
                      <Typography key={i}>- {sustain}</Typography>
                    ))}
                  </Box>
                )}

                {/* Improvement Section */}
                {event.improveDetailsArray &&
                  event.improveDetailsArray.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="h6">Improvements:</Typography>
                      {event.improveDetailsArray.map((improve, i) => (
                        <Box
                          key={i}
                          sx={{
                            mt: 1,
                            p: 1,
                            borderBottom: "1px solid lightgray",
                          }}
                        >
                          <Typography>
                            <strong>Observation:</strong> {improve.observation}
                          </Typography>
                          <Typography>
                            <strong>How to Fix:</strong> {improve.howToFix}
                          </Typography>
                          <Typography>
                            <strong>Who Will Fix:</strong> {improve.whoWillFix}
                          </Typography>
                          <Typography>
                            <strong>When Will Fix:</strong> {improve.whenWillFix}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  )}
              </Box>
            ))
          ) : (
            <Typography color="error">⚠️ No events found.</Typography>
          )}

          {/* Summary & Hero Section */}
          <Box
            sx={{
              mt: 3,
              pt: 3,
              width: "100%",
              textAlign: "left",
            }}
          >
            <Typography variant="h6">
              <strong>Mission Summary:</strong>
            </Typography>
            <Typography>{summary || "No summary provided."}</Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              <strong>Outstanding Contributor:</strong>
            </Typography>
            <Typography>{hero || "No name provided."}</Typography>
          </Box>
        </Box>

        {/* BUTTONS ARE OUTSIDE THE BORDER NOW */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            width: "100%",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
          >
            🔙 Back to Form
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleDownloadPDF}
          >
            📥 Download PDF
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ReviewPage;
