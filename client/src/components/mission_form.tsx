import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { fetchMissions } from "../utils/API";

// Define types for mission details and event entries
interface MissionDetails {
  missionName: string;
  missionDate: Date | null;
  missionUnit: string;
}

interface EventEntry {
  eventName: string;
  type: "sustain" | "improve" | null;
  sustainDetails?: string[];
  improveDetails?: {
    observation: string;
    howToFix: string;
    whoWillFix: string;
    whenWillFix: string;
  }[]; // <-- Change improveDetails to an array of objects
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
    improveDetails: {
      observation: "",
      howToFix: "",
      whoWillFix: "",
      whenWillFix: "",
    },
  });
//---- new shit
  const [missions, setMissions] = useState<MissionDetails[]>([]); // Store previous missions
  const navigate = useNavigate();

  useEffect(() => {
    const getMissions = async () => {
      const data = await fetchMissions();
      setMissions(data);
    };
    getMissions();
  }, []);



  //--- end of new shit


  const [summary, setSummary] = useState("");
  const [hero, setHero] = useState("");
  const [showSummaryHero, setShowSummaryHero] = useState(false);
  const [showEventSection, setShowEventSection] = useState(true);
  const [showImprovementSaved, setShowImprovementSaved] = useState(false);
  //const navigate = useNavigate();

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
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedType = e.target.value as "sustain" | "improve";

    setCurrentEvent({
      ...currentEvent,
      type: selectedType,
      sustainDetails:
        selectedType === "sustain" ? [""] : currentEvent.sustainDetails, // Start with 1 sustain field
      improveDetails:
        selectedType === "improve"
          ? {
              observation: [""],
              howToFix: [""],
              whoWillFix: [""],
              whenWillFix: [""],
            }
          : currentEvent.improveDetails, // Start with 1 set of improve fields
    });
  };

  const saveAndNextImprovement = () => {
    if (currentEvent.type === "improve") {
      const updatedImprovements = [
        ...(currentEvent.improveDetailsArray || []),
        currentEvent.improveDetails,
      ];

      setCurrentEvent({
        ...currentEvent,
        improveDetailsArray: updatedImprovements,
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

  // Handles changes to improvement details
  const handleImproveDetailsChange =
    (index: number, field: keyof EventEntry["improveDetails"][0]) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (currentEvent.type === "improve") {
        const updatedImprovements = [...(currentEvent.improveDetails || [])];
        updatedImprovements[index] = {
          ...updatedImprovements[index],
          [field]: e.target.value,
        };

        setCurrentEvent({
          ...currentEvent,
          improveDetails: updatedImprovements,
        });
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

    // Ensure the last improvement is saved before adding event
    const updatedImprovements = [
      ...(currentEvent.improveDetailsArray || []),
      { ...currentEvent.improveDetails } // Include the most recent improvement
    ];

    // Save the event with both sustains and all improvements
    const newEvent: EventEntry = {
      eventName: currentEvent.eventName,
      type: currentEvent.type,
      sustainDetails: [...(currentEvent.sustainDetails || [])],
      improveDetailsArray: updatedImprovements, // Now includes the last entered improvement
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Reset for new event
    setCurrentEvent({
      eventName: "",
      type: null,
      sustainDetails: [""],
      improveDetailsArray: [],
      improveDetails: { observation: "", howToFix: "", whoWillFix: "", whenWillFix: "" },
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

  const handleSaveMission = () => {
    // Check for missing fields
    const newErrors = {
      missionName: !mission.missionName,
      missionDate: !mission.missionDate,
      missionUnit: !mission.missionUnit,
      summary: showSummaryHero && !summary,
      hero: showSummaryHero && !hero,
    };

    setErrors(newErrors);

    // If any field is missing, show an alert and stop submission
    if (Object.values(newErrors).some((error) => error)) {
      alert("⚠️ Please fill out all required fields.");
      return;
    }

    const payload = {
      mission,
      events,
      summary,
      hero,
    };
  
    try {
      const response = await fetch("https://your-api-url.com/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save mission");
      }
  
      alert("Mission form has been saved successfully! ✅");
      navigate("/save_mission", { state: payload });
    } catch (error) {
      console.error("Error saving mission:", error);
      alert("❌ Failed to save mission. Please try again.");
    }
  };

    // If all fields are valid, save the mission and navigate to the review page
    // alert("Mission form has been saved successfully! ✅");
    // navigate("/save_mission", { state: { mission, events: [...events], summary, hero } });
  };


  const formatLabel = (key: string) => {
    const labelMap: { [key: string]: string } = {
      observation: "Observation",
      howToFix: "How to Fix",
      whoWillFix: "Who Will Fix It",
      whenWillFix: "When Will It Be Fixed",
    };
    return labelMap[key] || key; // Default to original key if not found
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "absolute",
        top: 0,
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
            {/* Render radio buttons for Sustain or Improve based on event name entry */}
            {currentEvent.eventName && (
              <FormControl component="fieldset">
                <Typography variant="h6">Sustain or Improve?</Typography>
                <RadioGroup
                  row
                  value={currentEvent.type}
                  onChange={handleTypeChange}
                >
                  <FormControlLabel
                    value="sustain"
                    control={<Radio />}
                    label="Sustain"
                  />
                  <FormControlLabel
                    value="improve"
                    control={<Radio />}
                    label="Improve"
                  />
                </RadioGroup>
              </FormControl>
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
                    {currentEvent.sustainDetails.length > 1 && ( // Only show remove button if there's more than one
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
              color="success"
              sx={{ mt: 3 }}
              onClick={handleSaveMission}
            >
              Save Mission
            </Button>
          </Box>
        )}
        {events.map((event, index) => (
  <Box key={index} sx={{ my: 2, p: 2, border: "1px solid gray", borderRadius: 2 }}>
    <Typography variant="h6">{event.eventName}</Typography>

    {/* Display Sustain Details */}
    {event.sustainDetails?.length > 0 && event.sustainDetails[0] !== "" && (
      <>
        <Typography variant="subtitle1"><strong>Sustain:</strong></Typography>
        {event.sustainDetails.map((sustain, i) => (
          <Typography key={i}>- {sustain}</Typography>
        ))}
      </>
    )}

    {/* Display Improvements */}
    {event.improveDetailsArray && event.improveDetailsArray.length > 0 ? (
      <>
        <Typography variant="subtitle1"><strong>Improvements:</strong></Typography>
        {event.improveDetailsArray.map((improve, i) => (
          <Box key={i} sx={{ mt: 1, p: 1, borderBottom: "1px solid gray" }}>
            <Typography>🔍 <strong>Observation:</strong> {improve.observation}</Typography>
            <Typography>🛠 <strong>How to Fix:</strong> {improve.howToFix}</Typography>
            <Typography>👷 <strong>Who Will Fix:</strong> {improve.whoWillFix}</Typography>
            <Typography>📅 <strong>When Will Fix:</strong> {improve.whenWillFix}</Typography>
          </Box>
        ))}
      </>
    ) : (
      <Typography color="textSecondary">No improvements added.</Typography>
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
  );
//};

export default MissionForm;



//-----------------------------------Messing with API stuff

