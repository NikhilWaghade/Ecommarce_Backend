// models/wishlistModel.js
import { supabase } from "../config/supabase.js";

/**
 * 📦 Get all wishlist items for a specific user
 */
export const getWishlistByUser = async (userId) => {
  const { data, error } = await supabase
    .from("wishlist")
    .select("id, product_id, products(*)") // fetch product details also
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data;
};

/**
 * ➕ Add product to user's wishlist
 */
export const addWishlistItem = async (userId, productId) => {
  // check if already exists
  const { data: existing } = await supabase
    .from("wishlist")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    throw new Error("Product already in wishlist");
  }

  const { data, error } = await supabase
    .from("wishlist")
    .insert([{ user_id: userId, product_id: productId }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
};

/**
 * ❌ Remove product from user's wishlist
 */
export const removeWishlistItem = async (userId, productId) => {
  const { error } = await supabase
    .from("wishlist")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  if (error) throw new Error(error.message);
  return true;
};
