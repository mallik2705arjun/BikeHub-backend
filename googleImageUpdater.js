const mongoose = require("mongoose");
const google = require("googlethis");
const Bike = require("./models/Bike");
require("dotenv").config();

async function updateImages() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bikehub");
    console.log("Connected to MongoDB for Google Image Updates");

    const bikes = await Bike.find();
    console.log(`Found ${bikes.length} bikes. Starting Google Image search...`);

    let updatedCount = 0;

    for (let i = 0; i < bikes.length; i++) {
      const bike = bikes[i];
      // Skip if it's already a good image (optional, but we'll overwrite to ensure they are all from Google per user request)
      const query = `${bike.brand} ${bike.name} ${bike.category} official hd white background`;
      
      try {
        const images = await google.image(query, { safe: false });
        if (images && images.length > 0) {
          // Grab the first high quality image URL
          bike.image = images[0].url;
          await bike.save();
          console.log(`[${i+1}/${bikes.length}] Updated ${bike.brand} ${bike.name} -> ${bike.image}`);
          updatedCount++;
        } else {
          console.log(`[${i+1}/${bikes.length}] No images found for ${bike.brand} ${bike.name}`);
        }
      } catch (err) {
        console.log(`[${i+1}/${bikes.length}] Error fetching for ${bike.brand} ${bike.name}: ${err.message}`);
      }

      // Wait 2 seconds to prevent Google from rate-limiting us
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`Finished! Successfully updated ${updatedCount} out of ${bikes.length} vehicles.`);
    process.exit(0);
  } catch (error) {
    console.error("Critical error:", error);
    process.exit(1);
  }
}

updateImages();
