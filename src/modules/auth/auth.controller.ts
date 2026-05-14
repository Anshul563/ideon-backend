import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { users } from "../../db/schema";
import { registerUser, loginUser } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.validation";
import { getCache, setCache, delCache } from "../../utils/cache";

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await registerUser(data);

    res.json({
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data.email, data.password);

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

import { ideas } from "../../db/schema";

export const getProfile = async (req: any, res: Response) => {
  const userId = req.user.id;
  const cacheKey = `user:profile:${userId}`;

  try {
    // Try to get from cache
    const cachedProfile = await getCache(cacheKey);
    if (cachedProfile) {
      return res.json(cachedProfile);
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate tokens left today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cast userId to string for text column comparison
    const userIdStr = String(userId);
    const userIdeasToday = await db.select().from(ideas)
      .where(eq(ideas.userId, userIdStr));
    
    const filteredToday = userIdeasToday.filter(i => {
      if (!i.createdAt) return false;
      return new Date(i.createdAt).getTime() >= today.getTime();
    });
    
    const uniqueIdeasToday = new Set(filteredToday.map(i => i.idea.trim().toLowerCase())).size;
    const isPaid = user.plan && user.plan !== "free";
    const tokensLeft = isPaid ? 999 : Math.max(0, 3 - uniqueIdeasToday);

    // Remove password from response
    const { password, ...safeUser } = user;
    const profileData = { ...safeUser, tokensLeft };

    // Set cache (TTL 10 minutes for profile as token counts change daily)
    await setCache(cacheKey, profileData, 600);

    res.json(profileData);
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfilePic = async (req: any, res: Response) => {
  const { url } = req.body;
  const userId = req.user.id;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    await db.update(users)
      .set({ profilePic: url })
      .where(eq(users.id, userId));
    
    // Invalidate cache
    await delCache(`user:profile:${userId}`);
    
    res.json({ message: "Profile picture updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};