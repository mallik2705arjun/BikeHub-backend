
const getBikeImage = async (query, isFallback = false) => {
  try {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc";
    }

    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${accessKey}`
    );
    
    if (!response.ok) {
      // If specific search failed, try fallback
      if (!isFallback) {
        const parts = query.split(" ");
        const brand = parts[0];
        const category = query.toLowerCase().includes("scooter") ? "scooter" : "motorcycle";
        const fallbackQuery = `${brand} ${category}`;
        console.warn(`Unsplash error for "${query}". Trying fallback: "${fallbackQuery}"`);
        return await getBikeImage(fallbackQuery, true);
      }
      return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc";
    }

    const data = await response.json();
    return data?.urls?.regular || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc";
  } catch (error) {
    if (!isFallback) {
      // Final fallback to generic category
      const category = query.toLowerCase().includes("scooter") ? "scooter" : "motorcycle";
      return await getBikeImage(category, true);
    }
    console.error("Unsplash Service Error:", error.message);
    return "https://images.unsplash.com/photo-1558981403-c5f9899a28bc";
  }
};

module.exports = { getBikeImage };
