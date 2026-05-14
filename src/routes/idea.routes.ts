import { Router } from "express";
import { createIdea, getIdeaById, getUserIdeas, getAnalytics, getJobStatus } from "../modules/idea/idea.controller";
import { getTrends } from "../modules/research/marketResearch.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { findSimilarIdeas, generateEmbedding } from "../modules/embedding/embedding.service";
import { analysisLimiter } from "../middleware/rate-limit.middleware";


const router = Router();

router.post("/analyze", authMiddleware, analysisLimiter, createIdea);
router.get("/status/:id", authMiddleware, getJobStatus);
router.get("/history", authMiddleware, getUserIdeas);
router.get("/analytics", authMiddleware, getAnalytics);
router.get("/research", authMiddleware, getTrends);
router.get("/:id", authMiddleware, getIdeaById);

router.post("/similar", async (req, res) => {
  const { idea } = req.body;

  const embedding = await generateEmbedding(idea);
  const similar = await findSimilarIdeas(embedding);

  res.json(similar);
});

export default router;