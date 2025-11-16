import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Link,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/AuthPage.css";

import Lottie from "lottie-react";
import hii from "../assets/animation/hii.json";
import logo from "../assets/logo.png";
import { useAuthSide } from "../context/AuthContext";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AuthPageMUI() {
  const { side, setSide } = useAuthSide();

  const [showPass, setShowPass] = useState(false);
  const [showPassSign, setShowPassSign] = useState(false);

  const [signin, setSignin] = useState({ email: "", password: "" });
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    sex: "Male",
  });

  const [errors, setErrors] = useState({});
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [resetLink, setResetLink] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const validEmail = (e) => /\S+@\S+\.\S+/.test(e);
  const validPassword = (p) => /^(?=.*\d)(?=.*[A-Za-z]).{6,}$/.test(p);

  /* AUTO-HIDE ERRORS */
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 2000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  /* AUTO-HIDE FORGOT MESSAGES */
  useEffect(() => {
    if (forgotMsg || forgotError) {
      const timer = setTimeout(() => {
        setForgotMsg("");
        setForgotError("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [forgotMsg, forgotError]);

  /* AUTO-HIDE LOGIN SUCCESS POPUP */
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  /* AUTO-HIDE SIGNUP SUCCESS POPUP */
  useEffect(() => {
    if (signupSuccess) {
      const timer = setTimeout(() => setSignupSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [signupSuccess]);

  /* -----------------------------------
        SIGN IN
  ------------------------------------*/
  const handleSignin = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!validEmail(signin.email)) newErrors.signinEmail = "Invalid email";
    if (!validPassword(signin.password))
      newErrors.signinPassword = "Password must be ≥6 chars & contain a number";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signin),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");

      // Save token
      sessionStorage.setItem("token", data.token);

      // Fetch FULL user details
      const meRes = await fetch(`${apiBase}/api/user/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const me = await meRes.json();

      // Save full user
      sessionStorage.setItem("user", JSON.stringify(me));
      sessionStorage.setItem("userName", me.name);
      window.dispatchEvent(new Event("storage"));

      // Show success popup
      setSuccessMsg(`Welcome back, ${me.name}!`);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);

    } catch (err) {
      setErrors({ signinEmail: err.message });
    }
  };

  /* -----------------------------------
        SIGN UP
  ------------------------------------*/
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!signup.name.trim()) newErrors.name = "User name required";
    if (!validEmail(signup.email)) newErrors.email = "Invalid email";
    if (!validPassword(signup.password))
      newErrors.password = "Password must be ≥6 chars & contain a number";
    if (signup.age < 0 || signup.age > 150) newErrors.age = "Age must be 0-150";
    if (signup.height < 10 || signup.height > 300)
      newErrors.height = "Height must be 10-300 cm";
    if (signup.weight < 1 || signup.weight > 200)
      newErrors.weight = "Weight must be 1-200 kg";

    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    try {
      const res = await fetch(`${apiBase}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      // Show success popup
      setSignupSuccess("Account created successfully! Please sign in.");

      // Flip to Signin form
      setSide("signin");
      setSignin((s) => ({ ...s, email: signup.email }));

    } catch (err) {
      setErrors({ email: err.message });
    }
  };

  /* -----------------------------------
      FORGOT PASSWORD
  ------------------------------------*/
  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotMsg("");
    setForgotError("");
    setResetLink("");

    if (!forgotEmail.trim()) return setForgotError("Enter your email");
    if (!validEmail(forgotEmail)) return setForgotError("Invalid email address");

    try {
      const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (!res.ok) return setForgotError(data.msg);

      setForgotMsg(data.msg);
      setResetLink(data.resetLink || "");
      setForgotEmail("");

    } catch (err) {
      setForgotError("Something went wrong.");
    }
  };

  /* -----------------------------------
        UI + RENDER
  ------------------------------------*/
  return (
    <Container maxWidth="lg" className="auth-container">

      {/* LOGIN SUCCESS POPUP */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #4CAF7D, #56A1CF)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              fontWeight: 600,
              zIndex: 9999,
            }}
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGNUP SUCCESS POPUP */}
      <AnimatePresence>
        {signupSuccess && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
            style={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #56A1CF, #4CAF7D)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              fontWeight: 600,
              zIndex: 9999,
            }}
          >
            {signupSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CARD */}
      <motion.div
        className={`auth-card ${side === "signup" ? "flipped" : ""}`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        {/* FORM SIDE */}
        <Paper elevation={6} className="auth-form-side">
          <Box className="auth-header">
            <motion.div
              className="logo-container"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <img src={logo} alt="Logo" className="navbar-logo" />
            </motion.div>
            <Typography variant="h5" className="brand-name" sx={{ mb: -3, mt: -2 }}>
              FoodMeds
            </Typography>
          </Box>

          <AnimatePresence mode="wait">
            {side === "signin" ? (
              /* ------------ SIGN IN FORM ------------ */
              <motion.form
                key="signin"
                onSubmit={handleSignin}
                className="auth-form"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  size="small"
                  margin="normal"
                  value={signin.email}
                  error={!!errors.signinEmail}
                  helperText={errors.signinEmail}
                  onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  size="small"
                  type={showPass ? "text" : "password"}
                  margin="normal"
                  value={signin.password}
                  error={!!errors.signinPassword}
                  helperText={errors.signinPassword || "At least 6 characters & 1 number"}
                  onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPass(!showPass)}>
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className="form-actions">
                  <Button type="submit" variant="contained" className="submit-btn">
                    Sign In
                  </Button>
                  <Link
                    href="#forgot"
                    underline="hover"
                    className="forgot-link"
                    onClick={() =>
                      document.getElementById("forgot-block")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Forgot Password?
                  </Link>
                </Box>

                {/* FORGOT SECTION */}
                <Box id="forgot-block" className="forgot-section">
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 2 }}>
                    Forgot password?
                  </Typography>

                  <Box className="forgot-form">
                    <TextField
                      size="small"
                      placeholder="Enter your email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      error={!!forgotError}
                      helperText={forgotError}
                      className="forgot-input"
                    />
                    <Button variant="outlined" className="forgot-btn" onClick={handleForgot}>
                      Generate Link
                    </Button>
                  </Box>

                  {forgotMsg && (
                    <Typography sx={{ fontSize: "14px", color: "#4CAF7D", fontWeight: 600, mt: 2 }}>
                      {forgotMsg}
                    </Typography>
                  )}

                  {resetLink && (
                    <Typography sx={{ fontSize: "14px", color: "#1976d2", fontWeight: 600, mt: 2 }}>
                      Click here to <Link href={resetLink}>Reset Password</Link>
                    </Typography>
                  )}
                </Box>
              </motion.form>
            ) : (
              /* ------------ SIGN UP FORM ------------ */
              <motion.form
                key="signup"
                onSubmit={handleSignup}
                className="auth-form"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              >
                <Typography sx={{ mt: 1, color: "#555" }} variant="body2">
                  You can upload profile picture later from Profile Page!
                </Typography>

                <TextField
                  fullWidth
                  label="User Name"
                  size="small"
                  margin="normal"
                  value={signup.name}
                  error={!!errors.name}
                  helperText={errors.name}
                  onChange={(e) => setSignup({ ...signup, name: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Email"
                  size="small"
                  margin="normal"
                  value={signup.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  onChange={(e) => setSignup({ ...signup, email: e.target.value })}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassSign ? "text" : "password"}
                  size="small"
                  margin="normal"
                  value={signup.password}
                  error={!!errors.password}
                  helperText={errors.password || "At least 6 characters & 1 number"}
                  onChange={(e) => setSignup({ ...signup, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassSign(!showPassSign)}>
                          {showPassSign ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box className="metrics-row">
                  <TextField
                    label="Age"
                    type="number"
                    size="small"
                    inputProps={{ min: 0, max: 150 }}
                    value={signup.age}
                    error={!!errors.age}
                    helperText={errors.age}
                    onChange={(e) => setSignup({ ...signup, age: e.target.value })}
                    className="metric-field"
                  />

                  <TextField
                    label="Height(cm)"
                    type="number"
                    size="small"
                    inputProps={{ min: 10, max: 300 }}
                    value={signup.height}
                    error={!!errors.height}
                    helperText={errors.height}
                    onChange={(e) => setSignup({ ...signup, height: e.target.value })}
                    className="metric-field"
                  />

                  <TextField
                    label="Weight(kg)"
                    type="number"
                    size="small"
                    inputProps={{ min: 1, max: 200 }}
                    value={signup.weight}
                    error={!!errors.weight}
                    helperText={errors.weight}
                    onChange={(e) => setSignup({ ...signup, weight: e.target.value })}
                    className="metric-field"
                  />
                </Box>

                {/* SEX FIELD */}
                <Box className="sex-toggle">
                  <Typography variant="subtitle2" sx={{ mt: -3, mb: 1 }}>
                    Sex:
                  </Typography>
                  <ToggleButtonGroup
                    value={signup.sex}
                    exclusive
                    onChange={(e, newSex) => {
                      if (newSex) setSignup({ ...signup, sex: newSex });
                    }}
                    className="sex-buttons"
                  >
                  <ToggleButton value="Male" className="sex-btn">
                      Male
                  </ToggleButton>
                  <ToggleButton value="Female" className="sex-btn">
                      Female
                  </ToggleButton>
                  <ToggleButton value="Female" className="sex-btn">
                      Other
                  </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Button type="submit" variant="contained" className="submit-btn">
                  Sign Up
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Paper>

        {/* PANEL SIDE */}
        <motion.div
          className={`auth-panel-side ${side === "signup" ? "signup-mode" : ""}`}
          animate={{
            background:
              side === "signin"
                ? "linear-gradient(135deg, #4CAF7D, #56A1CF)"
                : "linear-gradient(135deg, #56A1CF, #4CAF7D)",
          }}
          transition={{ duration: 0.6 }}
        >
          <Box className="panel-content">
            <Box
              sx={{
                width: { xs: 180, sm: 220, md: 270 },
                height: { xs: 180, sm: 220, md: 270 },
                mx: "auto",
                mt: -8.5,
              }}
            >
              <Lottie animationData={hii} loop={true} height="100%" />
            </Box>

            {side === "signin" ? (
              <>
                <Typography variant="h5" sx={{ mb: 2, mt: -3 }}>
                  New here?
                </Typography>
                <Typography className="panel-text" sx={{ mb: 3 }}>
                  Create an account and start using FoodMeds.
                </Typography>
                <Button
                  variant="contained"
                  className="panel-btn"
                  size="small"
                  onClick={() => setSide("signup")}
                >
                  Create Account
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h5" sx={{ mb: 2, mt: -3 }}>
                  Already have an account?
                </Typography>
                <Typography className="panel-text" sx={{ mb: 3 }}>
                  Sign in to continue and access your dashboard.
                </Typography>
                <Button
                  variant="contained"
                  className="panel-btn"
                  size="small"
                  onClick={() => setSide("signin")}
                >
                  Sign In
                </Button>
              </>
            )}
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
}
