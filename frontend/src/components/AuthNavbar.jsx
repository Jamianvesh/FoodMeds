import React from "react";
import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "../styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthSide } from "../context/AuthContext";

function AuthNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSide } = useAuthSide();

  const handleSignInClick = () => {
    if (location.pathname !== "/auth") navigate("/auth");
    setTimeout(() => setSide("signin"), 100);
  };

  const handleSignUpClick = () => {
    if (location.pathname !== "/auth") navigate("/auth");
    setTimeout(() => setSide("signup"), 100);
  };

  return (
    <AppBar position="fixed" elevation={0} className="navbar">
      <Toolbar className="navbar-toolbar">
        {/* 🔙 Back Button */}
        <div className="navbar-left">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "#143D33" }}
            aria-label="Go back"
          >
            <ArrowBack />
          </IconButton>
        </div>

        {/* 🟢 Auth Buttons */}
        <div className="navbar-right">
          <Button
            color="secondary"
            variant="text"
            sx={{
              fontWeight: 600,
              borderRadius: 20,
              "&:hover": { backgroundColor: "rgba(90,176,176,0.1)" },
            }}
            onClick={handleSignInClick}
          >
            Sign In
          </Button>

          <Button
            color="secondary"
            variant="text"
            sx={{
              fontWeight: 600,
              borderRadius: 20,
              "&:hover": { backgroundColor: "#3D9A6A" },
            }}
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default AuthNavbar;
