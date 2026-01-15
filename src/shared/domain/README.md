# Shared Domain

Shared domain primitives used across all modules. Contains **interfaces only** - no implementations.

## Structure

```
domain/
├── ports/           # Shared service interfaces
├── events/          # Base event types
└── errors/          # Base error classes
```

## Ports

Interfaces for cross-cutting services:

### Logger

```typescript
export type LogContext = Record<string, unknown>;

export type Logger = {
  info: (ctx: LogContext, msg: string) => void;
  error: (ctx: LogContext, msg: string) => void;
  warn: (ctx: LogContext, msg: string) => void;
  debug: (ctx: LogContext, msg: string) => void;
  child: (ctx: LogContext) => Logger;
};
```

### EventPublisher

```typescript
export type EventPublisher = {
  publish: <T>(event: DomainEvent<T>) => Promise<void>;
};
```

### Cache

```typescript
export type Cache = {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
};
```

## Events

Base domain event type:

```typescript
export type DomainEvent<T = unknown> = {
  readonly type: string;
  readonly payload: T;
  readonly occurredAt: Date;
};
```

## Errors

Base domain error class:

```typescript
export abstract class DomainError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
```
