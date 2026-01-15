# Shared Infrastructure

Shared infrastructure implementations for databases, caching, messaging, and logging.

## Structure

```
infrastructure/
├── config/          # Environment configuration
├── database/        # Database connections
├── cache/           # Redis cache implementation
├── messaging/       # Event streaming (Redis Streams)
└── logger/          # Pino logger implementation
```

## Config

Environment variables validated with Zod:

```typescript
import { config } from './config/env.js';

config.http.port   // number
config.mongo.uri   // string
config.redis.host  // string
config.log.level   // 'debug' | 'info' | 'warn' | 'error'
```

## Database

MongoDB connection management:

```typescript
import { connectMongo, disconnectMongo } from './database/mongodb/connection.js';

const db = await connectMongo(logger);
await disconnectMongo(logger);
```

## Cache

Redis cache implementing the `Cache` port:

```typescript
import { RedisCache } from './cache/redis/cache.js';

const cache = new RedisCache(redis);
await cache.set('key', value, 3600);  // TTL in seconds
const cached = await cache.get<MyType>('key');
```

## Messaging

Redis Streams for event publishing/consuming:

```typescript
// Publisher
const publisher = new RedisEventPublisher(redis, logger);
await publisher.publish({ type: 'sample.created', payload, occurredAt: new Date() });

// Consumer
const consumer = new RedisStreamConsumer(redis, 'my-group', 'consumer-1', logger);
consumer.registerHandler<MyPayload>('sample.created', async (id, data) => {
  // Handle event
});
await consumer.start();
```

## Logger

Pino logger implementing the `Logger` port:

```typescript
import { createLogger } from './logger/pino.js';

const logger = createLogger();
logger.info({ userId: '123' }, 'User logged in');

const childLogger = logger.child({ requestId: 'abc' });
```
