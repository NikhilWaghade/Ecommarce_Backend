import { supabase } from "../config/supabase.js";

// ✅ GET Wishlist Items
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT middleware sets req.user.id

    const { data, error } = await supabase
      .from("wishlist")
      .select("id, product_id, products(*)") // includes full product details
      .eq("user_id", userId);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wishlist", error: err.message });
  }
};

// ✅ ADD to Wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // Check if already exists
    const { data: existing } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    if (existing) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert([{ user_id: userId, product_id: productId }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist", error: err.message });
  }
};

// ✅ REMOVE from Wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from wishlist", error: err.message });
  }
};
