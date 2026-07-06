const Bike = require("../models/Bike");
const { getBikeImage } = require("../services/unsplashService");

// Get all vehicles with filtering and sorting
const getBikes = async (req, res) => {
  try {
    const { 
      brand, category, fuelType, transmission,
      minPrice, maxPrice, 
      minEngine, maxEngine,
      minMileage, maxMileage,
      minRange, maxRange,
      minTopSpeed, maxTopSpeed,
      sort 
    } = req.query;

    let query = {};

    // Filters
    if (brand) query.brand = new RegExp(`^${brand}$`, "i");
    if (category) query.category = new RegExp(`^${category}$`, "i");
    if (fuelType) query.fuelType = new RegExp(`^${fuelType}$`, "i");
    if (transmission) query.transmission = new RegExp(`^${transmission}$`, "i");

    // Price Filter (parse ₹ x,xx,xxx)
    if (minPrice || maxPrice) {
      // Since price is stored as string like "₹ 1,29,999", we can do custom range filter inside code or regex
      // However, for beginner friendliness, we can write a simple filter or map.
      // Let's do a programmatic filter after fetching, or parse numbers.
      // Better yet, for database efficiency we fetch all and filter in memory, which is simple for 400 items.
    }

    let bikes = await Bike.find(query);

    // Apply advanced filters in memory for simplicity and reliability
    if (minPrice || maxPrice) {
      const min = minPrice ? parseInt(minPrice) : 0;
      const max = maxPrice ? parseInt(maxPrice) : Infinity;
      bikes = bikes.filter(b => {
        const numericPrice = parseInt(b.price.replace(/[^0-9]/g, ""));
        return numericPrice >= min && numericPrice <= max;
      });
    }

    if (minEngine || maxEngine) {
      const min = minEngine ? parseInt(minEngine) : 0;
      const max = maxEngine ? parseInt(maxEngine) : Infinity;
      bikes = bikes.filter(b => {
        if (!b.engine || b.engine === "N/A") return false;
        const numericEngine = parseInt(b.engine.replace(/[^0-9]/g, ""));
        return numericEngine >= min && numericEngine <= max;
      });
    }

    if (minMileage || maxMileage) {
      const min = minMileage ? parseInt(minMileage) : 0;
      const max = maxMileage ? parseInt(maxMileage) : Infinity;
      bikes = bikes.filter(b => {
        if (!b.mileage || b.mileage === "N/A") return false;
        const numericMileage = parseInt(b.mileage.replace(/[^0-9]/g, ""));
        return numericMileage >= min && numericMileage <= max;
      });
    }

    if (minRange || maxRange) {
      const min = minRange ? parseInt(minRange) : 0;
      const max = maxRange ? parseInt(maxRange) : Infinity;
      bikes = bikes.filter(b => {
        if (!b.range || b.range === "N/A") return false;
        const numericRange = parseInt(b.range.replace(/[^0-9]/g, ""));
        return numericRange >= min && numericRange <= max;
      });
    }

    if (minTopSpeed || maxTopSpeed) {
      const min = minTopSpeed ? parseInt(minTopSpeed) : 0;
      const max = maxTopSpeed ? parseInt(maxTopSpeed) : Infinity;
      bikes = bikes.filter(b => {
        if (!b.topSpeed || b.topSpeed === "N/A") return false;
        const numericSpeed = parseInt(b.topSpeed.replace(/[^0-9]/g, ""));
        return numericSpeed >= min && numericSpeed <= max;
      });
    }

    // Sort in-memory
    if (sort) {
      if (sort === "price_asc") {
        bikes.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, "")));
      } else if (sort === "price_desc") {
        bikes.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, "")));
      } else if (sort === "rating") {
        bikes.sort((a, b) => b.rating - a.rating);
      } else if (sort === "newest") {
        bikes.sort((a, b) => b.launchYear - a.launchYear);
      }
    }

    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get a single vehicle details
const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const placeholders = [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc",
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838",
      "https://images.unsplash.com/photo-1590409055811-5762747161b4",
      "https://images.unsplash.com/photo-1622185135505-2d795003994a",
      "https://images.unsplash.com/photo-1620802613528-ce01f240f66a"
    ];

    if (!bike.image || placeholders.includes(bike.image)) {
      try {
        const query = `${bike.brand} ${bike.name.split("#")[0]}`;
        const realImage = await getBikeImage(query);
        if (realImage && !placeholders.includes(realImage)) {
          bike.image = realImage;
          await bike.save();
        }
      } catch (err) {
        console.warn("Dynamic image fetch failed:", err.message);
      }
    }

    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create a new vehicle (Admin)
const createBike = async (req, res) => {
  try {
    const newBike = new Bike(req.body);
    const savedBike = await newBike.save();
    res.status(201).json(savedBike);
  } catch (error) {
    res.status(400).json({ message: "Validation Error", error: error.message });
  }
};

// Update an existing vehicle (Admin)
const updateBike = async (req, res) => {
  try {
    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedBike) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(updatedBike);
  } catch (error) {
    res.status(400).json({ message: "Validation Error", error: error.message });
  }
};

// Delete a vehicle (Admin)
const deleteBike = async (req, res) => {
  try {
    const deletedBike = await Bike.findByIdAndDelete(req.params.id);
    if (!deletedBike) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get list of unique brands
const getBrands = async (req, res) => {
  try {
    const { category, fuelType } = req.query;
    let query = {};
    if (category) query.category = new RegExp(`^${category}$`, "i");
    if (fuelType) query.fuelType = new RegExp(`^${fuelType}$`, "i");
    
    const brands = await Bike.distinct("brand", query);
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Search vehicles
const searchBikes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Try text search index first
    let results = await Bike.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    // Fallback to partial text regex match if no index results found
    if (results.length === 0) {
      results = await Bike.find({
        $or: [
          { name: new RegExp(q, "i") },
          { brand: new RegExp(q, "i") },
          { category: new RegExp(q, "i") },
          { engine: new RegExp(q, "i") }
        ]
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get images for search query
const getImages = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Query parameter 'q' is required" });
    }
    const imageUrl = await getBikeImage(q);
    res.json({ image: imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
  getBrands,
  searchBikes,
  getImages
};
