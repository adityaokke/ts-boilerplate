import { Redis } from 'ioredis';
import { config } from '@shared/infrastructure/config/env.js';
import type { Logger } from '@shared/domain/ports/logger.js';

let redis: Redis | null = null;

export const connectRedis = (logger: Logger): Redis => {
  if (redis) return redis;
  logger.info({ host: config.redis.host }, 'Connecting to Redis');
  const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password || undefined,
  });
  client.on('connect', () => logger.info({}, 'Connected to Redis'));
  client.on('error', (e: Error) => logger.error({ err: e.message }, 'Redis error'));
  redis = client;
  return client;
};

export const disconnectRedis = async (logger: Logger): Promise<void> => {
  if (redis) {
    await redis.quit();
    redis = null;
    logger.info({}, 'Disconnected from Redis');
  }
};

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    if (!redis) return false;
    await redis.ping();
    return true;
  } catch {
    return false;
  }
};
