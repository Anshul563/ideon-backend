import { Request, Response } from "express";
import { getUserIdeas, getAnalytics } from "./dashboard.service";

export const getHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const ideas = await getUserIdeas(userId, page, limit);

    res.json({
      page,
      limit,
      data: ideas,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardAnalytics = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const analytics = await getAnalytics(userId);

    res.json(analytics);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};