import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js"; // your JWT middleware

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);

export default router;
