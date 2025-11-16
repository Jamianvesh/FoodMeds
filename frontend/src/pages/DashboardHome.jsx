// DashboardHome.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Pie, Radar, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  LineElement,
} from "chart.js";

// Register ChartJS elements once
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  PointElement,
  RadarController,
  RadialLinearScale,
  LinearScale,
  CategoryScale,
  LineElement
);

/* --------------------- CARD CONFIG --------------------- */
const CARD_ORDER = [
  { key: "BMI", color: "#E6F7E9", text: "#2F7A4A" },
  { key: "BMR", color: "#E8F3FF", text: "#215E93" },
  { key: "IBW", color: "#FFF4D6", text: "#B57F07" },
  { key: "Water", color: "#F1FBFA", text: "#277E8F" },

  { key: "Minerals", color: "#F3FFF6", text: "#2F8A4D" },
  { key: "Vitamins", color: "#FFF8E6", text: "#B27E05" },
  { key: "Fats", color: "#FFF2E6", text: "#C06A12" },
  { key: "Proteins", color: "#F2F8FF", text: "#2C5C86" },
];

const INFO_TEXT = {
  BMI: "Body Mass Index — general fitness indicator.",
  BMR: "Basal Metabolic Rate — calories burned at rest.",
  IBW: "Ideal Body Weight — a healthy target for your height.",
  Water: "Water — essential for hydration & bodily functions.",
  Minerals: "Minerals — important for metabolism & repair.",
  Vitamins: "Vitamins — required in small amounts for health.",
  Fats: "Fats — energy reserve and hormone building blocks.",
  Proteins: "Proteins — needed for repair & muscle growth.",
};

/* --------------------- FUNCTIONS --------------------- */
function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const h = height / 100;
  return (weight / (h * h)).toFixed(2);
}

function calculateBMR(weight, height, age, sex) {
  if (!weight || !height || !age) return null;
  if (sex === "Male")
    return Math.round(66.47 + 13.75 * weight + 5 * height - 6.76 * age);
  return Math.round(655.1 + 9.56 * weight + 1.85 * height - 4.68 * age);
}

function calculateIBW(height, sex) {
  if (!height) return null;
  if (sex === "Male") return Math.round(50 + 0.91 * (height - 152.4));
  return Math.round(45.5 + 0.91 * (height - 152.4));
}

function getBodyComp(age, sex, bmi) {
  let water = sex === "Male" ? 60 : 55;
  let baseFat = sex === "Male" ? 15 : 25;
  let fats =
    bmi < 18.5 ? baseFat - 2 :
    bmi < 25 ? baseFat :
    bmi < 30 ? baseFat + 5 :
    baseFat + 10;

  return {
    water,
    minerals: 5,
    vitamins: 1,
    fats,
    proteins: sex === "Male" ? 19 : 14,
  };
}

/* --------------------- FLIP CARD --------------------- */
function FlipCard({ title, value, color, textColor, info }) {
  const [flip, setFlip] = useState(false);

  return (
    <Box
      sx={{ width: 230, height: 150, perspective: 1000, cursor: "pointer" }}
      onClick={() => setFlip(!flip)}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transition: "0.6s",
          transform: flip ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: 3,
            background: color,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backfaceVisibility: "hidden",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          }}
        >
          <Typography sx={{ color: textColor, fontWeight: 700, fontSize: 18 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 900, mt: 1 }}>
            {value}
          </Typography>
        </Card>

        {/* BACK */}
        <Card
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: "rotateY(180deg)",
            borderRadius: 3,
            backfaceVisibility: "hidden",
            p: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: "#333", fontSize: 16 }}>
            {info}
          </Typography>
        </Card>
      </Box>
    </Box>
  );
}

