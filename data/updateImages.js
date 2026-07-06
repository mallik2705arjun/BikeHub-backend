const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const Bike = require("../models/Bike");
const connectDB = require("../config/db");
const { getBikeImage } = require("../services/unsplashService");

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const updateInitialImages = async () => {
  try {
    await connectDB();

    // Find bikes that have the generic placeholder images
    const placeholders = [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc",
      "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838",
      "https://images.unsplash.com/photo-1590409055811-5762747161b4",
      "https://images.unsplash.com/photo-1622185135505-2d795003994a",
      "https://images.unsplash.com/photo-1620802613528-ce01f240f66a"
    ];

    const bikesToUpdate = await Bike.find({
      $or: [
        { image: { $in: placeholders } },
        { image: { $exists: false } },
        { image: "" }
      ]
    }).limit(40); // Limit to 40 to stay safely under Unsplash 50/hour rate limit

    console.log(`Found ${bikesToUpdate.length} vehicles to update with real images...`);

    for (let i = 0; i < bikesToUpdate.length; i++) {
      const bike = bikesToUpdate[i];
      const query = `${bike.brand} ${bike.name.split("#")[0]}`; // Remove programmatic suffix #
      console.log(`[${i + 1}/${bikesToUpdate.length}] Querying Unsplash for: "${query}"...`);
      
      const realImage = await getBikeImage(query);
      
      if (realImage && !placeholders.includes(realImage)) {
        bike.image = realImage;
        await bike.save();
        console.log(`   -> Successfully saved real image for ${bike.name}`);
      } else {
        console.log(`   -> Failed to get real image, skipped.`);
      }

      // 1.5s delay to be nice to the APIs
      await delay(1500);
    }

    console.log("Completed initial image updates!");
    process.exit(0);
  } catch (error) {
    console.error("Image update failed:", error.message);
    process.exit(1);
  }
};

updateInitialImages();
