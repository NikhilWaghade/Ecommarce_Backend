import express from "express";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
} from "../controllers/productController.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();


// ==============================
// GET ALL PRODUCTS
// ==============================
router.get("/", getAllProducts);


// ==============================
// ADD PRODUCT REVIEW
// IMPORTANT: keep above /:id
// ==============================
router.post("/:id/reviews", addProductReview);


// ==============================
// GET SINGLE PRODUCT
// ==============================
router.get("/:id", getProductById);


// ==============================
// CREATE PRODUCT
// ==============================
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);


// ==============================
// UPDATE PRODUCT
// ==============================
router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);


// ==============================
// DELETE PRODUCT
// ==============================
router.delete("/:id", deleteProduct);


export default router;