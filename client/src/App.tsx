import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MissionForm from "./components/mission_form";
import SavingMissionReview from "./pages/saving_mission_review";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MissionForm />} />
        <Route path="/saving_mission_review" element={<SavingMissionReview />} />
      </Routes>
    </Router>
  );
}

export default App;
