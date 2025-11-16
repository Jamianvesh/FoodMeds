// src/pages/CompositionExplorer/FoodCard.jsx
import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import "../../styles/CompositionExplorer.css";

const apiBase = import.meta.env.VITE_API_URL || "";

export default function FoodCard({ food, onClick }) {
  const imageUrl = `${apiBase}${food.imageUrl}`;

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.22 }}>
      <Card onClick={onClick} className="ce-card" role="button" tabIndex={0}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={food.name}
          className="ce-card-img"
        />

        <CardContent className="ce-card-content">
          <Typography variant="h6" fontWeight={700} align="center" className="ce-card-title">
            {food.name}
          </Typography>

          <Typography
            align="center"
            sx={{ mt: 1, fontSize: 13, color: "#4CAF7D", fontWeight: 600 }}
          >
            View Details →
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
}
