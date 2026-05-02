import { v4 as uuidv4 } from "uuid";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { ideas, users } from "../../db/schema";
import { runFullPipeline, runStressTest, runRoast } from "../ai/pipeline/pipeline.service";
import { generateEmbedding } from "../embedding/embedding.service";


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
  
  // Count ideas created by user
  const userIdeas = await db.select().from(ideas).where(eq(ideas.userId, userId));

  if ((!user.plan || user.plan === "free") && userIdeas.length >= 3) {
    return res.status(403).json({ 
      message: "Free plan limit reached (3 analyses). Upgrade to continue.",
      limitReached: true 
    });
  }

  const embedding = await generateEmbedding(idea);

  let result;
  const context = { targetAudience, geographicScope, businessModel, budget };
  
  if (mode === "stress") {
    result = await runStressTest(idea, context);
  } else if (mode === "roast") {
    result = await runRoast(idea, context);
  } else {
    result = await runFullPipeline(idea, context);
  }

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
      embedding,
      result,
      mode,
    })
    .returning();

  res.json(saved);
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
