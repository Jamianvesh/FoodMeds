import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: Number,
  height: Number,
  weight: Number,
  sex: { type: String, enum: ["Male", "Female", "Other"] },
  profilePic: { type: String },
});

export default mongoose.model("User", userSchema);
