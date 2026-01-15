import type { Redis } from 'ioredis';
import type { Cache } from '@shared/domain/ports/cache.js';

export class RedisCache implements Cache {
  constructor(private readonly redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async setNX<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      const result = await this.redis.set(key, serialized, 'EX', ttlSeconds, 'NX');
      return result === 'OK';
    }
    const result = await this.redis.setnx(key, serialized);
    return result === 1;
  }
}
