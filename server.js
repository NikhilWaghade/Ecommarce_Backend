// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import adminAuthRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import supabase from "./config/supabase.js"; 

dotenv.config();
const app = express();

//  Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // allow cookies, auth headers
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ✅ Test Route - Check if server is running
app.get("/api/test", (req, res) => {
  res.json({ 
    message: "Backend server is running!", 
    timestamp: new Date().toISOString(),
    status: "OK"
  });
});

// ✅ Routes
app.use("/api/auth", adminAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ✅ 404 Handler - For unmatched routes
app.use((req, res, next) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "Route not found", 
    method: req.method, 
    path: req.originalUrl 
  });
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/admin-signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/admin-login`);
  
  // Check Supabase connection after server starts
  try {
    const { data, error } = await supabase.from("admins").select("*").limit(1);
    if (error) {
      console.error("❌ Supabase connection error:", error.message);
    } else {
      console.log("✅ Supabase connected successfully!");
    }
  } catch (err) {
    console.error("❌ Unexpected error while connecting to Supabase:", err.message);
  }
});

// Keep the server running
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
