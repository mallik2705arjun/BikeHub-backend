const mongoose = require("mongoose");
const https = require("https");
require("dotenv").config();
const Bike = require("../models/Bike");
const connectDB = require("../config/db");

const curatedModels = {
  "Hero": ["Splendor Plus", "HF Deluxe", "Passion Plus", "Glamour", "Super Splendor", "Xtreme 125R", "Xtreme 160R", "Xpulse 200 4V", "Karizma XMR", "Mavrick 440", "Destini 125", "Pleasure+", "Pleasure+ XTEC", "Xoom 110", "Xoom 125", "Xoom 160", "Vida V2 Lite (Electric)", "Vida V2 Plus (Electric)", "Vida V2 Pro (Electric)"],
  "Honda": ["Shine 125", "SP125", "Unicorn", "Hornet 2.0", "CB200X", "CB300F", "CB300R", "Hness CB350", "CB350RS", "NX200", "CB650R", "CBR650R", "Africa Twin", "Gold Wing", "Activa 6G", "Activa 125", "Dio 110", "Dio 125", "Dio 125 H-Smart", "Grazia 125", "NX125"],
  "TVS": ["Sport", "Radeon", "Star City Plus", "Raider 125", "Ronin", "Apache RTR 160", "Apache RTR 160 4V", "Apache RTR 180", "Apache RTR 200 4V", "Apache RTR 310", "Apache RR310", "Jupiter 110", "Jupiter 125", "Ntorq 125", "Scooty Zest 110", "Scooty Pep+", "XL100 Heavy Duty", "XL100 Comfort", "iQube (Electric)", "iQube S (Electric)", "iQube ST (Electric)"],
  "Bajaj": ["Platina 100", "Platina 110", "CT110X", "Pulsar 125", "Pulsar N125", "Pulsar N150", "Pulsar N160", "Pulsar N250", "Pulsar NS125", "Pulsar NS160", "Pulsar NS200", "Pulsar RS200", "Dominar 250", "Dominar 400", "Avenger Street 160", "Avenger Cruise 220", "Chetak 2903 (Electric)", "Chetak 3501 (Electric)", "Chetak 3502 (Electric)"],
  "Royal Enfield": ["Hunter 350", "Bullet 350", "Classic 350", "Meteor 350", "Guerrilla 450", "Himalayan 450", "Scram 440", "Interceptor 650", "Continental GT 650", "Super Meteor 650", "Shotgun 650", "Bear 650"],
  "Yamaha": ["FZ FI", "FZ-S FI", "FZ-X", "MT-15", "R15M", "R15 V4", "Aerox 155", "Fascino 125 Fi Hybrid", "RayZR 125 Fi Hybrid"],
  "Suzuki": ["Gixxer", "Gixxer SF", "Gixxer 250", "Gixxer SF250", "V-Strom SX", "Hayabusa", "Access 125", "Avenis 125", "Burgman Street", "Burgman Street EX"],
  "KTM": ["200 Duke", "250 Duke", "390 Duke", "RC 200", "RC 390", "250 Adventure", "390 Adventure", "390 Adventure X", "390 Adventure S", "390 Adventure R", "390 Enduro R"],
  "Kawasaki": ["Ninja 300", "Ninja 500", "Ninja 650", "Ninja ZX-4R", "Ninja ZX-6R", "Ninja ZX-10R", "Ninja H2 SX", "Versys 650", "Versys 1100", "Z650", "Z900", "Eliminator", "Vulcan S"],
  "Triumph": ["Speed T4", "Speed 400", "Scrambler 400X", "Scrambler 400 XC", "Trident 660", "Daytona 660", "Tiger Sport 660", "Street Triple R", "Street Triple RS", "Tiger 900", "Tiger 1200", "Rocket 3", "Bonneville T100", "Bonneville T120", "Scrambler 900", "Speed Twin 900", "Speed Twin 1200"],
  "Ola Electric": ["S1 Pro", "S1 Air", "S1 X"],
  "Ather": ["450X", "450S", "Rizta"],
  "Vespa": ["VXL 125", "SXL 150"],
  "Revolt": ["RV400", "RV400 BRZ"]
};

