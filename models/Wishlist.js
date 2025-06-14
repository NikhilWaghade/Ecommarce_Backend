import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
});

export default mongoose.model("Wishlist", wishlistSchema);
