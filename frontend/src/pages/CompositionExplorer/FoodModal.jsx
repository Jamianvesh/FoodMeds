// src/pages/CompositionExplorer/FoodModal.jsx
import React, { forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Chip,
  Divider,
  Box,
  LinearProgress,
  Stack,
  IconButton,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../../styles/CompositionExplorer.css";

/**
 * Slide transition for the dialog
 */
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const kcalFromProtein = 4;
const kcalFromCarb = 4;
const kcalFromFat = 9;
const kcalFromFiber = 2;

/**
 * Parses "Protein–2.9g" etc.
 */
function parseGrams(label, text) {
  const regex = new RegExp(`${label}\\s*[–:-]?\\s*([0-9]+(?:[.,][0-9]+)?)\\s*g?`, "i");
  const match = text.match(regex);
  if (!match) return null;
  const raw = match[1].replace(",", ".");
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Extract macros + vitamins from description
 */
function extractNutrition(description = "") {
  const txt = description.replace(/\r/g, " ").replace(/\n/g, "; ");

  const protein = parseGrams("protein", txt) ?? parseGrams("proteins", txt);
  const carbs =
    parseGrams("carbohydrate", txt) ??
    parseGrams("carbohydrates", txt) ??
    parseGrams("carb", txt);
  const fat = parseGrams("fat", txt);
  const fiber = parseGrams("fiber", txt);

  // vitamins
  const vitamins = [];
  const vitaminMatches = txt.match(/vitamin\s*[A-Z]?/gi);
  if (vitaminMatches) vitamins.push(...vitaminMatches.map((v) => v.trim()));

  const extraMatches = txt.match(/\b(Folate|Iron|Calcium|Magnesium|Zinc|Potassium)\b/gi);
  if (extraMatches) {
    extraMatches.forEach((e) => {
      if (!vitamins.includes(e)) vitamins.push(e);
    });
  }

  // calorie estimate
  let estCalories = null;
  if (protein != null || carbs != null || fat != null || fiber != null) {
    const p = protein || 0;
    const c = carbs || 0;
    const f = fat || 0;
    const fi = fiber || 0;

    estCalories = Math.round(
      p * kcalFromProtein +
        c * kcalFromCarb +
        f * kcalFromFat +
        fi * kcalFromFiber
    );
  }

  return { protein, carbs, fat, fiber, vitamins, estCalories };
}

/**
 * Label helper
 */
function macroLabel(name, value) {
  if (value == null) return `${name}: —`;
  return `${name}: ${value} g`;
}

export default function FoodModal({ food, onClose }) {
  const nutrition = extractNutrition(food.description || "");
  const imageUrl = `${import.meta.env.VITE_API_URL || ""}${food.imageUrl}`;

  return (
    <Dialog
      open
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: "visible" } }}
    >
      <DialogTitle sx={{ p: 2, pb: 0 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={800}>
            {food.name}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Major Constituents
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* IMAGE */}
        <Box sx={{ width: "100%", mb: 2 }}>
          <img
            src={imageUrl}
            alt={food.name}
            className="ce-modal-img"
            style={{ objectFit: "contain" }}   // FIX CROPPING
          />
        </Box>

        {/* 100g NOTE */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "block", textAlign: "center", mt: -1, mb: 2, opacity: 0.8 }}
        >
          * Nutritional composition shown is for 100 g of the food item.
        </Typography>

        {/* MACRONUTRIENTS */}
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Macronutrients
          </Typography>

          <Stack spacing={1}>
            {/* PROTEIN */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                <Typography variant="body2" fontWeight={700}>
                  {macroLabel("Protein", nutrition.protein)}
                </Typography>
                {nutrition.protein != null && (
                  <Typography variant="body2" color="text.secondary">
                    {nutrition.protein * 4} kcal
                  </Typography>
                )}
              </Box>

              {nutrition.protein != null ? (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, nutrition.protein * 4)}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: "#888", fontStyle: "italic" }}>
                  Not available
                </Typography>
              )}
            </Box>

            {/* CARBS */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                <Typography variant="body2" fontWeight={700}>
                  {macroLabel("Carbs", nutrition.carbs)}
                </Typography>
                {nutrition.carbs != null && (
                  <Typography variant="body2" color="text.secondary">
                    {nutrition.carbs * 4} kcal
                  </Typography>
                )}
              </Box>

              {nutrition.carbs != null ? (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, nutrition.carbs * 3.5)}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: "#888", fontStyle: "italic" }}>
                  Not available
                </Typography>
              )}
            </Box>

            {/* FAT */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                <Typography variant="body2" fontWeight={700}>
                  {macroLabel("Fat", nutrition.fat)}
                </Typography>
                {nutrition.fat != null && (
                  <Typography variant="body2" color="text.secondary">
                    {nutrition.fat * 9} kcal
                  </Typography>
                )}
              </Box>

              {nutrition.fat != null ? (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, nutrition.fat * 8)}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: "#888", fontStyle: "italic" }}>
                  Not available
                </Typography>
              )}
            </Box>

            {/* FIBER */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.7 }}>
                <Typography variant="body2" fontWeight={700}>
                  {macroLabel("Fiber", nutrition.fiber)}
                </Typography>
                {nutrition.fiber != null && (
                  <Typography variant="body2" color="text.secondary">
                    {nutrition.fiber * 2} kcal
                  </Typography>
                )}
              </Box>

              {nutrition.fiber != null ? (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, nutrition.fiber * 10)}
                  sx={{ height: 8, borderRadius: 2 }}
                />
              ) : (
                <Typography variant="caption" sx={{ color: "#888", fontStyle: "italic" }}>
                  Not available
                </Typography>
              )}
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* VITAMINS */}
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Vitamins & Micronutrients
          </Typography>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {nutrition.vitamins.length ? (
              nutrition.vitamins.map((v, i) => (
                <Chip key={i} label={v} className="ce-chip-blue" />
              ))
            ) : (
              <Typography color="text.secondary">Not listed</Typography>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* CALORIES */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={800}>
              Estimated Calories
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              (Based on macros in the description)
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight={900}>
            {nutrition.estCalories != null ? `${nutrition.estCalories} kcal` : "N/A"}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
