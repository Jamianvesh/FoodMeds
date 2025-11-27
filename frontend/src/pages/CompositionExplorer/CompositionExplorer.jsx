// src/pages/CompositionExplorer/CompositionExplorer.jsx
import React, { useEffect, useState } from "react";
import "../../styles/CompositionExplorer.css";
import FoodCard from "./FoodCard";
import FoodModal from "./FoodModal";
import { motion } from "framer-motion";
import { Typography, Box } from "@mui/material";

/**
 * Category list with icons (keeps the emoji/icon style from your friend's Topbar)
 * You can replace the emoji strings with actual SVGs/icons later if you want.
 */
const categories = [
  { id: "fruit", label: "Fruits", icon: "🍎" },
  { id: "root", label: "Other Veggies", icon: "🥕" },
  { id: "grain", label: "Milk Products", icon: "🥛" },
  { id: "leafy", label: "Leafy Veggies", icon: "🥬" },
  { id: "protein", label: "Meat", icon: "🍗" },
];

const apiBase = import.meta.env.VITE_API_URL || "";

export default function CompositionExplorer() {
  const [activeCat, setActiveCat] = useState("grain");
  const [foods, setFoods] = useState([]);
  const [modalFood, setModalFood] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${apiBase}/api/foods?category=${encodeURIComponent(activeCat)}`)
      .then((res) => res.json())
      .then((data) => setFoods(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Error fetching foods:", err);
        setFoods([]);
      })
      .finally(() => setLoading(false));

    // close any open modal when category changes (clean UX)
    setModalFood(null);
  }, [activeCat]);

  return (
    <motion.div
      className="ce-container"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 1 }}>
        🧪 Composition Explorer
      </Typography>

      <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
        Click any food to view its major constituents, vitamins and an estimated calorie value.
      </Typography>

      {/* Category Pills with icons */}
      <Box className="ce-pill-container" role="toolbar" aria-label="categories">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`ce-pill ${activeCat === cat.id ? "active" : ""}`}
            onClick={() => setActiveCat(cat.id)}
            title={cat.label}
          >
            <span className="ce-pill-icon">{cat.icon}</span>
            <span className="ce-pill-text">{cat.label}</span>
          </button>
        ))}
      </Box>

      {/* Grid */}
      <div className="ce-grid">
        {loading ? (
          <div className="ce-empty">Loading items…</div>
        ) : foods.length === 0 ? (
          <div className="ce-empty">No items found in this category.</div>
        ) : (
          foods.map((f, i) => (
            <FoodCard key={f._id ? f._id : i} food={f} onClick={() => setModalFood(f)} />
          ))
        )}
      </div>

      {/* Modal (opens when modalFood is set) */}
      {modalFood && <FoodModal food={modalFood} onClose={() => setModalFood(null)} />}
    </motion.div>
  );
}
