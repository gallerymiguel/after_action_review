import React from "react";
import CorporateLayout from "./components/corporate_layout"; // Ensure this matches your file name
import MissionForm from './components/mission_form';
        
import "./App.css";

const App: React.FC = () => {
  return (
    <CorporateLayout>
      <MissionForm />
      <h1>Welcome to the Corporate Platform</h1>
      <p>This is the main content area where you can add your application details.</p>
    </CorporateLayout>
  );
};

export default App;
