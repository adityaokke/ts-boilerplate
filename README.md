# Modular Clean Architecture TypeScript Boilerplate

Production-ready TypeScript microservice following **Modular Clean Architecture** with Awilix DI. Each module is self-contained and can be easily extracted into a dedicated microservice.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         src/ ROOT                               │
│              (container, bootstrap, shutdown, http)             │
├─────────────────────────────────────────────────────────────────┤
│                        MODULES                                   │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │   Sample    │  │   [Your]    │  │   [Your]    │            │
│   │   Module    │  │   Module    │  │   Module    │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│                         SHARED                                   │
│    (Infrastructure, Domain Ports, Application Errors, Utils)    │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
src/
├── container.ts             # DI container (loads all modules)
├── bootstrap.ts             # App startup
├── shutdown.ts              # Graceful shutdown
├── server/                    # Express server setup
│
├── modules/                 # Feature modules (bounded contexts)
│   └── sample/              # Sample module - SELF-CONTAINED
│       ├── domain/          # Entities, ports, events, errors
│       ├── application/     # Use cases, validators
│       ├── infrastructure/  # Repositories, Clients
│       ├── delivery/        # HTTP, GraphQL, gRPC, Events
│       └── index.ts         # Public API
│
└── shared/                  # Cross-cutting concerns
    ├── domain/              # Logger, EventPublisher, Cache ports
    ├── application/         # Errors, DTOs (pagination)
    ├── infrastructure/      # DB, Cache, Messaging, Logger
    └── common/              # Types, Constants, Utils
```

## Module Structure

Each module follows the same clean architecture pattern:

```
modules/sample/
├── domain/
│   ├── entities/        # Sample entity with status transitions
│   ├── ports/
│   │   ├── inbound/     # CreateSample, GetSample, ListSamples
│   │   └── outbound/    # SampleRepositoryPort, SampleClientPort
│   ├── events/          # SampleCreated, SampleUpdated, SampleArchived
│   └── errors/          # SampleNotFoundError, etc.
├── application/
│   ├── usecases/        # CreateSampleUseCase, GetSampleUseCase, etc.
│   └── validators/      # Zod validation schemas
├── infrastructure/
│   ├── repositories/    # SampleRepository
│   └── clients/         # SampleClient (external APIs)
├── delivery/
│   ├── http/            # Controller, Routes
│   ├── graphql/         # Schema, Resolvers
│   ├── grpc/            # Proto, Handler
│   └── events/          # Event handlers
└── index.ts             # Public API for other modules
```

## Quick Start

```bash
npm install
cp .env.example .env
docker-compose up -d
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/samples` | Create sample |
| GET | `/api/samples` | List samples |
| GET | `/api/samples/:id` | Get sample by ID |
| GET | `/api/health` | Health check |
| GET | `/api/ready` | Readiness check |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run typecheck` | Type checking |
| `npm run clean:sample` | Remove sample module |

## Creating a New Module

1. Copy `src/modules/sample/` to `src/modules/your-module/`
2. Rename all `Sample` references to your entity name
3. Register in `src/container.ts`:
   - Import from your module
   - Register repositories, use cases, controllers
   - Mount routes
4. Create indexes in `bootstrap.ts`

## Extracting a Module to Microservice

To extract the `sample` module as a standalone microservice:

1. Copy `src/modules/sample/` to a new project
2. Copy `src/shared/` to the new project
3. Create container.ts, bootstrap.ts, shutdown.ts, server/ for the new service
4. Update any cross-module imports to API calls
5. Done! Module runs independently

## Code Flow

### Application Startup

```
index.ts
    │
    ▼
container.ts ──────────────────────────────────────────────────────┐
    │  1. Create Awilix container                                  │
    │  2. Register shared infrastructure (config, logger, db)      │
    │  3. Register module dependencies (repos, usecases, controllers)
    │  4. Register event handlers                                  │
    │  5. Create Express app and mount routes                      │
    │                                                              │
    ▼                                                              │
bootstrap.ts                                                       │
    │  1. Create database indexes                                  │
    │  2. Start HTTP server                                        │
    │  3. Start event stream consumer                              │
    │                                                              │
    ▼                                                              │
[Server Running] ◄─────────────────────────────────────────────────┘
```

