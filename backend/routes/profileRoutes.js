// routes/profileRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMe, updateProfile, changePassword, deleteAccount} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.delete("/delete", protect, deleteAccount);

export default router;
