import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = 'https://api-v2-mainnet.paras.id/featured-collections';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Paras API' });
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching featured collections:", error);
    res.status(500).json({ error: 'Server error fetching collections' });
  }
}