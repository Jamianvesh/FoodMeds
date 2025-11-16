import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar({ onAboutClick }) {
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" elevation={0} className="navbar">
      <Toolbar className="navbar-toolbar">
        {/* Left side: Logo + Title */}
        <div className="navbar-left">
          <img src={logo} alt="FoodMeds Logo" className="navbar-logo" />
          <Typography variant="h6" className="navbar-title">
            FoodMeds
          </Typography>
        </div>

        {/* Right side: Buttons */}
        <div className="navbar-right">
          {/* 🟢 "Get Started" now routes to Auth Page */}
          <Button
            color="secondary"
            onClick={() => navigate("/auth")}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 20,
              "&:hover": { backgroundColor: "rgba(90,176,176,0.1)" },
            }}
          >
            Get Started
          </Button>

          {/* 🧭 "About" scrolls to section */}
          <Button
            color="secondary"
            onClick={onAboutClick}
            sx={{
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 20,
              "&:hover": { backgroundColor: "rgba(90,176,176,0.1)" },
            }}
          >
            About
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
