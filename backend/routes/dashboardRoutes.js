import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.get("/user", async (req, res) => {
  try {
    const emailRaw = req.query.email;
    if (!emailRaw) {
      console.log("Email query missing");
      return res.status(400).json({ error: "Email is required" });
    }
    const email = emailRaw.trim().toLowerCase();
    console.log("Looking for user with email:", email);

    // Case-insensitive search (regex)
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, "i") } }).select("-password");

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Found user:", user);
    res.json(user);
  } catch (error) {
    console.error("Server error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
