import { createClient } from 'redis';
import logger from '../utils/logger';

// Redis client
let redisClient: ReturnType<typeof createClient> | null = null;

// Initialize Redis client
export async function initializeRedis() {
  try {
    // Check if Redis is enabled
    if (!process.env.REDIS_URL) {
      logger.info('Redis not configured, skipping initialization');
      return;
    }
    
    redisClient = createClient({
      url: process.env.REDIS_URL
    });
    
    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', { error: err });
    });
    
    await redisClient.connect();
    logger.info('Redis client connected successfully');
  } catch (error) {
    logger.error('Failed to initialize Redis client', { error });
    redisClient = null;
  }
}

// Get value from cache
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (!redisClient) return null;
  
  try {
    const value = await redisClient.get(key);
    if (value) {
      return JSON.parse(value) as T;
    }
    return null;
  } catch (error) {
    logger.error('Error getting value from cache', { key, error });
    return null;
  }
}

// Set value in cache
export async function setInCache<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
  if (!redisClient) return false;
  
  try {
    const stringValue = JSON.stringify(value);
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    logger.error('Error setting value in cache', { key, error });
    return false;
  }
}

// Delete value from cache
export async function deleteFromCache(key: string): Promise<boolean> {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Error deleting value from cache', { key, error });
    return false;
  }
}

// Flush cache (use with caution)
export async function flushCache(): Promise<boolean> {
  if (!redisClient) return false;
  
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    logger.error('Error flushing cache', { error });
    return false;
  }
}

export default {
  initializeRedis,
  getFromCache,
  setInCache,
  deleteFromCache,
  flushCache
};