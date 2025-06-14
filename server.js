import express from "express";
import dotenv from "dotenv";
import cors from "cors";


import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import { connectDB } from "./config/db.js";



dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // frontend URL
  credentials: true               // allow cookies, auth headers
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(cors({
  origin: 'http://localhost:5173',   // your frontend URL
  credentials: true                 
}));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log('🚀 Server is running on http://localhost:5000');
});
