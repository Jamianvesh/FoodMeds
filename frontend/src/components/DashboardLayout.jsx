import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Divider,
  Tooltip,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Button
} from "@mui/material";

import {
  Menu as MenuIcon,
  Logout,
  Info,
  Dashboard,
  Restaurant,
  Psychology,
  Chat,
  Healing,
  Timeline
} from "@mui/icons-material";

import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Dashboard.css";

// Slide animation for popup
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const menuItems = [
  { text: "Dashboard 🏠", icon: <Dashboard />, key: "home" },
  { text: "Composition Explorer 🧪", icon: <Psychology />, key: "composition" },
  { text: "Diet Planner 🍽️", icon: <Restaurant />, key: "diet" },
  { text: "AI Chatbot 🤖", icon: <Chat />, key: "chatbot" },
  { text: "Progress Tracker 📊", icon: <Timeline />, key: "progress" },
  { text: "Disease Cure 💊", icon: <Healing />, key: "disease" },
  { text: "About ℹ️", icon: <Info />, key: "about" },
  { text: "Logout 🚪", icon: <Logout />, key: "logout" }
];

export default function DashboardLayout({ children, onSelect, active }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sidebarRef = useRef();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");



  // Load sidebar state
  useEffect(() => {
    const saved = localStorage.getItem("sidebarExpanded");
    if (saved === "true") setIsExpanded(false);
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", isExpanded);
  }, [isExpanded]);

  // Outside click to close drawer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  useEffect(() => {
  const stored = sessionStorage.getItem("user");
  if (stored) {
    const parsed = JSON.parse(stored);
    setUsername(parsed.name || "");
    setProfilePic(parsed.profilePic || "");
  }

  const handleStorage = () => {
    const updated = sessionStorage.getItem("user");
    if (updated) {
      const parsed = JSON.parse(updated);
      setUsername(parsed.name || "");
      setProfilePic(parsed.profilePic || "");
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Actual logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Box className="dashboard-container">

      {/* ===== AppBar ===== */}
      <AppBar position="fixed" elevation={0} className="navbar">
        <Toolbar className="navbar-toolbar">
          <Box className="navbar-left">
            <img src={logo} alt="FoodMeds Logo" className="navbar-logo" />
            <Typography variant="h6" className="navbar-title">
              FoodMeds
            </Typography>
          </Box>

          <Box className="navbar-right">
            <IconButton onClick={() => onSelect("profile")} sx={{ p: 0 }}>
              <Avatar
                alt={username}
                src={profilePic || ""}
                sx={{ width: 36, height: 36, bgcolor: "#4CAF7D" }}
              >
                {!profilePic && username?.[0]}
              </Avatar>

            </IconButton>

            {/* NAVBAR LOGOUT → OPEN POPUP */}
            <IconButton
              onClick={() => setLogoutOpen(true)}
              sx={{
                ml: 1,
                background: "transparent",
                color: "#143D33",
                "&:hover": { backgroundColor: "rgba(76,175,125,0.1)" }
              }}
            >
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ===== Fixed Collapsed Sidebar ===== */}
      <Box className="collapsed-sidebar">
        <Box className="sidebar-icons">

          {/* Menu Icon */}
          <IconButton
            onClick={() => setIsExpanded(true)}
            sx={{ color: "#143D33", mb: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Sidebar Icons */}
          {menuItems.map((item) => (
            <Tooltip key={item.key} title={item.text} placement="right">
              <IconButton
                onClick={() =>
                  item.key === "logout"
                    ? setLogoutOpen(true)
                    : onSelect(item.key)
                }
                className={`sidebar-icon-btn ${active === item.key ? "active" : ""}`}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>

      {/* ===== Overlay Backdrop ===== */}
      <Backdrop
        open={isExpanded}
        onClick={() => setIsExpanded(false)}
        sx={{
          zIndex: 1099,
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(5px)"
        }}
      />

      {/* ===== Overlay Expanded Sidebar ===== */}
      <AnimatePresence>
        {isExpanded && (
          <motion.aside
            ref={sidebarRef}
            className="overlay-sidebar"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <Box className="drawer-content">

              <Box
                className="menu-header"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 1,
                  mt: 1,
                  mb: 1
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#143D33"
                  sx={{ ml: 1 }}
                >
                  Hello 👋
                </Typography>

                <IconButton
                  onClick={() => setIsExpanded(false)}
                  sx={{ color: "#143D33" }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 1 }} />

              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.key} disablePadding>
                    <ListItemButton
                      className={`drawer-item ${active === item.key ? "active" : ""}`}
                      onClick={() => {
                        if (item.key === "logout") setLogoutOpen(true);
                        else onSelect(item.key);
                        setIsExpanded(false);
                      }}
                    >
                      <ListItemIcon sx={{ color: "#388E3C", minWidth: 35 }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>

              {/* Greeting Footer */}
              <Box
                className="sidebar-greeting"
                sx={{
                  mt: "auto",
                  p: 2,
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  textAlign: "center",
                  color: "#143D33",
                  opacity: 0.9
                }}
              >
                <Typography variant="body1">
                  Hey!! {username} 😊
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: "#459ae0ff" }}>
                  Great to see you 🌿
                </Typography>
              </Box>
            </Box>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ===== Main Body + Footer ===== */}
      <Box className="dashboard-fixed-body">
        <Box className="dashboard-content-wrapper">{children}</Box>
        <Footer />
      </Box>

      {/*  LOGOUT CONFIRMATION POPUP (BEAUTIFUL + ANIMATED) */}
      <Dialog
        open={logoutOpen}
        TransitionComponent={Transition}
        onClose={() => setLogoutOpen(false)}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px) saturate(100%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)"  
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 4,
            padding: 1,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            color: "#143D33",
            textAlign: "center"
          }}
        >
         ⚠️Confirm Logout ? 
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center", pb: 1 }}>
          <Typography sx={{ fontSize: "15px", color: "#333" }}>
            Are you sure you want to logout from FoodMeds?
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            onClick={() => setLogoutOpen(false)}
            variant="contained"
            color="info"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              backgroundColor: "#26d66dff",
              "&:hover": { backgroundColor: "#57ba73ff" }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              fontWeight: 600,
              backgroundColor: "#d32f2f",
              "&:hover": { backgroundColor: "#b71c1c" }
            }}
            onClick={() => {
              setLogoutOpen(false);
              handleLogout();
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
