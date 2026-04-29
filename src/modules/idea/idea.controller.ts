import { db } from "../../config/db";
import { ideas } from "../../db/schema";
import { runFullPipeline } from "../ai/pipeline/pipeline.service";
import { generateEmbedding } from "../embedding/embedding.service";


export const createIdea = async (req: any, res: any) => {
  const { idea } = req.body;
  const userId = req.user.id;

  const embedding = await generateEmbedding(idea);

  const result = await runFullPipeline(idea);

  const [saved] = await db
    .insert(ideas)
    .values({
      userId,
      idea,
      embedding,
      result,
    })
    .returning();

  res.json(saved);
};
