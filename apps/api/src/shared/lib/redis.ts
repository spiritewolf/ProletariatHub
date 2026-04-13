import RedisStore from 'connect-redis';
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

export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000;
export const SESSION_MAX_AGE_SEC = Math.floor(SESSION_MAX_AGE_MS / 1000);

export function createSessionStore(redis: Redis): RedisStore {
  return new RedisStore({
    client: redis,
    prefix: 'sess:',
    ttl: SESSION_MAX_AGE_SEC,
  });
}
