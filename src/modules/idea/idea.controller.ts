import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { ideas, users } from "../../db/schema";
import { generateEmbedding } from "../embedding/embedding.service";
import { getCache, setCache, delCache } from "../../utils/cache";
import { analysisQueue } from "../../config/queue";
import crypto from "crypto";

export const createIdea = async (req: any, res: any) => {
  const { 
    idea, 
    mode = "full", 
    targetAudience, 
    geographicScope,
    businessModel,
    budget
  } = req.body;
  const userId = req.user.id;

  // Check plan and usage
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const isPaid = user.plan && user.plan !== "free";

  // Daily Token Limit Logic for Free Tier
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all ideas by this user today - cast userId to string for text column match
  const userIdStr = String(userId);
  const ideasToday = await db.select().from(ideas)
    .where(eq(ideas.userId, userIdStr));
  
  const filteredToday = ideasToday.filter(i => new Date(i.createdAt!).getTime() >= today.getTime());
  
  // Count unique ideas today (ignoring mode)
  const uniqueIdeasToday = new Set(filteredToday.map(i => i.idea.trim().toLowerCase())).size;
  const isExistingIdeaToday = filteredToday.some(i => i.idea.trim().toLowerCase() === idea.trim().toLowerCase());

  if ((!user.plan || user.plan === "free")) {
    if (!isExistingIdeaToday && uniqueIdeasToday >= 3) {
      return res.status(403).json({ 
        message: "Daily limit reached (3 tokens). Upgrade for unlimited access.",
        limitReached: true,
        tokensLeft: 0
      });
    }
  }

  // Create a cache key based on the normalized idea and context
  const context = { targetAudience, geographicScope, businessModel, budget };
  const normalizedIdea = idea.trim().toLowerCase();
  const cacheKeyObj = { idea: normalizedIdea, mode, ...context };
  const cacheKey = `analysis:${crypto.createHash('md5').update(JSON.stringify(cacheKeyObj)).digest('hex')}`;

  // Check Redis Cache
  try {
    const cachedResult = await getCache<any>(cacheKey);
    if (cachedResult) {
      console.log("Redis Cache Hit!");
      
      // If we already have this exact idea in DB for this user today, just return the latest one
      if (isExistingIdeaToday) {
        const latestIdea = filteredToday
          .filter(i => i.idea.trim().toLowerCase() === normalizedIdea && i.mode === mode)
          .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())[0];
          
        if (latestIdea) {
          console.log("Returning existing DB record for today's duplicate idea");
          return res.json({ ...latestIdea, tokensLeft: isPaid ? 999 : Math.max(0, 3 - uniqueIdeasToday) });
        }
      }

      // Otherwise save to DB as a new history entry
      const [saved] = await db
        .insert(ideas)
        .values({
          id: uuidv4(),
          userId,
          idea,
          targetAudience,
          geographicScope,
          businessModel,
          budget,
          embedding: [],
          result: cachedResult,
          mode,
        })
        .returning();
        
      return res.json(saved);
    }
  } catch (cacheErr) {
    console.error("Redis Cache Error:", cacheErr);
  }

  const embedding = await generateEmbedding(idea);

  // Create pending entry in DB
  const ideaId = uuidv4();
  const [saved] = await db
    .insert(ideas)
    .values({
      id: ideaId,
      userId,
      idea,
      targetAudience,
      geographicScope,
      businessModel,
      budget,
      embedding,
      mode,
      status: "pending",
    })
    .returning();

  // Push to Queue
  await analysisQueue.add("analyze-idea", {
    ideaId,
    idea,
    mode,
    context,
    userId: userIdStr
  });

  // Calculate final tokens left to return to UI
  const finalUniqueCount = isExistingIdeaToday ? uniqueIdeasToday : uniqueIdeasToday + 1;
  const tokensLeft = isPaid ? 999 : Math.max(0, 3 - finalUniqueCount);

  // Invalidate profile cache so UI updates immediately
  await delCache(`user:profile:${userId}`);

  res.json({ ...saved, tokensLeft, message: "Analysis queued" });
};

export const getJobStatus = async (req: any, res: any) => {
  const { id } = req.params;
  
  try {
    const [idea] = await db
      .select()
      .from(ideas)
      .where(eq(ideas.id, id))
      .limit(1);

    if (!idea) return res.status(404).json({ message: "Job not found" });

    res.json({ 
      status: idea.status, 
      result: idea.result 
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getIdeaById = async (req: any, res: any) => {
  const { id } = req.params;

  const [idea] = await db
    .select()
    .from(ideas)
    .where(eq(ideas.id, id))
    .limit(1);

  if (!idea) {
    return res.status(404).json({ message: "Idea not found" });
  }

  res.json(idea);
};

import { desc } from "drizzle-orm";

export const getUserIdeas = async (req: any, res: any) => {
  const userIdStr = String(req.user.id);
  const cacheKey = `user:ideas:${userIdStr}`;

  try {
    const cached = await getCache<any[]>(cacheKey);
    if (cached) return res.json(cached);

    const userIdeas = await db
      .select()
      .from(ideas)
      .where(eq(ideas.userId, userIdStr))
      .orderBy(desc(ideas.createdAt));

    await setCache(cacheKey, userIdeas, 1800); // 30 min

    res.json(userIdeas);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const getAnalytics = async (req: any, res: any) => {
  const userIdStr = String(req.user.id);
  const cacheKey = `user:analytics:${userIdStr}`;

  try {
    const cached = await getCache<any>(cacheKey);
    if (cached) return res.json(cached);

    const userIdeas = await db
      .select()
      .from(ideas)
      .where(eq(ideas.userId, userIdStr));

    const total = userIdeas.length;
    if (total === 0) {
      return res.json({
        total: 0,
        avgScore: 0,
        verdicts: [],
        topConcepts: []
      });
    }

    let totalScore = 0;
    const verdictCounts: Record<string, number> = {};

    userIdeas.forEach(idea => {
      const resData = idea.result as any;
      // Use the actual path from the pipeline result
      const score = resData?.scoring?.scores?.overall || resData?.scoring?.totalScore || resData?.scoring?.score || 0;
      totalScore += Number(score);

      const verdict = resData?.scoring?.verdict || "Unknown";
      verdictCounts[verdict] = (verdictCounts[verdict] || 0) + 1;
    });

    const avgScore = (totalScore / total).toFixed(1);
    const verdicts = Object.entries(verdictCounts).map(([verdict, count]) => ({
      verdict,
      count
    })).sort((a, b) => b.count - a.count);

    const resData = {
      total,
      avgScore: Number(avgScore),
      verdicts
    };

    await setCache(cacheKey, resData, 1800); // 30 min

    res.json(resData);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
};
