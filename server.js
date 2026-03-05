import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import adminAuthRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import supabase from "./config/supabase.js";

dotenv.config();

const app = express();

// =====================
// ✅ CORS Setup
// =====================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dnd-footwear.vercel.app",
    ],
    credentials: true,
  })
);

// =====================
// ✅ Middlewares
// =====================
app.use(express.json());

// serve uploaded images
app.use("/uploads", express.static("uploads"));

// =====================
// ✅ Root Route (Health Check)
// =====================
app.get("/", (req, res) => {
  res.send("DND Footwear API running 🚀");
});

// =====================
// ✅ Test Route
// =====================
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend running",
    environment: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// =====================
// ✅ API Routes
// =====================
app.use("/api/auth", adminAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

// =====================
// ✅ 404 Handler
// =====================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// =====================
// ✅ Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  });
});

// =====================
// ✅ Start Server
// =====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);

  try {
    const { error } = await supabase
      .from("admins")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Supabase connection error:", error.message);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  } catch (err) {
    console.error("❌ Supabase unexpected error:", err.message);
  }
});

// =====================
// ✅ Graceful Shutdown
// =====================
process.on("SIGINT", () => {
  console.log("👋 Shutting down server...");
  server.close(() => process.exit(0));
});