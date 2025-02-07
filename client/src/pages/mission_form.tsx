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

// Define types for mission details and event entries
interface MissionDetails {
  missionName: string;
  missionDate: Date | null;
  missionUnit: string;
}

interface ImproveDetails {
  observation: string;
  howToFix: string;
  whoWillFix: string;
  whenWillFix: string;
}

interface EventEntry {
  eventName: string;
  type: "sustain" | "improve" | null;
  sustainDetails?: string[];
  improveDetailsArray?: ImproveDetails[];
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
    improveDetailsArray: [],
  });

  const [summary, setSummary] = useState("");
  const [hero, setHero] = useState("");
  const [showSummaryHero, setShowSummaryHero] = useState(false);
  const [showEventSection, setShowEventSection] = useState(true);
  const [showImprovementSaved, setShowImprovementSaved] = useState(false);

  const navigate = useNavigate();

  // Handles mission input changes
  const handleMissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMission((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handles mission date selection
  const handleDateChange = (date: Date | null) => {
    setMission((prev) => ({ ...prev, missionDate: date }));
  };

  // Handles event input changes
  const handleEventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentEvent({ ...currentEvent, eventName: e.target.value });
  };

  // Handles sustain/improve selection
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedType = e.target.value as "sustain" | "improve";
    setCurrentEvent({
      ...currentEvent,
      type: selectedType,
      sustainDetails: selectedType === "sustain" ? [""] : [],
      improveDetailsArray: selectedType === "improve" ? [] : [],
    });
  };

  // Handles adding an improvement entry
  const saveAndNextImprovement = () => {
    if (currentEvent.type === "improve") {
      setCurrentEvent((prev) => ({
        ...prev,
        improveDetailsArray: [...(prev.improveDetailsArray || []), {
          observation: "",
          howToFix: "",
          whoWillFix: "",
          whenWillFix: "",
        }],
      }));
      setShowImprovementSaved(true);
      setTimeout(() => setShowImprovementSaved(false), 3000);
    }
  };

  // Handles adding an event
  const addEvent = () => {
    if (!currentEvent.eventName.trim()) {
      alert("⚠️ Event Name is required before saving.");
      return;
    }

    setEvents([...events, currentEvent]);

    // Reset for new event
    setCurrentEvent({
      eventName: "",
      type: null,
      sustainDetails: [""],
      improveDetailsArray: [],
    });
  };

  // Handles deleting an event
  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));

    if (events.length === 1) {
      setShowSummaryHero(false);
      setShowEventSection(true);
    }
  };

  // Handles saving the mission
  const handleSaveMission = async () => {
    if (!mission.missionName || !mission.missionDate || !mission.missionUnit || (showSummaryHero && (!summary || !hero))) {
      alert("⚠️ Please fill out all required fields.");
      return;
    }

    const payload = { mission, events, summary, hero };

    try {
      const response = await fetch("https://your-api-url.com/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to save mission. Status: ${response.status}`);

      alert("Mission form has been saved successfully! ✅");
      navigate("/save_mission", { state: await response.json() });
    } catch (error) {
      console.error("Error saving mission:", error);
      alert("❌ Failed to save mission. Please try again.");
    }
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

        <TextField label="Mission Name" name="missionName" value={mission.missionName} onChange={handleMissionChange} fullWidth required sx={{ my: 1 }} />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker label="Mission Date" value={mission.missionDate} onChange={handleDateChange} />
        </LocalizationProvider>
        <TextField label="Mission Unit" name="missionUnit" value={mission.missionUnit} onChange={handleMissionChange} fullWidth required sx={{ my: 1 }} />

        {showEventSection && (
          <>
            <Typography variant="h5">Add Events</Typography>
            <TextField label="Event Name" value={currentEvent.eventName} onChange={handleEventChange} fullWidth required sx={{ my: 2 }} />
            <FormControl component="fieldset">
              <Typography variant="h6">Sustain or Improve?</Typography>
              <RadioGroup row value={currentEvent.type} onChange={handleTypeChange}>
                <FormControlLabel value="sustain" control={<Radio />} label="Sustain" />
                <FormControlLabel value="improve" control={<Radio />} label="Improve" />
              </RadioGroup>
            </FormControl>
            <Button onClick={addEvent} variant="contained" color="primary" sx={{ mt: 2 }}>
              Add Event
            </Button>
          </>
        )}

        <Button variant="contained" color="success" sx={{ mt: 3 }} onClick={handleSaveMission}>
          Save Mission
        </Button>
      </Container>
    </Box>
  );
};

export default MissionForm;
