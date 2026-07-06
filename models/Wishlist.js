const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  bike: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bike",
    required: true
  },
  userId: {
    type: String,
    default: "default_user" // Simple placeholder to keep it beginner-friendly
  }
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);
