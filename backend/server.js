import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js"; 
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import geminiChatRoutes from "./routes/geminiChatRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api", foodRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", geminiChatRoutes);

app.use("/images", express.static("public/images"));

app.get("/", (req, res) => {
  res.send("Backend working ✅");
});

app.get("/test", (req, res) => {
  res.json({ message: "✅ Frontend is now connected to Backend!" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
