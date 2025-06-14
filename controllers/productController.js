import Product from "../models/productModel.js";

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ error: "Error fetching product" });
  }
};

// POST create product
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, stock, brand,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      brand,
      image: req.files?.image?.[0]?.path,
      images: req.files?.images?.map((f) => f.path) || [],
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: "Product creation failed" });
  }
};

// PUT update product
export const updateProduct = async (req, res) => {
  try {
    const {
      name, description, price, category, stock, brand,
    } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      stock,
      brand,
    };

    if (req.files?.image?.[0]) {
      updateData.image = req.files.image[0].path;
    }
    if (req.files?.images) {
      updateData.images = req.files.images.map((f) => f.path);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Product not found" });

    res.json(updated);
  } catch {
    res.status(500).json({ error: "Update failed" });
  }
};

// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
};


// POST /api/products/:id/reviews
export const addProductReview = async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = { user, rating, comment };
    product.reviews.push(review);
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to submit review" });
  }
};
