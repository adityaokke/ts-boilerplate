# Shared

Cross-cutting concerns used by all modules. This code is **module-agnostic** and provides common infrastructure.

## Structure

```
shared/
├── domain/          # Shared domain primitives
├── application/     # Shared application concerns
├── infrastructure/  # Shared infrastructure implementations
└── common/          # Core utilities and types
```

## What Goes Here?

| Folder | Contains |
|--------|----------|
| `domain/` | Logger, EventPublisher, Cache interfaces |
| `application/` | Base errors, pagination DTOs |
| `infrastructure/` | Database connections, Redis, messaging |
| `common/` | Result type, utilities, constants |

## What Does NOT Go Here?

- Module-specific entities (go in `modules/[name]/domain/`)
- Module-specific use cases (go in `modules/[name]/application/`)
- Module-specific repositories (go in `modules/[name]/infrastructure/`)

## Dependency Rule

```
common → domain → application → infrastructure
```

Inner layers don't depend on outer layers.

## When Extracting a Module

Copy the entire `shared/` folder to your new microservice. It contains everything needed to run independently.
