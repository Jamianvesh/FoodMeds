import React from "react";
import { Typography, Box } from "@mui/material";
import { motion } from "framer-motion";

export default function DashboardHome() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <Box textAlign="center" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700}>🏠 Welcome to Your Dashboard</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Explore your FoodMeds tools below 👇
        </Typography>
      </Box>
    </motion.div>
  );
}