### HTTP Request Flow (Create Sample)

```
POST /api/samples
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│ DELIVERY LAYER                                                  │
│                                                                 │
│  routes.ts ──► controller.ts                                    │
│                    │                                            │
│                    │ Extracts request body                      │
│                    │ Calls use case                             │
└────────────────────┼────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│ APPLICATION LAYER                                               │
│                                                                 │
│  CreateSampleUseCase.execute(input)                             │
│       │                                                         │
│       ├──► 1. Validate input (Zod schema)                       │
│       ├──► 2. Check business rules (duplicate name?)            │
│       ├──► 3. Create entity: Sample.create()                    │
│       ├──► 4. Save via repository                               │
│       ├──► 5. Publish domain event                              │
│       └──► 6. Return Result<Sample, Error>                      │
│                                                                 │
└────────────────────┼────────────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
┌─────────────────┐    ┌─────────────────────────────────────────┐
│ DOMAIN LAYER    │    │ INFRASTRUCTURE LAYER                    │
│                 │    │                                         │
│  Sample.create()│    │  SampleRepository.save()                │
│       │         │    │       │                                 │
│       ▼         │    │       ▼                                 │
│  New Sample     │    │  MongoDB insert/update                  │
│  entity with    │    │                                         │
│  ACTIVE status  │    │  RedisEventPublisher.publish()          │
│                 │    │       │                                 │
└─────────────────┘    │       ▼                                 │
                       │  Redis Stream XADD                      │
                       │                                         │
                       └─────────────────────────────────────────┘
```

### Domain Event Flow

```
Use Case publishes event
         │
         ▼
RedisEventPublisher.publish()
         │
         ▼
Redis Stream (XADD)
         │
         ▼
RedisStreamConsumer (XREADGROUP)
         │
         ▼
SampleCreatedHandler.handle()
         │
         ▼
[Side effects: notifications, cache, analytics, etc.]
```

### Dependency Direction

```
┌─────────────────────────────────────────────────────────────────┐
│                         DELIVERY                                │
│                    (HTTP, GraphQL, gRPC)                        │
│                            │                                    │
│                            ▼                                    │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                      APPLICATION                            │ │
│ │                      (Use Cases)                            │ │
│ │                          │                                  │ │
│ │                          ▼                                  │ │
│ │ ┌─────────────────────────────────────────────────────────┐ │ │
│ │ │                       DOMAIN                            │ │ │
│ │ │              (Entities, Ports, Events)                  │ │ │
│ │ │                                                         │ │ │
│ │ │  * No external dependencies                             │ │ │
│ │ │  * Defines interfaces (ports)                           │ │ │
│ │ │  * Pure business logic                                  │ │ │
│ │ └─────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                            ▲                                    │
│                            │                                    │
│                     INFRASTRUCTURE                              │
│              (Repositories, External Services)                  │
│                                                                 │
│  * Implements domain ports                                      │
│  * Depends on domain interfaces                                 │
└─────────────────────────────────────────────────────────────────┘

Dependencies point INWARD toward domain.
Infrastructure implements interfaces defined by domain.
```

## Key Patterns

- **Modular Architecture**: Each feature is self-contained and extractable
- **Clean Architecture**: Dependencies point inward toward domain
- **Ports & Adapters**: Domain defines contracts, infrastructure implements
- **Result Type**: Explicit error handling with `Result<T, E>`
- **Domain Events**: Async operations via Redis Streams
- **Dependency Injection**: Awilix container for composition

## Cross-Module Communication

Modules can import from each other's public API:

```typescript
// In another module
import { Sample, SampleStatus, SAMPLE_EVENTS } from '@modules/sample/index.js';
```

When extracting to microservices, replace direct imports with API calls.