/* --------------------- MAIN DASHBOARD --------------------- */
export default function DashboardHome() {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [comp, setComp] = useState(null);
  const [bmi, setBMI] = useState(null);
  const [bmr, setBMR] = useState(null);
  const [ibw, setIBW] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("user");
    if (!raw) return;

    const u = JSON.parse(raw);
    setUser(u);

    const BMI = calculateBMI(u.weight, u.height);
    const BMR = calculateBMR(u.weight, u.height, u.age, u.sex);
    const IBW = calculateIBW(u.height, u.sex);

    setBMI(BMI);
    setBMR(BMR);
    setIBW(IBW);
    setComp(getBodyComp(u.age, u.sex, BMI));
  }, []);

  /* Prepare card values */
  const allCards = [];

  if (bmi) allCards.push({ key: "BMI", value: bmi });
  if (bmr) allCards.push({ key: "BMR", value: `${bmr} kcal/day` });
  if (ibw) allCards.push({ key: "IBW", value: `${ibw} kg` });
  if (comp) {
    ["Water", "Minerals", "Vitamins", "Fats", "Proteins"].forEach(key =>
      allCards.push({ key, value: `${comp[key.toLowerCase()]}%` })
    );
  }

  const cards = CARD_ORDER.map(cfg => {
    const found = allCards.find(c => c.key === cfg.key);
    return found ? { ...found, ...cfg } : null;
  }).filter(Boolean);

  /* 4–4 layout */
  const row1 = cards.slice(0, 4);
  const row2 = cards.slice(4, 8);

  /* Chart data */
  const pieData = {
    labels: ["Water", "Minerals", "Vitamins", "Fats", "Proteins"],
    datasets: [
      {
        data: comp ? [
          comp.water, comp.minerals, comp.vitamins, comp.fats, comp.proteins
        ] : [0, 0, 0, 0, 0],
        backgroundColor: ["#4CAF7D", "#B9E4C9", "#FDD835", "#FFA726", "#56a1cf"],
      },
    ],
  };

  const radarData = {
    labels: ["BMI", "BMR", "IBW", "Water", "Minerals", "Vitamins", "Fats", "Proteins"],
    datasets: [
      {
        label: "Normalized",
        data: [
          bmi ? (Number(bmi) / 40) * 100 : 0,
          bmr ? (Number(bmr) / 3000) * 100 : 0,
          ibw ? (Number(ibw) / 120) * 100 : 0,
          comp?.water || 0,
          comp?.minerals || 0,
          comp?.vitamins || 0,
          comp?.fats || 0,
          comp?.proteins || 0,
        ],
        backgroundColor: "rgba(76,175,125,0.14)",
        borderColor: "#4CAF7D",
      },
    ],
  };

  const barData = {
    labels: ["Water", "Minerals", "Vitamins", "Fats", "Proteins"],
    datasets: [
      {
        data: comp ? [
          comp.water, comp.minerals, comp.vitamins, comp.fats, comp.proteins
        ] : [0, 0, 0, 0, 0],
        backgroundColor: ["#4CAF7D", "#B9E4C9", "#FDD835", "#FFA726", "#56a1cf"],
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <Box sx={{ mt:-4, px: 4, py: 4 }}>

        {/* TITLE */}
        <Typography variant="h4" sx={{ fontWeight: 900, color: "#164A41", mb: 2 }}>
          🏠 Welcome to Your Dashboard
        </Typography>

        {/* PERSONAL STATS */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Card
            sx={{
              width: 250,
              p: 3,
              borderRadius: 5,
              background: "#E8FFF0",
              boxShadow: "0 10px 35px rgba(10,40,30,0.1)",
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "20px" }}>
              Personal Stats
            </Typography>
            <Divider sx={{ my: 1 }} />

            {user && (
              <Box sx={{ fontSize: 15, lineHeight: "30px", fontWeight: 500 }}>
                <b>Name:</b> {user.name} <br />
                <b>Age:</b> {user.age} <br />
                <b>Height:</b> {user.height} cm <br />
                <b>Weight:</b> {user.weight} kg <br />
                <b>Sex:</b> {user.sex}
              </Box>
            )}
          </Card>
        </Box>

        {/* INTRO */}
        <Typography sx={{ mb: 1, color: "#446" }}>
          Here are the body composition metrics tailored that a healthy individual like you should aim for :-
        </Typography>
        <Typography sx={{ mb: 3, color: "#446" }}>
          (Click on each card to know about the metric)
        </Typography>

        {/* ROW 1 */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
          {row1.map(c => (
            <FlipCard
              key={c.key}
              title={c.key}
              value={c.value}
              color={c.color}
              textColor={c.text}
              info={INFO_TEXT[c.key]}
            />
          ))}
        </Box>

        {/* ROW 2 */}
        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 5 }}>
          {row2.map(c => (
            <FlipCard
              key={c.key}
              title={c.key}
              value={c.value}
              color={c.color}
              textColor={c.text}
              info={INFO_TEXT[c.key]}
            />
          ))}
        </Box>

        {/* HEALTH TIPS */}
        <Box
          sx={{
            mt: 2,
            p: 3,
            borderRadius: 4,
            background: "#E9FDF1",
            boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <Typography
            sx={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#1E5F4E",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            💡 Health Tip For You
          </Typography>

          <Typography sx={{ fontSize: "17px", fontWeight: 500, color: "#345" }}>
            {bmi && parseFloat(bmi) < 18.5 &&
              "You are underweight. Increase calories with nuts, grains, dairy & protein-rich meals."}

            {bmi && parseFloat(bmi) >= 18.5 && parseFloat(bmi) < 25 &&
              "Great work! Maintain balanced food + regular exercise to stay in this healthy range."}

            {bmi && parseFloat(bmi) >= 25 && parseFloat(bmi) < 30 &&
              "You are slightly overweight. Avoid sugar/fried foods & start daily walking."}

            {bmi && parseFloat(bmi) >= 30 &&
              "BMI is high. Try structured dieting & exercise. Consider a nutritionist consultation."}

            {!bmi && "Enter full details to generate personalized tips."}
          </Typography>
        </Box>

        {/* CHARTS */}
        <Box sx={{ mt: 5 }}>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3
          }}>
            <Card sx={{ p: 2 }}>
              <Typography fontWeight={800} color="#2e7d32">Body Composition</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ height: 260 }}>
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>

            <Card sx={{ p: 2 }}>
              <Typography fontWeight={800} color="#2b6fb3">Body Overview (Radar)</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ height: 260 }}>
                <Radar data={radarData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>

            <Card sx={{ p: 2 }}>
              <Typography fontWeight={800} color="#b86b12">Body % Bar</Typography>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ height: 260 }}>
                <Bar data={barData} options={{ maintainAspectRatio: false }} />
              </Box>
            </Card>
          </Box>
        </Box>

      </Box>
    </motion.div>
  );
}
