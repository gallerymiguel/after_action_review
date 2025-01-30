import React, { useState } from "react";
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

// Define types for mission details and event entries
interface MissionDetails {
  missionName: string;
  missionDate: Date | null;
  missionUnit: string;
}

interface EventEntry {
  eventName: string;
  type: "sustain" | "improve" | null;
  sustainDetails?: string;
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
  });
  const [summary, setSummary] = useState("");
  const [hero, setHero] = useState("");
  const [showSummaryHero, setShowSummaryHero] = useState(false);
  const [showEventSection, setShowEventSection] = useState(true);

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
    setCurrentEvent({
      ...currentEvent,
      type: e.target.value as "sustain" | "improve",
    });
  };

  // Handles changes to improvement details
  const handleImproveDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (currentEvent.type === "improve") {
      setCurrentEvent({
        ...currentEvent,
        improveDetails: {
          ...currentEvent.improveDetails,
          [e.target.name]: e.target.value,
        },
      });
    }
  };

  // Handles changes to sustain details
  const handleSustainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentEvent.type === "sustain") {
      setCurrentEvent({ ...currentEvent, sustainDetails: e.target.value });
    }
  };

  // Adds an event to the events list
  const addEvent = () => {
    setEvents([...events, currentEvent]);
    setCurrentEvent({ eventName: "", type: null });
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

    // If all fields are valid, submit the form
    alert("Mission form has been saved successfully! ✅");
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
            {currentEvent.type === "sustain" && (
              <TextField
                label="What would you like to sustain?"
                name="sustainDetails"
                value={currentEvent.sustainDetails || ""}
                onChange={handleSustainChange}
                fullWidth
                required
                sx={{ my: 2 }}
              />
            )}

            {currentEvent.type === "improve" && (
              <Box sx={{ my: 2 }}>
                <TextField
                  label="Observation"
                  name="observation"
                  onChange={handleImproveDetailsChange}
                  fullWidth
                  required
                />
                <TextField
                  label="How to Fix"
                  name="howToFix"
                  onChange={handleImproveDetailsChange}
                  fullWidth
                  required
                />
                <TextField
                  label="Who Will Fix?"
                  name="whoWillFix"
                  onChange={handleImproveDetailsChange}
                  fullWidth
                  required
                />
                <TextField
                  label="When Will It Be Fixed?"
                  name="whenWillFix"
                  onChange={handleImproveDetailsChange}
                  fullWidth
                  required
                />
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
        {events.length > 0 && (
          <Box sx={{ width: "100%", mt: 4 }}>
            <Typography variant="h5">Events Added:</Typography>
            {events.map((event, index) => (
              <Box
                key={index}
                sx={{ my: 2, p: 2, border: "1px solid gray", borderRadius: 2 }}
              >
                <Typography variant="h6">{event.eventName}</Typography>
                {event.type === "sustain" && (
                  <Typography>Sustain: {event.sustainDetails}</Typography>
                )}
                {event.type === "improve" && (
                  <>
                    <Typography>
                      Observation: {event.improveDetails?.observation}
                    </Typography>
                    <Typography>
                      How to Fix: {event.improveDetails?.howToFix}
                    </Typography>
                    <Typography>
                      Who Will Fix: {event.improveDetails?.whoWillFix}
                    </Typography>
                    <Typography>
                      When Will Fix: {event.improveDetails?.whenWillFix}
                    </Typography>
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MissionForm;
