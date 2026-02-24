// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔹 1. Token check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // 🔹 2. Extract token from header
    const token = authHeader.split(" ")[1];

    // 🔹 3. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // 🔹 4. Fetch admin user from Supabase
    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, name, email, role, created_at") // avoid fetching password directly
      .eq("id", decoded.id)
      .single();

    if (error) {
      console.error("Supabase error:", error.message);
      return res.status(500).json({ message: "Database error" });
    }

    if (!admin) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // 🔹 5. Attach user to request
    req.user = admin;

    // Continue to next middleware or route
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: "Not authorized, token failed or expired" });
  }
};
