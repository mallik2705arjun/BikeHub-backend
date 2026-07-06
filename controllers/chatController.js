const { getAiResponse } = require("../services/geminiService");
const Bike = require("../models/Bike");

const handleChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Retrieve database context to avoid hallucinations (RAG)
    let contextBikes = [];
    const lowerPrompt = prompt.toLowerCase();

    // Naive keywords retrieval
    if (lowerPrompt.includes("under") || lowerPrompt.includes("lakh") || lowerPrompt.includes("price") || lowerPrompt.includes("budget")) {
      contextBikes = await Bike.find().limit(30); // Grab a variety of bikes to inspect
    } else if (lowerPrompt.includes("scooter") || lowerPrompt.includes("activa") || lowerPrompt.includes("jupiter")) {
      contextBikes = await Bike.find({ category: /scooter/i }).limit(20);
    } else if (lowerPrompt.includes("electric") || lowerPrompt.includes("ola") || lowerPrompt.includes("ather") || lowerPrompt.includes("ev")) {
      contextBikes = await Bike.find({ $or: [{ category: /electric/i }, { fuelType: "Electric" }] }).limit(25);
    } else {
      // Find matches based on brands mentioned
      const brands = await Bike.distinct("brand");
      const matchedBrands = brands.filter(b => lowerPrompt.includes(b.toLowerCase()));
      if (matchedBrands.length > 0) {
        contextBikes = await Bike.find({ brand: { $in: matchedBrands } }).limit(20);
      } else {
        // Fallback: grab some popular bikes
        contextBikes = await Bike.find().limit(15);
      }
    }

    // Format the retrieval context for Gemini
    const bikeContextString = contextBikes.map(b => (
      `- Name: ${b.name}, Brand: ${b.brand}, Category: ${b.category}, Price: ${b.price}, Engine: ${b.engine || 'N/A'}, Power: ${b.power || 'N/A'}, Mileage: ${b.mileage || 'N/A'}, Range: ${b.range || 'N/A'}, Rating: ${b.rating || 'N/A'}, Fuel: ${b.fuelType || 'Petrol'}`
    )).join("\n");

    const systemInstruction = `
You are BikeHub AI, a highly knowledgeable and friendly assistant for a premium motorcycle and scooter showroom.
Here is the real real-time inventory of vehicles available in our showroom database:
${bikeContextString}

Using ONLY the inventory list above to recommend specific models when asked about prices, range, mileage, or brands. Do not hallucinate models that are not listed in the context.
If asked about general specifications, tips, or comparisons, answer accurately. Keep your answers concise, clean, formatting recommendations in nice markdown bullet points.

User Question: ${prompt}
    `;

    const reply = await getAiResponse(systemInstruction);
    res.json({ text: reply });
  } catch (error) {
    console.error("Chat Controller Error:", error.message);
    res.status(500).json({ message: "AI assistant is temporarily unavailable.", error: error.message });
  }
};

module.exports = { handleChat };
