import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import NavigationBar from "../components/nav"; // Adjust the path if needed
// import { useMutation } from "@apollo/client";
// import { SAVE_MISSION } from "../utils/mutations";

// Define types for mission details and event entries
interface MissionDetails {
  missionName: string;
  missionDate: Date | null;
  missionUnit: string;
}

interface EventEntry {
  eventName: string;
  type: "sustain" | "improve" | null;
  improveDetailsArray?: {
    observation: string;
    howToFix: string;
    whoWillFix: string;
    whenWillFix: string;
  }[]; // <-- Change improveDetails to an array of objects
  sustainDetails?: string[];
  improveDetails?: {
    observation: string;
    howToFix: string;
    whoWillFix: string;
    whenWillFix: string;
  };
}

// Main mission form component
const MissionForm: React.FC = () => {
  const [mission, setMission] = useState<MissionDetails>({
    missionName: "",
    missionDate: new Date(),
    missionUnit: "",
  });

  const [events, setEvents] = useState<EventEntry[]>([]);
  const [currentEvent, setCurrentEvent] = useState<EventEntry>({
    eventName: "",
    type: null,
    sustainDetails: [""],
    improveDetails: {
      observation: "",
      howToFix: "",
      whoWillFix: "",
      whenWillFix: "",
    },
  });
  // const [saveMission, { error }] = useMutation(SAVE_MISSION, {
  //   refetchQueries: ["userMissions"], // name of the query you want to refresh
  // });

  const [summary, setSummary] = useState("");
  const [hero, setHero] = useState("");
  const [showSummaryHero, setShowSummaryHero] = useState(false);
  const [showEventSection, setShowEventSection] = useState(true);
  const [showImprovementSaved, setShowImprovementSaved] = useState(false);
  const navigate = useNavigate();

  // Handles changes to mission details
  const handleMissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMission((prev) => ({ ...prev, [name]: value }));
  };

  // Handles date selection
  const handleDateChange = (date: Date | null) => {
    setMission((prev) => ({ ...prev, missionDate: date }));
  };

  // Handles changes to event name
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEvent({ ...currentEvent, eventName: e.target.value });
  };

  // Handles selection between sustain and improve
  // const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedType = e.target.value as "sustain" | "improve";

  //   setCurrentEvent({
  //     ...currentEvent,
  //     type: selectedType,
  //     sustainDetails:
  //       selectedType === "sustain" ? [""] : currentEvent.sustainDetails, // Start with 1 sustain field
  //     improveDetails:
  //       selectedType === "improve"
  //         ? {
  //             observation: "",
  //             howToFix: "",
  //             whoWillFix: "",
  //             whenWillFix: "",
  //           }
  //         : currentEvent.improveDetails, // Start with 1 set of improve fields
  //   });
  // };
  // new: handle switching between Sustain / Improve via Tabs
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: "sustain" | "improve"
  ) => {
    setCurrentEvent((prev) => ({
      ...prev,
      type: newValue,
      // initialize detail arrays appropriately
      ...(newValue === "sustain"
        ? { sustainDetails: prev.sustainDetails ?? [""] }
        : {
            improveDetails: prev.improveDetails ?? {
              observation: "",
              howToFix: "",
              whoWillFix: "",
              whenWillFix: "",
            },
          }),
    }));
  };

  const saveAndNextImprovement = () => {
    if (currentEvent.type === "improve") {
      const updatedImprovements = [
        ...(currentEvent.improveDetailsArray || []),
        currentEvent.improveDetails,
      ];

      setCurrentEvent({
        ...currentEvent,
        improveDetailsArray: updatedImprovements.filter(
          (improve): improve is NonNullable<typeof improve> =>
            improve !== undefined
        ),
        improveDetails: {
          observation: "",
          howToFix: "",
          whoWillFix: "",
          whenWillFix: "",
        },
      });

      // Show the saved message
      setShowImprovementSaved(true);

      // Hide the message after 3 seconds
      setTimeout(() => {
        setShowImprovementSaved(false);
      }, 3000);
    }
  };

  // Handles changes to sustain details
  const handleSustainChange = (index: number, value: string) => {
    if (currentEvent.type === "sustain") {
      const updatedSustains = [...(currentEvent.sustainDetails || [])];
      updatedSustains[index] = value; // Modify only the specific sustain entry
      setCurrentEvent({ ...currentEvent, sustainDetails: updatedSustains });
    }
  };

  const removeSustain = (index: number) => {
    if (currentEvent.type === "sustain") {
      const updatedSustains = [...(currentEvent.sustainDetails || [])];
      updatedSustains.splice(index, 1); // Remove the specific entry
      setCurrentEvent({ ...currentEvent, sustainDetails: updatedSustains });
    }
  };

  // Adds an event to the events list
  const addEvent = () => {
    if (currentEvent.eventName.trim() === "") {
      alert("⚠️ Event Name is required before saving.");
      return;
    }

    // Gather any saved improvements plus the current one
    const allImprovements = [
      ...(currentEvent.improveDetailsArray || []),
      currentEvent.improveDetails,
    ];

    // Filter out any “blank” improvements (where every field is empty)
    const filteredImprovements = allImprovements.filter((improve) =>
      Object.values(improve || {}).some((val) => val.trim() !== "")
    );

    // Build the new event including only real improvements
    const newEvent: EventEntry = {
      eventName: currentEvent.eventName,
      type: currentEvent.type,
      sustainDetails: [...(currentEvent.sustainDetails || [])],
      improveDetailsArray: filteredImprovements.map((improve) => ({
        observation: improve.observation,
        howToFix: improve.howToFix,
        whoWillFix: improve.whoWillFix,
        whenWillFix: improve.whenWillFix,
      })),
    };

    // Add it to the list
    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Reset the form for the next event
    setCurrentEvent({
      eventName: "",
      type: null,
      sustainDetails: [""],
      improveDetailsArray: [],
      improveDetails: {
        observation: "",
        howToFix: "",
        whoWillFix: "",
        whenWillFix: "",
      },
    });
  };

  const removeEvent = (index: number) => {
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);

    // If all events are deleted, bring the user back to adding mode
    if (updatedEvents.length === 0) {
      setShowSummaryHero(false);
      setShowEventSection(true);
    }
  };

  // Toggles visibility of event section and summary
  const handleNoMoreEvents = () => {
    setShowSummaryHero(true);
    setShowEventSection(false);
  };

  // Triggers an alert when saving the mission
  // useState to track errors in the form fields
  const [errors, setErrors] = useState({
    missionName: false,
    missionDate: false,
    missionUnit: false,
    summary: false,
    hero: false,
  });

  // const handleSaveMission = async () => {
  //   const newErrors = {
  //     missionName: !mission.missionName,
  //     missionDate: !mission.missionDate,
  //     missionUnit: !mission.missionUnit,
  //     summary: showSummaryHero && !summary,
  //     hero: showSummaryHero && !hero,
  //   };

  //   setErrors(newErrors);

  //   if (Object.values(newErrors).some((error) => error)) {
  //     alert("⚠️ Please fill out all required fields.");
  //     return;
  //   }

  //   try {
  //     // 1. Save to backend
  //     const { data } = await saveMission({
  //       variables: {
  //         input: {
  //           missionName: mission.missionName,
  //           missionDate: mission.missionDate?.toISOString(),
  //           missionUnit: mission.missionUnit,
  //           summary,
  //           hero,
  //           events: events.map((event) => ({
  //             eventName: event.eventName,
  //             sustainDetails: event.sustainDetails || [],
  //             improveDetailsArray: event.improveDetailsArray || [],
  //           })),
  //         },
  //       },
  //     });

  //     console.log("✅ Mission saved to backend:", data);
  //     const newMissionId = data?.saveMission?._id;

  //     // 2. Navigate to review screen like before
  //     if (newMissionId) {
  //       alert("✅ Mission saved! Redirecting...");
  //       navigate(`/mission/${newMissionId}`);
  //     } else {
  //       alert("❌ Mission saved but could not retrieve ID.");
  //     }
  //   } catch (err) {
  //     console.error("❌ Error saving mission:", err);
  //     alert("An error occurred while saving the mission.");
  //   }
  // };

  return (
    <>
      {/* ✅ Navigation Bar Added */}
      <NavigationBar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
          width: "100vw",
          // position: "absolute",
          paddingTop: 10,
          paddingBottom: 10,
          top: 10,
          left: 0,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            padding: 4,
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Mission Form
          </Typography>

          {/* Mission details input fields */}
          <Box sx={{ mb: 4, p: 2, borderBottom: "2px solid gray" }}>
            <TextField
              label="Mission Name"
              name="missionName"
              value={mission.missionName}
              onChange={handleMissionChange}
              fullWidth
              required
              error={errors.missionName} // 🔴 Highlights red if empty
              helperText={errors.missionName ? "Mission Name is required." : ""} // Shows error message
              sx={{ my: 1 }}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Mission Date"
                value={mission.missionDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    error: errors.missionDate, // 🔴 Highlights red if empty
                    helperText: errors.missionDate
                      ? "Mission Date is required."
                      : "",
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              label="Mission Unit"
              name="missionUnit"
              value={mission.missionUnit}
              onChange={handleMissionChange}
              fullWidth
              required
              error={errors.missionUnit} // 🔴 Highlights red if empty
              helperText={errors.missionUnit ? "Mission Unit is required." : ""}
              sx={{ my: 1 }}
            />
          </Box>

          {/* Conditional rendering for event addition section */}
          {showEventSection && (
            <>
              <Typography variant="h5">Add Events</Typography>
              <TextField
                label="Event Name"
                value={currentEvent.eventName}
                onChange={handleEventChange}
                fullWidth
                required
                sx={{ my: 2 }}
              />
              {/* Render tabs for Sustain or Improve based on event name entry */}
              {currentEvent.eventName && (
                <>
                  <Typography variant="h6">Sustain or Improve?</Typography>
                  <Tabs
                    value={currentEvent.type}
                    onChange={handleTabChange}
                    variant="fullWidth" // each tab spans equally
                    TabIndicatorProps={{ style: { display: "none" } }} // hide the underline
                    sx={{
                      border: "1px solid #ccc",
                      borderRadius: 1,
                      backgroundColor: "background.paper",
                      mb: 2,
                    }}
                  >
                    <Tab
                      label="Sustain"
                      value="sustain"
                      sx={{
                        textTransform: "none",
                        fontWeight:
                          currentEvent.type === "sustain" ? "bold" : "normal",
                        bgcolor:
                          currentEvent.type === "sustain"
                            ? "primary.main"
                            : "grey.100",
                        color:
                          currentEvent.type === "sustain"
                            ? "primary.contrastText"
                            : "text.primary",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "grey.200",
                        },
                      }}
                    />
                    <Tab
                      label="Improve"
                      value="improve"
                      sx={{
                        textTransform: "none",
                        fontWeight:
                          currentEvent.type === "improve" ? "bold" : "normal",
                        bgcolor:
                          currentEvent.type === "improve"
                            ? "primary.main"
                            : "grey.100",
                        color:
                          currentEvent.type === "improve"
                            ? "primary.contrastText"
                            : "text.primary",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: "grey.200",
                        },
                      }}
                    />
                  </Tabs>
                </>
              )}
              {/* Conditionally render input fields based on the selection of sustain or improve */}
              {/* Sustain Input */}
              {currentEvent.type === "sustain" && (
                <>
                  {currentEvent.sustainDetails?.map((sustain, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        my: 2,
                      }}
                    >
                      <TextField
                        label={`Sustain Detail ${index + 1}`}
                        value={sustain}
                        onChange={(e) =>
                          handleSustainChange(index, e.target.value)
                        }
                        fullWidth
                        required
                      />
                      {(currentEvent.sustainDetails?.length ?? 0) > 1 && ( // Only show remove button if there's more than one
                        <Button
                          onClick={() => removeSustain(index)}
                          variant="outlined"
                          color="error"
                        >
                          🗑 Remove
                        </Button>
                      )}
                    </Box>
                  ))}
                  <Button
                    onClick={() =>
                      setCurrentEvent({
                        ...currentEvent,
                        sustainDetails: [
                          ...(currentEvent.sustainDetails || []),
                          "",
                        ], // Add a new empty sustain entry
                      })
                    }
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    ➕ Add Another Sustain
                  </Button>
                </>
              )}

              {/* Improve Inputs */}
              {currentEvent.type === "improve" && (
                <Box sx={{ my: 2 }}>
                  <TextField
                    label="Observation"
                    value={currentEvent.improveDetails?.observation || ""}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        improveDetails: {
                          ...currentEvent.improveDetails,
                          observation: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="How to Fix"
                    value={currentEvent.improveDetails?.howToFix || ""}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        improveDetails: {
                          ...currentEvent.improveDetails,
                          howToFix: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Who Will Fix?"
                    value={currentEvent.improveDetails?.whoWillFix || ""}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        improveDetails: {
                          ...currentEvent.improveDetails,
                          whoWillFix: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="When Will It Be Fixed?"
                    value={currentEvent.improveDetails?.whenWillFix || ""}
                    onChange={(e) =>
                      setCurrentEvent({
                        ...currentEvent,
                        improveDetails: {
                          ...currentEvent.improveDetails,
                          whenWillFix: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    required
                  />
                  {showImprovementSaved && (
                    <Typography color="success" sx={{ mt: 1 }}>
                      ✅ Improvement has been saved!
                    </Typography>
                  )}

                  <Button
                    onClick={saveAndNextImprovement}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    ➡️ Next Improvement
                  </Button>
                </Box>
              )}

              {currentEvent.type && (
                <Button
                  onClick={addEvent}
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Add Event
                </Button>
              )}
              {events.length > 0 && (
                <Button
                  onClick={handleNoMoreEvents}
                  variant="contained"
                  color="secondary"
                  sx={{ mt: 2 }}
                >
                  No More Events
                </Button>
              )}
            </>
          )}

          {/* Summary section shown after events are added */}
          {showSummaryHero && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h4" align="center" gutterBottom>
                Summary
              </Typography>

              <TextField
                fullWidth
                label="Was the mission successful?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                error={errors.summary} // 🔴 Highlights red if empty
                helperText={errors.summary ? "Summary is required." : ""}
              />

              <TextField
                fullWidth
                label="Name of someone who did a great job"
                value={hero}
                onChange={(e) => setHero(e.target.value)}
                error={errors.hero} // 🔴 Highlights red if empty
                helperText={errors.hero ? "Hero Name is required." : ""}
              />

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={() =>
                  navigate("/mission/review", {
                    state: { draft: { mission, events, summary, hero } },
                  })
                }
              >
                Review Mission
              </Button>
            </Box>
          )}
          {events.map((event, index) => (
            <Box
              key={index}
              sx={{ my: 2, p: 2, border: "1px solid gray", borderRadius: 2 }}
            >
              <Typography variant="h6">{event.eventName}</Typography>

              {/* Display Sustain Details */}
              {(event.sustainDetails ?? []).length > 0 &&
                event.sustainDetails?.[0] !== "" && (
                  <>
                    <Typography variant="subtitle1">
                      <strong>Sustain:</strong>
                    </Typography>
                    {event.sustainDetails.map((sustain, i) => (
                      <Typography key={i}>- {sustain}</Typography>
                    ))}
                  </>
                )}

              {/* Display Improvements */}
              {event.improveDetailsArray &&
              event.improveDetailsArray.length > 0 ? (
                <>
                  <Typography variant="subtitle1">
                    <strong>Improvements:</strong>
                  </Typography>
                  {event.improveDetailsArray.map((improve, i) => (
                    <Box
                      key={i}
                      sx={{ mt: 1, p: 1, borderBottom: "1px solid gray" }}
                    >
                      <Typography>
                        🔍 <strong>Observation:</strong> {improve.observation}
                      </Typography>
                      <Typography>
                        🛠 <strong>How to Fix:</strong> {improve.howToFix}
                      </Typography>
                      <Typography>
                        👷 <strong>Who Will Fix:</strong> {improve.whoWillFix}
                      </Typography>
                      <Typography>
                        📅 <strong>When Will Fix:</strong> {improve.whenWillFix}
                      </Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Typography color="textSecondary">
                  No improvements added.
                </Typography>
              )}

              {/* Remove Event Button */}
              <Button
                onClick={() => removeEvent(index)}
                variant="outlined"
                color="error"
                sx={{ ml: 1 }}
              >
                🗑 Remove
              </Button>
            </Box>
          ))}
        </Container>
      </Box>
    </>
  );
};

export default MissionForm;
