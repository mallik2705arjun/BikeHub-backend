const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true }, // e.g. "Sports Bike", "Scooter", "Electric Bike", "Electric Scooter"
  price: { type: String, required: true },
  engine: String,
  power: String,
  torque: String,
  mileage: String,
  range: String,
  topSpeed: String,
  fuelType: String, // e.g. "Petrol", "Electric"
  transmission: String,
  cooling: String,
  weight: String,
  seatHeight: String,
  groundClearance: String,
  fuelTank: String,
  chargingTime: String,
  batteryCapacity: String,
  motorPower: String,
  colors: [String],
  description: { type: String, required: true },
  features: [String],
  specifications: { type: Map, of: String },
  pros: [String],
  cons: [String],
  rating: { type: Number, default: 4 },
  launchYear: Number,
  image: String // Unsplash Image URL
}, { timestamps: true });

// Create text index for search
bikeSchema.index({
  name: "text",
  brand: "text",
  category: "text",
  description: "text"
});

module.exports = mongoose.model("Bike", bikeSchema);
