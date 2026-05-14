import { Request, Response } from "express";
import { db } from "../../config/db";
import { supportTickets } from "../../db/schema";

export const submitTicket = async (req: any, res: Response) => {
  const { name, email, category, message } = req.body;
  const userId = req.user ? String(req.user.id) : null;

  if (!name || !email || !category || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.insert(supportTickets).values({
      userId,
      name,
      email,
      category,
      message,
      status: "Open",
    });

    res.json({ message: "Support ticket submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getTickets = async (req: any, res: Response) => {
  try {
    const tickets = await db.select().from(supportTickets).orderBy(supportTickets.createdAt);
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
