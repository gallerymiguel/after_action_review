import React, { useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SINGLE_MISSION } from "../utils/queries";
import { SAVE_MISSION } from "../utils/mutations";
import Auth from "../utils/auth";

const ReviewPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const location = useLocation<{ draft?: any }>();
  const navigate = useNavigate();
  const reviewRef = useRef<HTMLDivElement>(null);
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  // Check if we have an unsaved draft
  const draft = location.state?.draft;

  // If no draft, fetch the saved mission by ID
  const { loading, error, data } = useQuery(GET_SINGLE_MISSION, {
    skip: !!draft,
    variables: { id },
  });

  // GraphQL mutation for saving when draft
  const [saveMission] = useMutation(SAVE_MISSION, {
    onCompleted: (res) => {
      const newId = res.saveMission._id;
      navigate(`/mission/${newId}`); // go to the saved URL
    },
    onError: (err) => {
      // if not authenticated, show login dialog
      if (err.message.includes("Not authenticated")) {
        setShowLoginDialog(true);
      } else {
        alert("Error saving mission.");
      }
    },
  });

  if (!draft && loading) return <Typography>Loading…</Typography>;
  if (!draft && error)
    return <Typography color="error">Failed to load mission.</Typography>;

  // Choose data source: draft or fetched
  const missionData = draft || data?.mission;
  const { mission, events, summary, hero } = draft ?? {
    mission: {
      missionName: missionData.missionName,
      missionDate: missionData.missionDate,
      missionUnit: missionData.missionUnit,
    },
    events: missionData.events,
    summary: missionData.summary,
    hero: missionData.hero,
  };

  // PDF handler (unchanged)
  const handleDownloadPDF = async () => {
    if (!reviewRef.current) return;
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 210;
    const pdfHeight = 297;
    const canvas = await html2canvas(reviewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    let imgWidth = pdfWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;
    if (imgHeight > pdfHeight - 20) {
      let heightLeft = imgHeight,
        position = 0;
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
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
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
            margin: "50px auto",
          }}
        >
          <Box
            ref={reviewRef}
            sx={{
              padding: 4,
              width: "100%",
              maxWidth: "600px",
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
                  <strong>Mission Date:</strong>{" "}
                  {mission.missionDate
                    ? new Date(mission.missionDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : "No date provided"}
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
              events.map((event: any, index: number) => (
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
                      {event.sustainDetails.map(
                        (sustain: string, i: number) => (
                          <Typography key={i}>- {sustain}</Typography>
                        )
                      )}
                    </Box>
                  )}

                  {/* Improvement Section */}
                  {event.improveDetailsArray &&
                    event.improveDetailsArray.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">Improvements:</Typography>
                        {event.improveDetailsArray.map(
                          (improve: any, i: number) => (
                            <Box
                              key={i}
                              sx={{
                                mt: 1,
                                p: 1,
                                borderBottom: "1px solid lightgray",
                              }}
                            >
                              <Typography>
                                <strong>Observation:</strong>{" "}
                                {improve.observation}
                              </Typography>
                              <Typography>
                                <strong>How to Fix:</strong> {improve.howToFix}
                              </Typography>
                              <Typography>
                                <strong>Who Will Fix:</strong>{" "}
                                {improve.whoWillFix}
                              </Typography>
                              <Typography>
                                <strong>When Will Fix:</strong>{" "}
                                {improve.whenWillFix}
                              </Typography>
                            </Box>
                          )
                        )}
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

          <Box /* button toolbar */>
            <Button onClick={() => navigate(-1)}>🔙 Back to Form</Button>
            <Button onClick={handleDownloadPDF}>📥 Download PDF</Button>

            {/* Show “Save to Profile” only when it’s a draft */}
            {draft && (
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  // If not logged in, prompt first
                  if (!Auth.loggedIn()) {
                    setShowLoginDialog(true);
                    return;
                  }
                  // Otherwise run the mutation
                  saveMission({
                    variables: {
                      input: {
                        missionName: mission.missionName,
                        missionDate: mission.missionDate,
                        missionUnit: mission.missionUnit,
                        summary,
                        hero,
                        events: events.map((e) => ({
                          eventName: e.eventName,
                          sustainDetails: e.sustainDetails,
                          improveDetailsArray: e.improveDetailsArray,
                        })),
                      },
                    },
                  });
                }}
              >
                💾 Save to Profile
              </Button>
            )}
          </Box>
        </Container>
      </Box>

      {/* Simple login prompt dialog */}
      <Dialog open={showLoginDialog} onClose={() => setShowLoginDialog(false)}>
        <DialogTitle>
          You must be logged in to save. Would you like to log in now?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              console.log("[ReviewPage] navigating to login with:", {
                returnTo: location.pathname,
                draft,
              });
              setShowLoginDialog(false);
              navigate("/login", {
                state: { returnTo: location.pathname, draft },
              });
            }}
          >
            Log In
          </Button>
          <Button
            onClick={() => {
              setShowLoginDialog(false);
              navigate("/register", {
                state: {
                  returnTo: location.pathname,
                  draft,
                },
              });
            }}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReviewPage;
