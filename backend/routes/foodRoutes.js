import express from "express";
import FoodItem from "../models/FoodItem.js";

const router = express.Router();

router.get("/foods", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const foods = await FoodItem.find(filter);
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: "Error fetching foods" });
  }
});

export default router;
