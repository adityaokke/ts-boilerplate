import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  GRPC_PORT: z.coerce.number().default(50051),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  MONGO_URI: z.string().default('mongodb://localhost:27017'),
  MONGO_DB_NAME: z.string().default('clean-arch'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  STREAM_KEY: z.string().default('events'),
  STREAM_CONSUMER_GROUP: z.string().default('app-service'),
  STREAM_CONSUMER_NAME: z.string().default('consumer-1'),
  STREAM_BATCH_SIZE: z.coerce.number().default(10),
  STREAM_BLOCK_MS: z.coerce.number().default(5000),
  SAMPLE_CLIENT_URL: z.string().optional(),
});

const env = envSchema.parse(process.env);

export type Config = typeof config;

export const config = {
  env: env.NODE_ENV,
  isDev: env.NODE_ENV === 'development',
  http: { port: env.PORT },
  grpc: { port: env.GRPC_PORT },
  log: { level: env.LOG_LEVEL },
  mongo: { uri: env.MONGO_URI, dbName: env.MONGO_DB_NAME },
  redis: { host: env.REDIS_HOST, port: env.REDIS_PORT, password: env.REDIS_PASSWORD },
  stream: {
    key: env.STREAM_KEY,
    consumerGroup: env.STREAM_CONSUMER_GROUP,
    consumerName: env.STREAM_CONSUMER_NAME,
    batchSize: env.STREAM_BATCH_SIZE,
    blockMs: env.STREAM_BLOCK_MS,
  },
  sampleClientUrl: env.SAMPLE_CLIENT_URL,
} as const;
