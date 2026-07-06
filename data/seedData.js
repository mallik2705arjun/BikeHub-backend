const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const Bike = require("../models/Bike");
const connectDB = require("../config/db");

// Lists of brands from user request
const bikeBrands = [
  "Hero", "Honda", "TVS", "Bajaj", "Royal Enfield", "Yamaha", "Suzuki", "KTM",
  "Kawasaki", "BMW Motorrad", "Ducati", "Triumph", "Harley Davidson", "Benelli",
  "Aprilia", "Jawa", "Yezdi", "Husqvarna", "CFMoto", "Moto Morini", "MV Agusta",
  "Indian Motorcycle", "Moto Guzzi", "BSA", "Keeway"
];

const scooterBrands = [
  "Honda", "TVS", "Suzuki", "Hero", "Yamaha", "Aprilia", "Keeway", "Vespa"
];

const electricBrands = [
  "Ultraviolette", "Revolt", "Ola Electric", "Ather", "Simple Energy", "River",
  "Hero Vida", "TVS iQube", "Bajaj Chetak", "Ampere", "PURE EV", "Komaki",
  "Bounce", "Joy e-bike", "Lectrix", "Okinawa", "BGauss", "Gemopai", "Zelio"
];

// Helper to generate a random number within range
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate programmatic vehicle objects
const generateBikes = () => {
  const list = [];
  const modelSuffixes = ["Pulse 150", "Street 200", "Cruiser 350", "Rider 125", "Adventure 400", "Hyper 600", "Tourer 250", "Classic 300", "Racer 160", "Apex 250"];
  const colorsList = [["Red", "Black"], ["Blue", "White"], ["Matte Grey", "Orange"], ["Green", "Black"], ["Silver", "Red"]];

  // We need 200+ bikes
  for (let i = 1; i <= 210; i++) {
    const brand = bikeBrands[i % bikeBrands.length];
    const suffix = modelSuffixes[i % modelSuffixes.length];
    const name = `${brand} ${suffix} #${i}`;
    const engineCc = randomRange(100, 650);
    const hp = Math.round(engineCc * 0.1);
    const torqueNm = Math.round(hp * 1.1);
    const weightKg = randomRange(110, 210);
    const priceVal = randomRange(75000, 450000);
    
    list.push({
      name,
      brand,
      category: "Bike",
      price: `₹ ${priceVal.toLocaleString("en-IN")}`,
      engine: `${engineCc} cc`,
      power: `${hp} PS`,
      torque: `${torqueNm} Nm`,
      mileage: `${randomRange(30, 65)} kmpl`,
      range: "N/A",
      topSpeed: `${randomRange(90, 160)} km/h`,
      fuelType: "Petrol",
      transmission: `${randomRange(4, 6)}-speed Manual`,
      cooling: engineCc > 200 ? "Liquid Cooled" : "Air Cooled",
      weight: `${weightKg} kg`,
      seatHeight: `${randomRange(760, 830)} mm`,
      groundClearance: `${randomRange(150, 190)} mm`,
      fuelTank: `${randomRange(8, 17)} Liters`,
      chargingTime: "N/A",
      batteryCapacity: "N/A",
      motorPower: "N/A",
      colors: colorsList[i % colorsList.length],
      description: `The all-new ${name} offers class-leading performance with an engine displacement of ${engineCc}cc, producing ${hp} PS of power. Engineered for performance and daily commute comfort.`,
      features: ["Digital Instrument Cluster", "LED DRLs", "Dual-Channel ABS", "Engine Kill Switch"],
      specifications: {
        "Clutch": "Wet Multiplate",
        "Front Suspension": "Telescopic Fork",
        "Rear Suspension": "Monoshock",
        "Brake Type": "Disc (Front & Rear)"
      },
      pros: ["Powerful mid-range torque", "Comfortable rider posture", "Value for money price point"],
      cons: ["Slightly stiff rear ride", "Vibrations at higher RPMs"],
      rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
      launchYear: randomRange(2021, 2025),
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc"
    });
  }
  return list;
};

