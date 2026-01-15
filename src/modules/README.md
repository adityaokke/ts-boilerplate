# Modules

This directory contains **feature modules** (bounded contexts). Each module is self-contained and follows Clean Architecture principles.

## Structure

```
modules/
├── sample/          # Sample module (template for new modules)
└── [your-module]/   # Your feature modules
```

## What is a Module?

A module is a **self-contained feature** that encapsulates:
- Domain logic (entities, business rules)
- Application logic (use cases, validation)
- Infrastructure (repositories, external services)
- Interfaces (HTTP, GraphQL, gRPC, events)

## Creating a New Module

1. Copy `sample/` to `your-module/`
2. Rename all `Sample` references to your entity name
3. Register in `src/container.ts`
4. Mount routes in the container

## Module Independence

Each module can be:
- Developed independently by different teams
- Tested in isolation
- Extracted to a microservice when needed

## Cross-Module Communication

Modules can import from each other's public API (`index.ts`):

```typescript
// In another module
import { Sample, SampleStatus } from '@modules/sample/index.js';
```

When extracting to microservices, replace direct imports with API calls.
