// Service to interact with Google Gemini AI API

const { GoogleGenerativeAI } = require("@google/generative-ai");

const getAiResponse = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Service Error:", error.message);
    throw error;
  }
};

module.exports = { getAiResponse };
