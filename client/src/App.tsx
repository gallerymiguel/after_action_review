import React from "react";
import CorporateLayout from "./components/corporate_layout"; // Ensure this matches your file name
import "./App.css";

const App: React.FC = () => {
  return (
    <CorporateLayout>
      <h1>Welcome to the Corporate Platform</h1>
      <p>This is the main content area where you can add your application details.</p>
    </CorporateLayout>
  );
};

export default App;
