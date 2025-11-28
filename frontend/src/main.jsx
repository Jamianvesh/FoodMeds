import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
// 🌿 Mint Green + Aqua Blue Hybrid Theme (original balanced colors)
const theme = createTheme({
  palette: {
    primary: { main: "#4CAF7D" },      // green
    secondary: { main: "#56a1cfff" },    // aqua blue
    background: { default: "#f5f6fa" }, // ✅ reverted to your original neutral background
    text: { primary: "#143D33", secondary: "#2B5C56" },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          transition: "0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
