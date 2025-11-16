// controllers/profileController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";

/* -----------------------------
   🔹 GET CURRENT USER (/me)
------------------------------ */
export const getMe = (req, res) => {
  try {
    const u = req.user;
    res.json({
      id: u._id,
      name: u.name,
      email: u.email,
      age: u.age,
      height: u.height,
      weight: u.weight,
      sex: u.sex,
      profilePic: u.profilePic || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* -----------------------------
   🔹 UPDATE PROFILE
------------------------------ */
export const updateProfile = async (req, res) => {
  try {
    const { name, age, height, weight, sex, profilePic } = req.body;

    // EXACT same constraints as SIGNUP
    if (!name || !name.trim())
      return res.status(400).json({ msg: "Name is required" });

    if (age !== undefined && (age < 0 || age > 150))
      return res.status(400).json({ msg: "Age must be 0–150" });

    if (height !== undefined && (height < 10 || height > 300))
      return res.status(400).json({ msg: "Height must be 10–300 cm" });

    if (weight !== undefined && (weight < 1 || weight > 200))
      return res.status(400).json({ msg: "Weight must be 1–200 kg" });

    if (sex && !["Male", "Female", "Other"].includes(sex))
      return res.status(400).json({ msg: "Invalid sex value" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Assign safe fields
    user.name = name;
    user.age = age;
    user.height = height;
    user.weight = weight;
    user.sex = sex;

    if (profilePic) user.profilePic = profilePic;

    await user.save();

    const { password, ...safeUser } = user.toObject();
    res.json({ msg: "Profile updated", user: safeUser });

  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ msg: "Server error while updating profile" });
  }
};

/* -----------------------------
   🔹 CHANGE PASSWORD
------------------------------ */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res.status(400).json({ msg: "Provide both passwords" });

    // Same password rule as signup page
    const validPassword = /^(?=.*\d)(?=.*[A-Za-z]).{6,}$/;
    if (!validPassword.test(newPassword))
      return res.status(400).json({
        msg: "Password must be ≥6 characters & contain at least 1 number",
      });

    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password updated successfully" });

  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ msg: "Server error while changing password" });
  }
};
/* -----------------------------
   🔴 DELETE ACCOUNT
------------------------------ */
export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await User.findByIdAndDelete(req.user._id);

    return res.json({ msg: "Account deleted successfully" });
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ msg: "Server error while deleting account" });
  }
};
