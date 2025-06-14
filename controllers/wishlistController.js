import Wishlist from "../models/Wishlist.js";

export const getWishlist = async (req, res) => {
  const wishlist = await Wishlist.find({ userId: req.user.id }).populate("productId");
  res.json(wishlist);
};

export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  const exists = await Wishlist.findOne({ userId: req.user.id, productId });
  if (exists) return res.status(400).json({ message: "Already in wishlist" });

  const item = await Wishlist.create({ userId: req.user.id, productId });
  res.json(item);
};

export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  await Wishlist.findOneAndDelete({ userId: req.user.id, productId });
  res.json({ message: "Removed" });
};
