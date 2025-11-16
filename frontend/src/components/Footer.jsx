import React from "react";
import "../styles/Footer.css";
import { Typography } from "@mui/material";

function Footer() {
  return (
    <footer className="footer">
      <Typography variant="body2">
        © {new Date().getFullYear()} FoodMeds — Eat Well, Stay Well.
      </Typography>
      <Typography variant="body2">
       Disclaimer: FoodMeds provides AI-based dietary insights for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor before making health decisions.‼
      </Typography>
    </footer>
  );
}

export default Footer;
