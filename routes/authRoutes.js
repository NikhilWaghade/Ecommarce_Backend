// routes/authRoutes.js
import express from "express";
import { adminSignup, adminLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/admin-signup", adminSignup);
router.post("/admin-login", adminLogin);

export default router;
