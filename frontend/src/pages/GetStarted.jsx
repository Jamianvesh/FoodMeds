import React from "react";
import "../styles/GetStarted.css";
import { Typography, Button, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import heroBg from "../assets/stomach.png";
import { useNavigate } from "react-router-dom";

function Home({ onAboutClick }) {
  const theme = useTheme();
  const navigate = useNavigate(); // ✅ For routing to /auth

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#E3F2FD",
      }}
    >
      {/* Semi-transparent overlay just to help text readability */}
      <div
        className="hero-overlay"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(255,255,255,0) 100%)",
        }}
      ></div>

      {/* Animated text content */}
      <motion.div
        className="hero-text"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="h2"
          fontWeight={700}
          gutterBottom
          sx={{
            color: "#000",
            fontSize: { xs: "2.2rem", md: "3.5rem" },
          }}
        >
          YOU ARE👤
        </Typography>

        <Typography
          variant="h2"
          fontWeight={700}
          gutterBottom
          sx={{
            color: "#388E3C",
            fontSize: { xs: "2.2rem", md: "3.5rem" },
          }}
        >
          WHAT YOU EAT
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 450,
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          "Wants to cure your body from diseases 🤒? FoodMeds is here to help
          you with proper food and makes you aware of compositions of
          fooditems."
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 450,
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          - Smart food. Smarter health. Track what you eat, plan better, and
          stay well with FoodMeds 🍽.
        </Typography>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          {/* 🟢 "Click Me" now navigates to Auth Page */}
          <Button
            variant="contained"
            size="large"
            sx={{
              borderRadius: 20,
              px: 4,
              py: 1.2,
              mr: 2,
              backgroundColor: "#388E3C",
              "&:hover": { backgroundColor: "#2E7D32" },
            }}
            onClick={() => navigate("/auth")}
          >
            Click Me
          </Button>

          {/* 🟢 "Know More" scrolls to About section */}
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderRadius: 20,
              px: 4,
              py: 1.2,
              borderColor: "#388E3C",
              color: "#388E3C",
              "&:hover": {
                backgroundColor: "rgba(56,142,60,0.1)",
              },
            }}
            onClick={onAboutClick}
          >
            Know More
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
