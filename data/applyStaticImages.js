const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const Bike = require("../models/Bike");
const connectDB = require("../config/db");

// Official manufacturer product images from Wikimedia Commons per BRAND
const brandImages = {
  hero: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_Splendor_Plus.jpg/800px-Hero_Splendor_Plus.jpg"],
  honda: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Gold_Metallic_Honda_Activa.jpg/1280px-Gold_Metallic_Honda_Activa.jpg"],
  tvs: ["https://upload.wikimedia.org/wikipedia/commons/f/fe/Apache_rtr_310.jpg"],
  bajaj: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bajaj-NS400Z.jpg/1280px-Bajaj-NS400Z.jpg"],
  "royal enfield": ["https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg/1280px-Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg"],
  yamaha: ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Yamaha_R15_V3.0.jpg/1280px-Yamaha_R15_V3.0.jpg"],
  suzuki: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Suzuki_Gixxer_SF_150_Side_View.jpg/1280px-Suzuki_Gixxer_SF_150_Side_View.jpg"],
  ktm: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Ktm_duke_390.jpg/1280px-Ktm_duke_390.jpg"],
  kawasaki: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Kawasaki_Ninja_300_2013_Showroom.JPG/1280px-Kawasaki_Ninja_300_2013_Showroom.JPG"],
  vespa: ["https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PerthVespa.jpg/1280px-PerthVespa.jpg"],
  "ola electric": ["https://images.unsplash.com/photo-1620802613528-ce01f240f66a"],
  ather: ["https://images.unsplash.com/photo-1590409055811-5762747161b4"],
  revolt: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e"]
};

const categoryImages = {
  scooter: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Gold_Metallic_Honda_Activa.jpg/1280px-Gold_Metallic_Honda_Activa.jpg"],
  electricScooter: ["https://images.unsplash.com/photo-1620802613528-ce01f240f66a"]
};

const applyStaticImages = async () => {
  try {
    await connectDB();

    const vehicles = await Bike.find();
    console.log(`Updating ${vehicles.length} vehicles with brand-specific real images...`);

    let updatedCount = 0;

    for (let i = 0; i < vehicles.length; i++) {
      const bike = vehicles[i];
      const lowerBrand = bike.brand.toLowerCase();
      const lowerCat = bike.category.toLowerCase();
      
      let imgList = [];

      if (lowerCat === "scooter" && lowerBrand !== "vespa") {
        imgList = categoryImages.scooter;
      } else if (lowerCat === "electric scooter" && !brandImages[lowerBrand]) {
        imgList = categoryImages.electricScooter;
      } else {
        imgList = brandImages[lowerBrand] || ["https://images.unsplash.com/photo-1485965120184-e220f721d03e"];
      }

      // Dynamic pick based on index to distribute images evenly
      const selectedImg = imgList[i % imgList.length];
      
      bike.image = selectedImg;
      await bike.save();
      updatedCount++;
    }

    console.log(`Successfully completed image assignment for all ${updatedCount} vehicles!`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to apply static images:", error.message);
    process.exit(1);
  }
};

applyStaticImages();
