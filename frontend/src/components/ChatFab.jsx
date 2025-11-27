// src/components/ChatFab.jsx
import React from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { motion } from "framer-motion";

export default function ChatFab({ onSelect }) {

  // Floating animation
  const floatVariant = {
    animate: {
      x: [-2, -6, -2],        // subtle left movement
      y: [0, -6, 0],          // subtle upward movement
      rotate: [0, 0.8, 0],    // tiny rotation
      transition: {
        duration: 3.6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      },
    },
  };

  return (
    <motion.div
      variants={floatVariant}
      animate="animate"
      style={{
        position: "fixed",
        right: 40,        // nice left shift
        bottom: 40,       // nice upward shift
        zIndex: 9999,
        filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.12))",
      }}
    >
      {/* Main FAB */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => onSelect("chatbot")}
        sx={{
          width: 50,
          height: 50,
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        <ChatIcon sx={{ fontSize: 28 }} />
      </Fab>

      {/* Glowing ring */}
      <div
        style={{
          position: "absolute",
          right: -10,
          bottom: -10,
          width: 70,
          height: 70,
          borderRadius: "50%",
          boxShadow: "0 0 22px 10px rgba(76,175,124,0.25)",
          pointerEvents: "none",
          filter: "blur(2px)",
        }}
      />
    </motion.div>
  );
}
