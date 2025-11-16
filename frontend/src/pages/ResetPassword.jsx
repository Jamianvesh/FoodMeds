import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validPassword = (p) => /^(?=.*\d)(?=.*[A-Za-z]).{6,}$/.test(p);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!validPassword(password))
      return setError("Password must be at least 6 characters and include a number.");
    if (password !== confirmPass)
      return setError("Passwords do not match.");

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error resetting password");
      setMsg("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/auth", { replace: true }), 2000); // 👈 replaces tab
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%" }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: "20px",
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 25px rgba(76, 175, 125, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            color="#4CAF7D"
            gutterBottom
            textAlign="center"
          >
            Reset Password
          </Typography>

          {msg && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: "10px" }}>
              {msg}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleReset}
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              label="New Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="Must be at least 6 characters and include 1 number"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: "12px",
                fontWeight: "bold",
                mt: 2,
                py: 1.2,
                background: "linear-gradient(135deg, #4CAF7D, #56A1CF)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(135deg, #56A1CF, #4CAF7D)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Reset Password"}
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
