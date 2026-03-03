import {
  getAllProductsDB,
  getProductByIdDB,
  createProductDB,
  updateProductDB,
  deleteProductDB,
  addReviewDB,
} from "../models/productModel.js";

const BASE_URL = process.env.BASE_URL;

// ============================
// GET ALL PRODUCTS
// ============================
export const getAllProducts = async (req, res) => {
  const { data, error } = await getAllProductsDB();

  if (error) return res.status(500).json({ error: error.message });

  const products = data.map((product) => ({
    ...product,
    image: product.image
      ? `${BASE_URL}/${product.image.replace(/\\/g, "/")}`
      : null,
    images: product.images
      ? product.images.map((img) =>
          `${BASE_URL}/${img.replace(/\\/g, "/")}`
        )
      : [],
  }));

  res.json(products);
};

// ============================
// GET SINGLE PRODUCT
// ============================
export const getProductById = async (req, res) => {
  const { data, error } = await getProductByIdDB(req.params.id);

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Product not found" });

  const product = {
    ...data,
    image: data.image
      ? `${BASE_URL}/${data.image.replace(/\\/g, "/")}`
      : null,
    images: data.images
      ? data.images.map((img) =>
          `${BASE_URL}/${img.replace(/\\/g, "/")}`
        )
      : [],
  };

  res.json(product);
};

// ============================
// CREATE PRODUCT
// ============================
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, brand } = req.body;

    const image = req.files?.image?.[0]?.path || null;
    const images = req.files?.images?.map((f) => f.path) || [];

    const { data, error } = await createProductDB({
      name,
      description,
      price: Number(price || 0),
      category,
      stock: Number(stock || 0),
      brand,
      image,
      images,
    });

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Create crash:", err);
    res.status(500).json({ error: "Product creation failed" });
  }
};

// ============================
// UPDATE PRODUCT
// ============================
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, brand } = req.body;

    const updateData = {
      name: name || "",
      description: description || "",
      price: Number(price || 0),
      category: category || "",
      stock: Number(stock || 0),
      brand: brand || "",
    };

    if (req.files?.image?.[0]) {
      updateData.image = req.files.image[0].path;
    }

    if (req.files?.images?.length > 0) {
      updateData.images = req.files.images.map((f) => f.path);
    }

    const { data, error } = await updateProductDB(
      req.params.id,
      updateData
    );

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Update crash:", err);
    res.status(500).json({ error: "Update failed" });
  }
};

// ============================
// DELETE PRODUCT
// ============================
export const deleteProduct = async (req, res) => {
  const { error } = await deleteProductDB(req.params.id);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Product deleted successfully" });
};

// ============================
// ADD REVIEW
// ============================
export const addProductReview = async (req, res) => {
  try {
    const { user, rating, comment } = req.body;

    const { error } = await addReviewDB(req.params.id, {
      user,
      rating: Number(rating),
      comment,
    });

    if (error)
      return res.status(500).json({ message: "Failed to submit review" });

    res.json({ message: "Review added successfully" });
  } catch {
    res.status(500).json({ message: "Error adding review" });
  }
};