// High quality fallback images in case Wikipedia fails
const fallbackImages = {
  hero: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Hero_Splendor_Plus.jpg/800px-Hero_Splendor_Plus.jpg",
  honda: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Gold_Metallic_Honda_Activa.jpg/1280px-Gold_Metallic_Honda_Activa.jpg",
  tvs: "https://upload.wikimedia.org/wikipedia/commons/f/fe/Apache_rtr_310.jpg",
  bajaj: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Bajaj-NS400Z.jpg/1280px-Bajaj-NS400Z.jpg",
  "royal enfield": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg/1280px-Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg",
  yamaha: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Yamaha_R15_V3.0.jpg/1280px-Yamaha_R15_V3.0.jpg",
  suzuki: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Suzuki_Gixxer_SF_150_Side_View.jpg/1280px-Suzuki_Gixxer_SF_150_Side_View.jpg",
  ktm: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Ktm_duke_390.jpg/1280px-Ktm_duke_390.jpg",
  kawasaki: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Kawasaki_Ninja_300_2013_Showroom.JPG/1280px-Kawasaki_Ninja_300_2013_Showroom.JPG",
  triumph: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg/1280px-Royal_Enfield_Classic_350_%282017_Model_Year%29.jpg",
  vespa: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/PerthVespa.jpg/1280px-PerthVespa.jpg",
  "ola electric": "https://images.unsplash.com/photo-1620802613528-ce01f240f66a",
  ather: "https://images.unsplash.com/photo-1590409055811-5762747161b4",
  revolt: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e"
};

const getWikiImage = (brand, model) => {
  return new Promise((resolve) => {
    const query = (brand + "_" + model).replace(/ /g, "_");
    const options = {
      hostname: 'en.wikipedia.org',
      path: '/w/api.php?action=query&titles=' + encodeURIComponent(query) + '&prop=pageimages&format=json&pithumbsize=1000',
      headers: { 'User-Agent': 'BikeHub/1.0 (contact@example.com)' }
    };
    
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId] && pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
          } else {
            resolve(fallbackImages[brand.toLowerCase()]);
          }
        } catch(e) {
          resolve(fallbackImages[brand.toLowerCase()]);
        }
      });
    }).on('error', () => resolve(fallbackImages[brand.toLowerCase()]));
  });
};

