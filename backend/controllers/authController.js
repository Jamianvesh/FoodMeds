import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ==========================================
// 🔐 Helper Function: Generate JWT
// ==========================================
// ✅ Include user details like name & email in token payload
const generateToken = (user, expiresIn = "7d") => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// ==========================================
// 🟢 SIGN UP
// ==========================================
export const signup = async (req, res) => {
  try {
    const { name, email, password, age, height, weight, sex } = req.body;

    // Validate input
    if (!name || !email || !password)
      return res.status(400).json({ msg: "Please fill all required fields." });

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists. Please log in." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      age,
      height,
      weight,
      sex,
    });
    await newUser.save();

    res.status(201).json({ msg: "Signup successful! You can now sign in." });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ msg: "Server error during signup." });
  }
};

// ==========================================
// 🔵 LOGIN
// ==========================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password)
      return res.status(400).json({ msg: "Please provide email and password." });

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid email or password." });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid email or password." });

    // ✅ Generate token with user details
    const token = generateToken(user);

    res.json({
      msg: "Login successful.",
      token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ msg: "Server error during login." });
  }
};

// ==========================================
// 🟡 FORGOT PASSWORD (Frontend Reset Link)
// ==========================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email)
      return res.status(400).json({ msg: "Please provide an email address." });

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "No account found with this email." });

    // Generate reset token valid for 1 hour
    const resetToken = generateToken(user, "1h");

    // Optionally store token for tracking
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Construct reset link for frontend
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    res.json({
      msg: "Password reset link generated successfully.",
      resetLink: resetUrl,
    });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ msg: "Server error while generating reset link." });
  }
};

// ==========================================
// 🔴 RESET PASSWORD
// ==========================================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate input
    if (!password)
      return res.status(400).json({ msg: "Password is required." });

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ msg: "Reset link expired or invalid. Please try again." });
    }

    // Find user by decoded ID
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ msg: "User not found or invalid token." });

    // Hash and save new password
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful! You can now log in." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ msg: "Server error while resetting password." });
  }
};
