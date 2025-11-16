import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  imageUrl: String,
});

export default mongoose.model("FoodItem", FoodItemSchema);
