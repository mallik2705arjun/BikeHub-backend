const express = require("express");
const router = express.Router();
const {
  getBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
  getBrands,
  searchBikes,
  getImages
} = require("../controllers/bikeController");

// Define routes
router.get("/bikes", getBikes);
router.get("/brands", getBrands);
router.get("/search", searchBikes);
router.get("/images", getImages);
router.get("/bikes/:id", getBikeById);

// Admin Routes
router.post("/bikes", createBike);
router.put("/bikes/:id", updateBike);
router.delete("/bikes/:id", deleteBike);

module.exports = router;
