import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tokenSeriesId, contractId } = req.query;

  if (!tokenSeriesId || !contractId) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  const apiUrl = `https://api-v2-mainnet.paras.id/token?token_series_id=${tokenSeriesId}&contract_id=${contractId}&__limit=12&__sort=price::1`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch from Paras API" });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching from Paras API:", error);
    res.status(500).json({ error: "Server error fetching data" });
  }
}