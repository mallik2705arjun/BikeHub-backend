const Wishlist = require("../models/Wishlist");

// Get wishlist items
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: "default_user" }).populate("bike");
    // Filter out items where referenced bike might have been deleted
    const validItems = items.filter(item => item.bike !== null);
    res.json(validItems);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { bikeId } = req.body;
    if (!bikeId) {
      return res.status(400).json({ message: "Bike ID is required" });
    }

    // Check if item is already in wishlist
    const exists = await Wishlist.findOne({ bike: bikeId, userId: "default_user" });
    if (exists) {
      return res.status(400).json({ message: "Item already exists in wishlist" });
    }

    const item = new Wishlist({ bike: bikeId, userId: "default_user" });
    await item.save();
    
    // Fetch and return full populated wishlist
    const populated = await Wishlist.findById(item._id).populate("bike");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    // Check if req.params.id is the wishlist ID or a bike ID
    let deleted = await Wishlist.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      // Try finding by bike ID instead
      deleted = await Wishlist.findOneAndDelete({ bike: req.params.id, userId: "default_user" });
    }

    if (!deleted) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }
    
    res.json({ message: "Item removed from wishlist successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
