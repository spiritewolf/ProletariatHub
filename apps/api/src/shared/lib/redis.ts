import Redis from 'ioredis';

let redisClient: Redis | undefined;

export function initRedis(url: string): Redis {
  redisClient = new Redis(url);
  return redisClient;
}

export function getRedis(): Redis {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis before handling requests.');
  }
  return redisClient;
}
