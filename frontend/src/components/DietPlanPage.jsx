import { useState, useEffect } from "react";
import MealPlanResults from "./MealPlanResults";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";

const HEALTH_QUOTES = [
  "Let food be thy medicine, and medicine be thy food.",
  "A healthy outside starts from the inside.",
  "Take care of your body. It's the only place you have to live.",
  "Your diet is a bank account. Good food choices are good investments.",
  "Eat well, live well, love well.",
  "An apple a day keeps the doctor away.",
  "Health is wealth.",
  "The greatest wealth is health.",
  "Wellness is not just about what you're eating.",
  "Good nutrition is the foundation of health.",
  "To eat intelligently is an art.",
  "Take time for your health. It's the best investment you can make.",
  "Healthy eating is a form of self-respect.",
  "Nutrition fuels your body, not your desires.",
  "Small changes, big results.",
];

function DietPlanPage() {
  const [form, setForm] = useState({
    disease: "",
    activityStatus: "",
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HEALTH_QUOTES.length);
    setRandomQuote(HEALTH_QUOTES[randomIndex]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    if (!form.disease.trim()) {
      setError("Please enter a disease or health condition");
      setPlan(null);
      return;
    }

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const res = await fetch("http://localhost:5000/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease: form.disease,
          activityStatus: form.activityStatus,
        }),
      });

      const data = await res.json();
      if (data.error || !data.mealPlan || !data.summary || !data.nutrients) {
        setError("NOT FOUND: This disease is not available in our database. Please try another health condition.");
        setPlan(null);
      } else {
        setPlan(data);
      }
    } catch (err) {
      setError("NOT FOUND: Failed to generate meal plan. Please try again.");
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "auto", md: "calc(100vh - 122px)" },
        bgcolor: "#fafbfc",
        display: "grid",
        gridTemplateColumns: "1.13fr 1fr",
        alignItems: "start",
      }}
    >
      {/* Left: Form */}
      <Box
        sx={{
          pt: { xs: 6, md: 13 },
          pl: { xs: 2, md: 13 },
          pr: { xs: 2, md: 8 },
          minHeight: 0, bgcolor: "#fff",
          display: "flex", flexDirection: "column", justifyContent: "flex-start"
        }}
      >
        <form onSubmit={handleGeneratePlan} style={{ width: "100%" }}>
          <Typography variant="h4" color="#22b3aa" mb={4} fontWeight={700}>
            Your Meal Plan
          </Typography>
          <Box mb={3}>
            <InputLabel sx={{ color: "#20b2aa", fontWeight: 600, mb: 1 }}>
              Health Condition / Disease *
            </InputLabel>
            <TextField
              id="disease"
              type="text"
              name="disease"
              placeholder="e.g., Diabetes, Hypertension, Asthma..."
              value={form.disease}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
            />
            <Typography color="#999" fontSize={14}>
              Enter your health condition
            </Typography>
          </Box>
          <Box mb={3}>
            <InputLabel sx={{ color: "#20b2aa", fontWeight: 600, mb: 1 }}>
              Activity Status
            </InputLabel>
            <FormControl fullWidth>
              <Select
                id="activityStatus"
                name="activityStatus"
                value={form.activityStatus}
                onChange={handleChange}
                displayEmpty
                sx={{ background: "#fff" }}
              >
                <MenuItem value="">Select activity status (optional)</MenuItem>
                <MenuItem value="Very Active">Very Active</MenuItem>
                <MenuItem value="Moderately Active">Moderately Active</MenuItem>
                <MenuItem value="Lightly Active">Lightly Active</MenuItem>
                <MenuItem value="Sedentary">Sedentary</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {error && (
            <Paper sx={{
              background: "#ffebee",
              borderLeft: "4px solid #f44336",
              p: 2, mb: 2,
            }}>
              <Typography
                fontWeight={700}
                color="#c62828"
                variant="body1"
                mb={0.5}
              >
                Error
              </Typography>
              <Typography color="#c62828" fontSize={14}>
                {error}
              </Typography>
            </Paper>
          )}
          {loading && (
            <Box sx={{ textAlign: "center", color: "#20b2aa", pt: 2 }}>
              <span
                style={{
                  width: 40,
                  height: 40,
                  display: "inline-block",
                  margin: "0 0 15px 0",
                  border: "4px solid #f0f0f0",
                  borderTopColor: "#20b2aa",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <Typography>Generating your personalized meal plan...</Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{
              py: 1.5,
              fontWeight: 600,
              fontSize: 18,
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, #20b2aa 0%, #0097a7 100%)",
              boxShadow: "0 2px 8px rgba(32,178,170,0.09)",
              ":hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 14px rgba(32,178,170,0.18)",
                background:
                  "linear-gradient(135deg, #0097a7 0%, #20b2aa 100%)",
              },
            }}
          >
            {loading ? "Generating..." : "Generate Plan"}
          </Button>
        </form>
      </Box>
      {/* Right: Card for quote or results */}
      <Box
        sx={{
          bgcolor: "#fafbfc",
          pt: { xs: 6, md: 11 },
          pr: { xs: 2, md: 12 },
          pl: { xs: 2, md: 4 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "calc(100vh - 122px)",
          maxHeight: "calc(100vh - 122px)",
          boxSizing: "border-box"
        }}
      >
        {/* QUOTE */}
        {!plan && !loading && (
          <Box
            sx={{
              width: "100%",
              maxWidth: 610,
              minHeight: 240,
              background: "linear-gradient(134deg, #20b2aa 0%, #0097a7 100%)",
              borderRadius: "20px",
              p: 4,
              mb: 3,
              boxShadow: "0 4px 18px rgba(31,162,162,0.13)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h4"
              color="#fff"
              fontStyle="italic"
              fontWeight={700}
              sx={{ width: "100%" }}
            >
              "{randomQuote}"
            </Typography>
          </Box>
        )}
        {/* RESULTS */}
        {plan && !loading && (
          <Paper elevation={2}
            sx={{
              width: "100%",
              maxWidth: 620,
              borderRadius: "20px",
              background: "#fff",
              p: 0,
              boxShadow: "0 4px 16px rgba(32,178,170,0.09)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              maxHeight: "calc(100vh - 220px)",
              overflow: "hidden"
            }}>
            <Box sx={{
              height: "100%",
              overflowY: "auto",
              p: 3
              }}>
              <MealPlanResults plan={plan} />
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
export default DietPlanPage;
