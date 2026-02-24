import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createProduct
);

router.put(
  "/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateProduct
);

router.delete("/:id", deleteProduct);

export default router;