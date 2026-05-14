import { Queue, Worker, Job } from "bullmq";
import redis from "./redis";

// Queue names
export const ANALYSIS_QUEUE = "analysis-queue";

// Connection config
// We use the shared redis instance which already handles the REDIS_URL
const connection = redis;

// Initialize Queues
export const analysisQueue = new Queue(ANALYSIS_QUEUE, { 
  connection,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  }
});

// Shared worker logic placeholder
// The actual worker will be implemented in a separate file to keep the server clean