const generateScooters = () => {
  const list = [];
  const modelSuffixes = ["Activa Special", "Jupiter SX", "Access Prime", "Dio Turbo", "Pleasure Plus", "Ntorq XP", "RayZR Matte", "Vespa Premium", "VXL Elite"];
  const colorsList = [["Matte Blue", "Chrome"], ["Pearl White", "Black"], ["Matte Black", "Red"], ["Decent Yellow", "Black"]];

  // We need 100+ scooters
  for (let i = 1; i <= 105; i++) {
    const brand = scooterBrands[i % scooterBrands.length];
    const suffix = modelSuffixes[i % modelSuffixes.length];
    const name = `${brand} ${suffix} #${i}`;
    const engineCc = randomRange(109, 150);
    const hp = Number((engineCc * 0.08).toFixed(1));
    const torqueNm = Number((hp * 1.1).toFixed(1));
    const weightKg = randomRange(98, 118);
    const priceVal = randomRange(70000, 140000);

    list.push({
      name,
      brand,
      category: "Scooter",
      price: `₹ ${priceVal.toLocaleString("en-IN")}`,
      engine: `${engineCc} cc`,
      power: `${hp} PS`,
      torque: `${torqueNm} Nm`,
      mileage: `${randomRange(40, 55)} kmpl`,
      range: "N/A",
      topSpeed: `${randomRange(80, 100)} km/h`,
      fuelType: "Petrol",
      transmission: "CVT Automatic",
      cooling: "Air Cooled",
      weight: `${weightKg} kg`,
      seatHeight: `${randomRange(690, 770)} mm`,
      groundClearance: `${randomRange(145, 160)} mm`,
      fuelTank: `${randomRange(5, 7)} Liters`,
      chargingTime: "N/A",
      batteryCapacity: "N/A",
      motorPower: "N/A",
      colors: colorsList[i % colorsList.length],
      description: `The ${name} is a versatile family scooter powered by a highly reliable ${engineCc}cc automatic engine. Offers great underseat storage, comfortable seating, and premium metallic body panels.`,
      features: ["External Fuel Fill", "Smart Keyless Start", "USB Mobile Charger", "LED Headlamp"],
      specifications: {
        "Brake Front": "Drum",
        "Brake Rear": "Drum",
        "Suspension Front": "Telescopic Fork",
        "Suspension Rear": "Hydraulic Damper"
      },
      pros: ["Extremely convenient CVT drive", "Excellent fuel economy", "Spacious floorboard space"],
      cons: ["Suspension feels soft on bumpy roads", "Basic digital interface on base trims"],
      rating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
      launchYear: randomRange(2021, 2025),
      image: "https://images.unsplash.com/photo-1599819811279-d5ad9cccf838"
    });
  }
  return list;
};

const generateEVs = () => {
  const list = [];
  const modelSuffixes = ["F77 Neo", "RV Elite", "S1 Air Max", "450 Apex", "Simple One Pro", "Indie Utility", "V1 Plus", "iQube Luxury", "Chetak Gold", "Magnus Evo", "Ranger Extreme"];
  const colorsList = [["Teal Green", "White"], ["Matte Graphite", "Gold"], ["Stellar Blue", "Black"], ["Crimson Red", "Silver"]];

  // We need 100+ electric vehicles (scooters/bikes)
  for (let i = 1; i <= 105; i++) {
    const brand = electricBrands[i % electricBrands.length];
    const suffix = modelSuffixes[i % modelSuffixes.length];
    const name = `${brand} ${suffix} #${i}`;
    const batteryKwh = Number((2.5 + Math.random() * 6).toFixed(1));
    const rangeKm = Math.round(batteryKwh * 40);
    const topSpeedKmh = randomRange(75, 135);
    const motorKw = Number((batteryKwh * 1.5).toFixed(1));
    const priceVal = randomRange(90000, 320000);
    const isScooter = i % 3 !== 0; // 2/3 are electric scooters, 1/3 electric bikes

    list.push({
      name,
      brand,
      category: isScooter ? "Electric Scooter" : "Electric Bike",
      price: `₹ ${priceVal.toLocaleString("en-IN")}`,
      engine: "N/A",
      power: `${motorKw * 1.3} PS`,
      torque: `${Math.round(motorKw * 4)} Nm`,
      mileage: "N/A",
      range: `${rangeKm} km`,
      topSpeed: `${topSpeedKmh} km/h`,
      fuelType: "Electric",
      transmission: "Automatic",
      cooling: "Air Cooled",
      weight: `${randomRange(95, 140)} kg`,
      seatHeight: `${randomRange(770, 815)} mm`,
      groundClearance: `${randomRange(150, 200)} mm`,
      fuelTank: "N/A",
      chargingTime: `${Number((2.5 + batteryKwh * 0.8).toFixed(1))} Hours`,
      batteryCapacity: `${batteryKwh} kWh`,
      motorPower: `${motorKw} kW`,
      colors: colorsList[i % colorsList.length],
      description: `The eco-friendly ${name} features a high-performance ${batteryKwh}kWh lithium-ion battery pack with a true range of up to ${rangeKm}km. Supports quick charging and features the latest generation smart connectivity.`,
      features: ["Touchscreen Dashboard", "Regenerative Braking", "GPS Tracking & Anti-Theft", "Bluetooth Connectivity"],
      specifications: {
        "Brake Type": "Disc (Front & Rear)",
        "Battery Type": "Lithium-Ion (Removable)",
        "Drive Type": "Belt Drive"
      },
      pros: ["Zero tailpipe emissions", "Negligible running cost", "Instant power and torque delivery"],
      cons: ["Longer recharge times", "Limited public fast charging infrastructure"],
      rating: Number((4.1 + Math.random() * 0.9).toFixed(1)),
      launchYear: randomRange(2022, 2026),
      image: "https://images.unsplash.com/photo-1590409055811-5762747161b4"
    });
  }
  return list;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Bike.deleteMany();
    console.log("Cleared existing bikes...");

    // Generate arrays
    const bikes = generateBikes();
    const scooters = generateScooters();
    const evs = generateEVs();

    const allVehicles = [...bikes, ...scooters, ...evs];

    // Bulk insert
    await Bike.insertMany(allVehicles);
    console.log(`Successfully seeded database with ${allVehicles.length} vehicles!`);
    console.log(`- Bikes: ${bikes.length}`);
    console.log(`- Scooters: ${scooters.length}`);
    console.log(`- EVs: ${evs.length}`);

    console.log("Seeding process completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
