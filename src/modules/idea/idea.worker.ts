import { Worker, Job } from "bullmq";
import { ANALYSIS_QUEUE } from "../../config/queue";
import redis from "../../config/redis";
import { runFullPipeline, runStressTest, runRoast } from "../ai/pipeline/pipeline.service";
import { db } from "../../config/db";
import { ideas, users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { delCache, setCache } from "../../utils/cache";

const connection = redis;

export const analysisWorker = new Worker(
  ANALYSIS_QUEUE,
  async (job: Job) => {
    const { ideaId, idea, mode, context, userId } = job.data;
    console.log(`[Worker] Processing job ${job.id} for idea ${ideaId}`);

    try {
      // Fetch user plan
      const [user] = await db.select().from(users).where(eq(users.id, parseInt(userId))).limit(1);
      const plan = user?.plan || "free";

      let result;
      if (mode === "stress") {
        result = await runStressTest(idea, context, plan);
      } else if (mode === "roast") {
        result = await runRoast(idea, context, plan);
      } else {
        result = await runFullPipeline(idea, context, plan);
      }

      // Update Database
      await db
        .update(ideas)
        .set({ 
          result,
          status: "completed"
        })
        .where(eq(ideas.id, ideaId));

      // Cache the result
      const cacheKeyObj = { idea: idea.trim().toLowerCase(), mode, ...context };
      const crypto = await import("crypto");
      const cacheKey = `analysis:${crypto.createHash('md5').update(JSON.stringify(cacheKeyObj)).digest('hex')}`;
      await setCache(cacheKey, result, 86400);

      // Invalidate user caches
      await delCache(`user:profile:${userId}`);
      await delCache(`user:ideas:${userId}`);
      await delCache(`user:analytics:${userId}`);

      console.log(`[Worker] Job ${job.id} completed successfully`);
      return result;
    } catch (error) {
      console.error(`[Worker] Job ${job.id} failed:`, error);
      
      await db
        .update(ideas)
        .set({ status: "failed" })
        .where(eq(ideas.id, ideaId));
        
      throw error;
    }
  },
  { connection, concurrency: 2 }
);

analysisWorker.on("completed", (job) => {
  console.log(`Job ${job.id} has completed!`);
});

analysisWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});
