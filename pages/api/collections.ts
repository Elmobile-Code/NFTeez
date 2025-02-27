export default async function handler(req, res) {
  try {
    const response = await fetch("https://api-v2-mainnet.paras.id/featured-collections");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data); // Send response to frontend
  } catch (error) {
    console.error("API Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
}