import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  Stack,
  Button,
  TextField,
  MenuItem,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";

import UploadIcon from "@mui/icons-material/Upload";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import profileAnim from "../assets/animation/profile.json";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const token = sessionStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [user, setUser] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);

  const [rightMode, setRightMode] = useState("idle"); // idle | edit | password
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showPass3, setShowPass3] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    sex: "Male",
    profilePic: ""
  });

  const [pw, setPw] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: ""
  });

  /* ============================
     LOAD PROFILE
  ============================ */
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${apiBase}/api/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.msg) throw new Error(data.msg);
        setUser(data);

        setForm({
          name: data.name || "",
          age: data.age || "",
          height: data.height || "",
          weight: data.weight || "",
          sex: data.sex || "Male",
          profilePic: data.profilePic || "",
        });
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  /* ============================
     BASE64 FILE READER
  ============================ */
  const fileToBase64 = (file) =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  const handleImageChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const base64 = await fileToBase64(f);
    setForm({ ...form, profilePic: base64 });
  };

  /* ============================
     SAVE PROFILE
  ============================ */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    // SAME validations as Signup
    if (!form.name.trim()) return setErr("Name is required");
    if (form.age !== "" && (form.age < 0 || form.age > 150))
      return setErr("Age must be 0–150");
    if (form.height !== "" && (form.height < 10 || form.height > 300))
      return setErr("Height must be 10–300 cm");
    if (form.weight !== "" && (form.weight < 1 || form.weight > 200))
      return setErr("Weight must be 1–200 kg");

    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.msg);

      setUser(data.user);

      sessionStorage.setItem("user", JSON.stringify(data.user));
      // UPDATE SIDEBAR NAME
      sessionStorage.setItem("userName", data.user.name);
      window.dispatchEvent(new Event("storage"));

      setMsg("Profile updated successfully!");
      setRightMode("idle");
      setTimeout(() => setMsg(null), 3000);

    } catch (err) {
      setErr(err.message);
    }

    setLoading(false);
  };

  /* ============================
     CHANGE PASSWORD
  ============================ */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);

    const rule = /^(?=.*\d)(?=.*[A-Za-z]).{6,}$/;

    if (!rule.test(pw.newPassword))
      return setErr("Password must be ≥6 chars & contain a number");

    if (pw.newPassword !== pw.confirm)
      return setErr("Passwords do not match");

    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/user/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: pw.oldPassword,
          newPassword: pw.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      setMsg("Password updated!");
      setRightMode("idle");
      // Keep user synced
      sessionStorage.setItem("user", JSON.stringify(user));

      setPw({ oldPassword: "", newPassword: "", confirm: "" });
      setTimeout(() => setMsg(null), 3000);

    } catch (err) {
      setErr(err.message);
    }

    setLoading(false);
  };

  /* ============================
     DELETE ACCOUNT
  ============================ */
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${apiBase}/api/user/delete`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      sessionStorage.clear();
      window.location.href = "/";

    } catch (err) {
      setErr(err.message);
    }
  };

  if (!token) return <Typography>Please login</Typography>;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ padding: 20 }}
      >
        <Box
          sx={{ mt:-5,
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* ================= LEFT PANEL ================= */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Paper sx={{ p: 3, borderRadius: 4, width: 300 }}>
              <Box sx={{ textAlign: "center" }}>
                <Avatar
                  src={form.profilePic || ""}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    mx: "auto",
                    bgcolor: "#66bb6a",
                  }}
                  component={motion.div}
                  whileHover={{ scale: 1.15 }}
                >
                  {form.name[0]}
                </Avatar>

                <Typography variant="h5" fontWeight={800}>
                  {user?.name}
                </Typography>
                <Typography color="text.secondary">{user?.email}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography>Age: {user?.age ?? "N/A"}</Typography>
                <Typography>Sex: {user?.sex}</Typography>
                <Typography>Height: {user?.height} cm</Typography>
                <Typography>Weight: {user?.weight} kg</Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Button  variant="outlined" fullWidth onClick={() => setRightMode("idle")}>
                  Profile
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setRightMode("edit")}
                >
                  Edit Profile
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => setRightMode("password")}
                >
                  Change Password
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  fullWidth
                  onClick={() => setOpenDelete(true)}
                >
                  Delete Account
                </Button>
              </Stack>
            </Paper>
          </motion.div>

          {/* ================= RIGHT PANEL ================= */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, borderRadius: 4, height: "100%" }}>
              {msg && <Alert severity="success">{msg}</Alert>}
              {err && <Alert severity="error">{err}</Alert>}

              {/* IDLE PANEL (BIG LOTTIE + TEXT) */}
              {rightMode === "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ textAlign: "center" }}
                >
                  <Box sx={{ width: "80%", mx: "auto" }}>
                    <Lottie animationData={profileAnim} />
                  </Box>

                  <Typography variant="h4" fontWeight={800}>
                    Welcome, {user?.name}! 👋
                  </Typography>

                  <Typography
                    sx={{
                      mt: 2,
                      fontSize: "18px",
                      color: "text.secondary",
                    }}
                  >
                    Update your profile anytime using the menu on the left.
                    Your details help us personalize your diet and health
                    recommendations.
                  </Typography>
                </motion.div>
              )}

              {/* EDIT PROFILE */}
              {rightMode === "edit" && (
                <motion.form
                  initial={{ opacity: 0, x: 45 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleSaveProfile}
                >
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                    Edit Profile
                  </Typography>

                  <Stack spacing={2}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<UploadIcon />}
                    >
                      Upload Picture
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>

                    <TextField
                      label="Name"
                      value={form.name}
                      required
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />

                    <TextField
                      label="Age"
                      type="number"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                    />

                    <TextField
                      select
                      label="Sex"
                      value={form.sex}
                      onChange={(e) =>
                        setForm({ ...form, sex: e.target.value })
                      }
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>

                    <TextField
                      label="Height (cm)"
                      type="number"
                      value={form.height}
                      onChange={(e) =>
                        setForm({ ...form, height: e.target.value })
                      }
                    />

                    <TextField
                      label="Weight (kg)"
                      type="number"
                      value={form.weight}
                      onChange={(e) =>
                        setForm({ ...form, weight: e.target.value })
                      }
                    />

                    <Button
                      variant="contained"
                      type="submit"
                      startIcon={<SaveIcon />}
                    >
                      Save Changes
                    </Button>
                  </Stack>
                </motion.form>
              )}

              {/* CHANGE PASSWORD */}
              {rightMode === "password" && (
                <motion.form
                  initial={{ opacity: 0, x: 45 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={handleChangePassword}
                >
                  <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                    Change Password
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      label="Old Password"
                      type={showPass1 ? "text" : "password"}
                      value={pw.oldPassword}
                      required
                      onChange={(e) =>
                        setPw({ ...pw, oldPassword: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowPass1(!showPass1)}>
                            {showPass1 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />

                    <TextField
                      label="New Password"
                      type={showPass2 ? "text" : "password"}
                      helperText="≥6 characters & must contain a number"
                      value={pw.newPassword}
                      required
                      onChange={(e) =>
                        setPw({ ...pw, newPassword: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowPass2(!showPass2)}>
                            {showPass2 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />

                    <TextField
                      label="Confirm Password"
                      type={showPass3 ? "text" : "password"}
                      value={pw.confirm}
                      required
                      onChange={(e) =>
                        setPw({ ...pw, confirm: e.target.value })
                      }
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => setShowPass3(!showPass3)}>
                            {showPass3 ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />

                    <Button variant="contained" type="submit">
                      Update Password
                    </Button>
                  </Stack>
                </motion.form>
              )}
            </Paper>
          </Box>
        </Box>

        {/* DELETE CONFIRMATION */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle sx={{ fontWeight: 800, color: "error.main" }}>
            Delete Account?
          </DialogTitle>

          <DialogContent>
            <DialogContentText>
              This action cannot be undone. All your health data will be
              permanently deleted.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteAccount}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </AnimatePresence>
  );
}
