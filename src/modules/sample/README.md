# Sample Module

A complete, production-ready module demonstrating Clean Architecture patterns. Use this as a **template** for creating new modules.

## Structure

```
sample/
├── domain/          # Core business logic (no dependencies)
├── application/     # Use cases and orchestration
├── infrastructure/  # External implementations
├── delivery/        # Entry points (HTTP, GraphQL, gRPC)
└── index.ts         # Public API for other modules
```

## Quick Reference

| Layer | Purpose | Dependencies |
|-------|---------|--------------|
| Domain | Entities, business rules | None |
| Application | Use cases, validation | Domain |
| Infrastructure | DB, external services | Domain, Application |
| Delivery | Controllers, routes | Application |

## Sample Entity

The `Sample` entity demonstrates:
- Status transitions (ACTIVE → INACTIVE → ARCHIVED)
- Immutable state updates
- Domain events on state changes

## Public API (index.ts)

Only export what other modules need:

```typescript
// What's exported
export { Sample, SampleStatus } from './domain/entities/sample.js';
export type { SampleRepositoryPort } from './domain/ports/outbound/sample-repository.js';
export type { SampleClientPort } from './domain/ports/outbound/sample-client.js';
export { SAMPLE_EVENTS } from './domain/events/index.js';
```

## Extracting as Microservice

To run this module as a standalone service:

1. Copy this folder to a new project
2. Copy `src/shared/` to the new project
3. Create container.ts, bootstrap.ts, shutdown.ts, server/ for the service
4. Replace cross-module imports with API calls
