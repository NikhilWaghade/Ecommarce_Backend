import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String, // main image
  images: [String], // extra images
  category: String,
  stock: Number,
  brand: String,
  reviews: [reviewSchema],
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
