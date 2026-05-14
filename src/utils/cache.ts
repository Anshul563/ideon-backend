import redis from "../config/redis";

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  } catch (err) {
    console.error(`Error getting cache for key ${key}:`, err);
    return null;
  }
};

export const setCache = async (key: string, data: any, ttl: number = 3600): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.error(`Error setting cache for key ${key}:`, err);
  }
};

export const delCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Error deleting cache for key ${key}:`, err);
  }
};

export const clearCachePrefix = async (prefix: string): Promise<void> => {
  try {
    const keys = await redis.keys(`${prefix}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error(`Error clearing cache prefix ${prefix}:`, err);
  }
};
