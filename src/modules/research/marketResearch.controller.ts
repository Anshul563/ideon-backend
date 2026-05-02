import { Request, Response } from "express";
import { getMarketTrends } from "./marketResearch.service";

export const getTrends = async (req: Request, res: Response) => {
  const { industry, targetAudience } = req.query;
  try {
    const trends = await getMarketTrends({ 
      industry: industry as string, 
      targetAudience: targetAudience as string 
    });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch market trends" });
  }
};
