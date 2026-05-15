import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redis from "../config/redis";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for development scalability
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 200, // Increased for testing and development flow
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: {
    message: "Too many auth attempts, please try again after an hour",
  },
});

export const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Increased for testing and development flow
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    // @ts-expect-error - ioredis type mismatch
    sendCommand: (...args: string[]) => redis.call(...args),
  }),
  message: {
    message: "Analysis limit reached for this hour. Please try again later.",
  },
});
