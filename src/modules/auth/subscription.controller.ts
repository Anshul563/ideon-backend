import { Response } from "express";
import { db } from "../../config/db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { delCache } from "../../utils/cache";

export const subscribe = async (req: any, res: Response) => {
  const { plan } = req.body;
  const userId = req.user.id;

  let endsAt: Date | null = null;
  const now = new Date();

  if (plan === "monthly") {
    endsAt = new Date(now.setMonth(now.getMonth() + 1));
  } else if (plan === "yearly") {
    endsAt = new Date(now.setFullYear(now.getFullYear() + 1));
  } else if (plan === "lifetime") {
    endsAt = null; // No expiry
  } else {
    endsAt = null;
  }

  await db.update(users)
    .set({ 
      plan, 
      subscriptionStatus: "active",
      subscriptionStartedAt: new Date(),
      subscriptionEndsAt: endsAt 
    })
    .where(eq(users.id, userId));
  
  // Invalidate caches
  await delCache(`user:profile:${userId}`);
  await delCache("admin:stats");

  res.json({ message: `Successfully subscribed to ${plan} plan` });
};
