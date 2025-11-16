import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import DashboardHome from "./DashboardHome";
import CompositionExplorer from "./CompositionExplorer/CompositionExplorer.jsx";
import DietPlanner from "./DietPlanner";
import Chatbot from "./Chatbot";
import ProgressTracker from "./ProgressTracker";
import DiseaseCure from "./DiseaseCure";
import Profile from "./Profile";
import DashboardAbout from "./DashboardAbout";

export default function Dashboard() {
  const [active, setActive] = useState("home");

  const renderPage = () => {
    switch (active) {
      case "composition": return <CompositionExplorer />;
      case "diet": return <DietPlanner />;
      case "chatbot": return <Chatbot />;
      case "progress": return <ProgressTracker />;
      case "disease": return <DiseaseCure />;
      case "profile": return <Profile />;
      case "about": return <DashboardAbout />;
      default: return <DashboardHome />;
    }
  };

  return (
    <DashboardLayout active={active} onSelect={setActive}>
      {renderPage()}
    </DashboardLayout>
  );
}
