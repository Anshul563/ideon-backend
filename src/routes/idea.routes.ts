import { Router } from "express";
import { createIdea } from "../modules/idea/idea.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { findSimilarIdeas, generateEmbedding } from "../modules/embedding/embedding.service";


const router = Router();

router.post("/analyze", authMiddleware, createIdea);

router.post("/similar", async (req, res) => {
  const { idea } = req.body;

  const embedding = await generateEmbedding(idea);
  const similar = await findSimilarIdeas(embedding);

  res.json(similar);
});

export default router;