const generateSpecs = (brand, name) => {
  const lowerName = name.toLowerCase();
  let cc = 150;
  let price = 100000;
  let category = "Bike";
  let fuelType = "Petrol";
  
  if (lowerName.includes("scooter") || lowerName.includes("activa") || lowerName.includes("dio") || lowerName.includes("jupiter") || lowerName.includes("ntorq") || lowerName.includes("access") || lowerName.includes("burgman") || lowerName.includes("aerox") || lowerName.includes("rayzr") || lowerName.includes("destini") || lowerName.includes("pleasure") || lowerName.includes("xoom") || lowerName.includes("grazia") || lowerName.includes("nx125") || lowerName.includes("avenis") || lowerName.includes("scooty") || lowerName.includes("xl100") || lowerName.includes("fascino") || brand === "Vespa") {
    category = "Scooter";
    cc = 110;
    price = 85000;
  }
  
  if (brand === "Ola Electric" || brand === "Ather" || brand === "Revolt" || lowerName.includes("iqube") || lowerName.includes("chetak") || lowerName.includes("vida") || name.includes("(Electric)")) {
    category = "Electric Scooter";
    if (brand === "Revolt") category = "Electric Bike";
    fuelType = "Electric";
    cc = 0;
    price = 120000;
  }
  
  // Clean up the name by removing "(Electric)" if it exists
  const displayName = name.replace(" (Electric)", "");

  // Parse CC from name if exists
  const ccMatch = name.match(/(\d{3,4})/);
  if (ccMatch && fuelType === "Petrol") {
    cc = parseInt(ccMatch[1]);
  }
  
  if (lowerName.includes("125")) { cc = 125; price = 90000; }
  else if (lowerName.includes("150") || lowerName.includes("160")) { cc = 160; price = 120000; }
  else if (lowerName.includes("200")) { cc = 200; price = 145000; }
  else if (lowerName.includes("250")) { cc = 250; price = 180000; }
  else if (lowerName.includes("300") || lowerName.includes("310") || lowerName.includes("350")) { cc = 350; price = 220000; }
  else if (lowerName.includes("390") || lowerName.includes("400") || lowerName.includes("440") || lowerName.includes("450")) { cc = 400; price = 280000; }
  else if (lowerName.includes("500") || lowerName.includes("650") || lowerName.includes("660")) { cc = 650; price = 450000; }
  else if (lowerName.includes("900")) { cc = 900; price = 950000; }
  else if (lowerName.includes("1000") || lowerName.includes("1100") || lowerName.includes("1200") || lowerName.includes("h2") || lowerName.includes("hayabusa") || lowerName.includes("rocket") || lowerName.includes("africa twin") || lowerName.includes("gold wing")) { cc = 1000; price = 1600000; }
  
  const power = fuelType === "Electric" ? (Math.floor(Math.random() * 5) + 3) + " kW" : (cc / 15 + Math.floor(Math.random() * 5)).toFixed(1) + " bhp";
  const torque = fuelType === "Electric" ? (Math.floor(Math.random() * 20) + 15) + " Nm" : (cc / 12 + Math.floor(Math.random() * 5)).toFixed(1) + " Nm";
  const mileage = fuelType === "Electric" ? (Math.floor(Math.random() * 50) + 100) + " km/charge" : Math.max(15, 80 - (cc / 10)).toFixed(1) + " kmpl";
  const topSpeed = fuelType === "Electric" ? (Math.floor(Math.random() * 30) + 80) + " kmph" : (cc / 2.5 + 50).toFixed(0) + " kmph";
  
  return {
    name: displayName,
    brand,
    category,
    price: "₹ " + price.toLocaleString("en-IN"),
    priceValue: price,
    engine: fuelType === "Electric" ? "Electric Motor" : cc + " cc",
    power,
    torque,
    mileage,
    topSpeed,
    transmission: category === "Scooter" || fuelType === "Electric" ? "Automatic" : "Manual",
    fuelCapacity: fuelType === "Electric" ? "N/A" : (cc > 250 ? "15 Liters" : "12 Liters"),
    weight: fuelType === "Electric" ? "110 kg" : (cc > 250 ? "190 kg" : "145 kg"),
    seatHeight: "790 mm",
    groundClearance: category === "Scooter" ? "155 mm" : "165 mm",
    cooling: cc > 250 ? "Liquid Cooled" : "Air Cooled",
    abs: cc > 150 ? "Dual Channel ABS" : "Single Channel ABS",
    colors: ["Black", "Red", "Blue", "White"],
    features: ["Digital Console", "LED Headlights", "Bluetooth Connectivity", "USB Charging"],
    description: `The ${brand} ${name} is a premium ${category.toLowerCase()} offering exceptional performance and reliability.`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    launchYear: 2024,
    fuelType,
    image: fallbackImages[brand.toLowerCase()]
  };
};

const seedDatabase = async () => {
  try {
    await connectDB();
    await Bike.deleteMany();
    
    console.log("Deleted old vehicles. Generating requested models...");
    
    const vehicles = [];
    
    for (const brand of Object.keys(curatedModels)) {
      console.log(`Fetching images and generating specs for ${brand}...`);
      for (const model of curatedModels[brand]) {
        const spec = generateSpecs(brand, model);
        // Wait 200ms to avoid wiki rate limit
        spec.image = await getWikiImage(brand, model);
        await new Promise(r => setTimeout(r, 200));
        vehicles.push(spec);
      }
    }
    
    await Bike.insertMany(vehicles);
    console.log(`Successfully seeded ${vehicles.length} curated vehicles into the database!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
