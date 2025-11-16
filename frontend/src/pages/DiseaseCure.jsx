// src/pages/DiseaseCure.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Chip,
  Alert,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import dnaAnim from "../assets/animation/dna.json";
import "../styles/DiseaseCure.css";
import diseases from "../data/diseases.json";

/* -----------------------------
   Helpers: Levenshtein & similarity
----------------------------- */
function levenshtein(a = "", b = "") {
  const m = a.length,
    n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}
function similarity(a = "", b = "") {
  const A = (a || "").trim().toLowerCase();
  const B = (b || "").trim().toLowerCase();
  if (!A || !B) return 0;
  const dist = levenshtein(A, B);
  return 1 - dist / Math.max(A.length, B.length);
}

export default function DiseaseCure() {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFlow, setSuggestionFlow] = useState(false); // true when user clicked a suggestion
  const [loadingEnter, setLoadingEnter] = useState(false); // loader for Enter -> 2.4s
  const [loadingSelection, setLoadingSelection] = useState(false); // loader for click -> 1s

  const [matchList, setMatchList] = useState([]); // name matches after Enter
  const [symptomMatchList, setSymptomMatchList] = useState([]); // symptom matches after Enter

  const [cardsVisible, setCardsVisible] = useState(false); // true after Enter loader finishes
  const [selectedDisease, setSelectedDisease] = useState(null); // shown below lists
  const [highlighted, setHighlighted] = useState(null); // name string highlighted
  const suggestionRef = useRef(null);

  const SUGGESTION_LOAD_MS = 2200; 
  const MATCH_CLICK_MS = 1000; 
  const ENTER_LOAD_MS = 2400; 
  /* -------------------------
     Suggestions while typing (limit 10)
     Priority: name substring -> fuzzy name -> symptom (fuzzy>=0.6 or exact)
     Symptom suggestion label: "Disease Name (Symptom)"
  ------------------------- */
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    const out = [];
    const added = new Set();

    // name substring
    for (const d of diseases) {
      if (d.name.toLowerCase().includes(q)) {
        out.push({ type: "name", disease: d, label: d.name, score: 1 });
        added.add(d.name);
      }
    }

    // fuzzy name
    const fuzzy = [];
    for (const d of diseases) {
      if (!added.has(d.name)) {
        const sim = similarity(d.name, query);
        if (sim >= 0.6) fuzzy.push({ type: "name", disease: d, label: d.name, score: sim });
      }
    }
    fuzzy.sort((a, b) => b.score - a.score);
    out.push(...fuzzy);

    // symptom suggestions
    const symMatches = [];
    for (const d of diseases) {
      for (const s of d.symptoms || []) {
        const sim = similarity(s, query);
        const exact = s.trim().toLowerCase() === q;
        if ((exact || sim >= 0.6) && !added.has(d.name + "|" + s)) {
          symMatches.push({ type: "symptom", disease: d, symptom: s, label: `${d.name} (${s})`, score: exact ? 1 : sim });
          added.add(d.name + "|" + s);
        }
      }
    }
    symMatches.sort((a, b) => b.score - a.score);
    out.push(...symMatches);

    return out.slice(0, 10);
  }, [query, diseases]);

  /* -------------------------
     Utilities for Enter
  ------------------------- */
  const findNameMatches = (input) => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return diseases.filter((d) => d.name.toLowerCase().includes(q));
  };
  const findSymptomMatches = (input) => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    const res = [];
    for (const d of diseases) {
      for (const s of d.symptoms || []) {
        const sim = similarity(s, input);
        const exact = s.trim().toLowerCase() === q;
        if (exact || sim >= 0.6) {
          if (!res.find((r) => r.disease.name === d.name)) {
            res.push({ disease: d, matchedSymptom: s, score: exact ? 1 : sim });
          }
        }
      }
    }
    res.sort((a, b) => b.score - a.score);
    return res;
  };

  /* -------------------------
     Outside click to close suggestions
  ------------------------- */
  useEffect(() => {
    const onDoc = (e) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // suggestion clicked: hide lists, show 2.4s loader, then only that disease card
  const onSuggestionClick = (s) => {
    setShowSuggestions(false);
    setSuggestionFlow(true);

    // reset lists & selection
    setMatchList([]);
    setSymptomMatchList([]);
    setSelectedDisease(null);
    setHighlighted(null);
    setCardsVisible(false);

    setLoadingEnter(true);
    setTimeout(() => {
      setSelectedDisease(s.disease);
      setLoadingEnter(false);
    }, SUGGESTION_LOAD_MS);

    setQuery(s.label);
  };

  // Enter key pressed: build matches and show lists side-by-side
  const onEnter = () => {
    // clear suggestion flow
    setSuggestionFlow(false);
    setShowSuggestions(false);
    setSelectedDisease(null);
    setHighlighted(null);
    setCardsVisible(false);

    const names = findNameMatches(query);
    const syms = findSymptomMatches(query);

    // no matches -> show full-width No diseases found after a tiny loader
    if (names.length === 0 && syms.length === 0) {
      setMatchList([]);
      setSymptomMatchList([]);
      setLoadingEnter(true);
      setTimeout(() => {
        setLoadingEnter(false);
        setCardsVisible(false); // no cards
      }, 600); // quick illusion
      return;
    }

    // populate lists (always shown after Enter)
    setLoadingEnter(true);
    setTimeout(() => {
      setMatchList(names);
      setSymptomMatchList(syms);
      setLoadingEnter(false);
      setCardsVisible(true); // show cards now
    }, ENTER_LOAD_MS);
  };

  // click from match lists -> 1s loader then show disease below lists (keep lists visible)
  const onMatchClick = (diseaseObj) => {
    setHighlighted(diseaseObj.name);
    setSelectedDisease(null);

    // show selection loader below cards
    setLoadingSelection(true);
    setTimeout(() => {
      setSelectedDisease(diseaseObj);
      setLoadingSelection(false);
    }, MATCH_CLICK_MS);
  };

  // clear all
  const onClear = () => {
    setQuery("");
    setShowSuggestions(false);
    setSuggestionFlow(false);
    setMatchList([]);
    setSymptomMatchList([]);
    setSelectedDisease(null);
    setHighlighted(null);
    setCardsVisible(false);
    setLoadingEnter(false);
    setLoadingSelection(false);
  };

  /* -------------------------
     Small UI sub-components
  ------------------------- */
  const SuggestionRow = ({ s, idx }) => (
    <ListItem key={idx} disablePadding>
      <ListItemButton onClick={() => onSuggestionClick(s)} sx={{ py: 1 }}>
        <Avatar sx={{ width: 36, height: 36, mr: 1, bgcolor: "#E8F5E9" }}>
          <SearchIcon color="primary" />
        </Avatar>
        <ListItemText
          primary={<Typography fontWeight={700}>{s.label}</Typography>}
          secondary={s.type === "name" ? "Disease name" : `Symptom: ${s.symptom}`}
        />
      </ListItemButton>
    </ListItem>
  );

  /* -------------------------
     Render
  ------------------------- */
  return (
    <Container classname="disease-cure-container">
      {/* header */}
      <Box textAlign="center" mb={3} mt={-10}>
        <LocalHospitalIcon sx={{ fontSize: 54, color: "primary.main" }} />
        <Typography variant="h4" fontWeight={800} >Disease Cure & Nutrition Guide</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
           Discover Nutrients, minerals, and foods to help manage various health conditions.
        </Typography>
      </Box>

      {/* search bar */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 3, mb: 2}}>
        <Box sx={{ display: "flex", gap: 1}}>
          <TextField
            fullWidth
            placeholder="Type any disease (like anemia) or a symptom (like cough)"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setSuggestionFlow(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") onEnter(); }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><SearchIcon color="primary" /></InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />
          <Button variant="outlined" onClick={onClear}>Clear</Button>
        </Box>
      </Paper>

      {/* suggestions while typing */}
      {showSuggestions && query.trim() && suggestions.length > 0 && (
        <Paper ref={suggestionRef} sx={{ mb: 3, borderRadius: 2, maxWidth: 900 }}>
          <List>
            {suggestions.map((s, i) => <SuggestionRow s={s} idx={i} key={i} />)}
          </List>
        </Paper>
      )}

      {/* suggestionFlow (user clicked suggestion) loader */}
      {suggestionFlow && loadingEnter && (
        <Box textAlign="center" my={4}>
          <Lottie animationData={dnaAnim} style={{ height: 170 }} />
          <Typography color="text.secondary" sx={{ mt: 1 }}>Analyzing selection...</Typography>
        </Box>
      )}

      {/* suggestionFlow result: only disease detail */}
      {suggestionFlow && !loadingEnter && selectedDisease && (
        <Box mt={3}>
          <DiseaseDetail disease={selectedDisease} />
        </Box>
      )}

      {/* ENTER flow */}
      {!suggestionFlow && query.trim() && (
        <>
          {/* Loader while processing Enter (only one loader here) */}
          {loadingEnter && (
            <Box textAlign="center" my={2}>
              <Lottie animationData={dnaAnim} style={{ height: 140 }} />
              <Typography color="text.secondary">Processing...</Typography>
            </Box>
          )}

          {/* No matches (after Enter) */}
          {!loadingEnter && !cardsVisible && matchList.length === 0 && symptomMatchList.length === 0 && (
            <Paper sx={{ p: 4, borderRadius: 3, mt: 2, textAlign: "center" }}>
              <Typography variant="h5" fontWeight={800}>No diseases found</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>Try another keyword or check spelling.</Typography>
            </Paper>
          )}

          {/* show the two matching cards side-by-side (responsive) when at least one of them has items */}
          {cardsVisible && (matchList.length > 0 || symptomMatchList.length > 0) && (
            <Box sx={{ mt: 2 }}>

              {/* ALWAYS-VISIBLE HINT ABOVE CARDS */}
              {cardsVisible && (
                  <Alert className="dc-hint-msg" severity="info" sx={{mb:2 , borderRadius: 2 }}>
                    Select any disease from the cards below — details will appear under them 👇
                  </Alert>
              )}

              <Grid container spacing={2} alignItems="stretch">
                {/* name matches card */}
                <Grid item xs={12} md={6}>
                  <Paper className="dc-card" sx={{ p: 2, borderRadius: 3, height: "100%" }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Matching Diseases {matchList.length ? `(${matchList.length})` : ""}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {matchList.length === 0 ? (
                        <Typography color="text.secondary">No name-based matches</Typography>
                      ) : matchList.map((d, i) => (
                        <ListItemButton key={i}
                          className={`dc-list-item ${highlighted === d.name ? "dc-selected" : ""}`}
                          onClick={() => onMatchClick(d)}
                        >
                          <ListItemText primary={<Typography className="dc-disease-name">{d.name}</Typography>} />
                        </ListItemButton>
                      ))}
                    </Box>
                  </Paper>
                </Grid>

                {/* symptom matches card */}
                <Grid item xs={12} md={6}>
                  <Paper className="dc-card" sx={{ p: 2, borderRadius: 3, height: "100%" }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>Diseases matched by symptoms {symptomMatchList.length ? `(${symptomMatchList.length})` : ""}</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {symptomMatchList.length === 0 ? (
                        <Typography color="text.secondary">No symptom-based matches</Typography>
                      ) : symptomMatchList.map((s, i) => (
                        <ListItemButton key={i}
                          className={`dc-list-item ${highlighted === s.disease.name ? "dc-selected" : ""}`}
                          onClick={() => onMatchClick(s.disease)}
                        >
                          <ListItemText
                            primary={<Typography className="dc-disease-name">{s.disease.name} <span className="dc-symptom">({s.matchedSymptom})</span></Typography>}
                          />
                        </ListItemButton>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* fixed area below the two cards */}
              <Box sx={{ mt: 3 }}>
                {/* show select message only when cards are visible and nothing is selected and not loadingSelection */}
                {!loadingSelection && !selectedDisease && (
                  <Paper className="dc-select-msg">
                     Select any disease from the matched lists above👆
                  </Paper>
                )}

                {/* when the user clicked a match, show a loader BELOW the cards (1s) */}
                {loadingSelection && (
                  <Box textAlign="center" py={3}>
                    <Lottie animationData={dnaAnim} style={{ height: 120 }} />
                    <Typography color="text.secondary">Analyzing selection…</Typography>
                  </Box>
                )}

                {/* After loader, show disease detail below both cards */}
                {!loadingSelection && selectedDisease && (
                  <Box mt={2}>
                    <DiseaseDetail disease={selectedDisease} />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

/* -------------------------
   Disease Detail card (kept as original)
------------------------- */
function DiseaseDetail({ disease }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "0 12px 40px rgba(2,40,20,0.06)" }}>
        <Typography variant="h4" fontWeight={800} color="primary.main">{disease.name}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>Nutrition-focused guidance (educational only).</Typography>

        <Divider sx={{ my: 2 }} />

        {/* Symptoms */}
        <Typography variant="subtitle1" fontWeight={600}>🧠 Common Symptoms</Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          {disease.symptoms.map((s,i)=> <Chip key={i} label={s} color="error" variant="outlined" />)}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Vitamins */}
        <Typography variant="subtitle1" fontWeight={600}>💊 Vitamins & Supplements Required</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {disease.vitamins.map((v,i)=>(
            <Grid item xs={12} sm={6} key={i}>
              <Paper sx={{ p:2, borderRadius:2, bgcolor:"#FBFFFB" }}>
                <Typography fontWeight={700} color="primary.main">{v.name}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Benefit:</strong> {v.benefit}</Typography>
                {v.dosage && <Chip label={`Dosage: ${v.dosage}`} size="small" sx={{ mt: 1 }} />}
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Foods */}
        <Typography variant="subtitle1" fontWeight={600}>🍎 Beneficial Food Sources</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {disease.foods.map((f,i)=>(
            <Grid item xs={12} sm={6} key={i}>
              <Paper sx={{ p:2, borderRadius:2, bgcolor:"#F5FAFF" }}>
                <Typography fontWeight={700} color="secondary.main">{f.name}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Nutrients:</strong> {f.nutrients}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Benefit:</strong> {f.benefit}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ mt: 3, p:2, borderRadius:2, bgcolor:"#FFF9E6" }}>
          <Typography fontWeight={700}>💡 General Advice</Typography>
          <Typography color="text.secondary">{disease.generalAdvice}</Typography>
        </Paper>
      </Paper>
    </motion.div>
  );
}
