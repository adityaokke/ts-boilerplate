# Domain Layer

The **innermost layer** containing core business logic. This layer has **zero external dependencies**.

## Structure

```
domain/
├── entities/        # Business objects with behavior
├── ports/           # Interfaces (contracts)
│   ├── inbound/     # Use case interfaces
│   └── outbound/    # Repository/service interfaces
├── events/          # Domain events
└── errors/          # Domain-specific errors
```

## Entities

Entities are the core business objects:

```typescript
// Sample entity with status state machine
const sample = Sample.create({ name: 'Test' });  // ACTIVE
const inactive = Sample.deactivate(sample);       // INACTIVE
const archived = Sample.archive(inactive);        // ARCHIVED
```

**Key patterns:**
- Immutable - methods return new instances
- Static factory methods (`create`, `fromPersistence`)
- Business rule enforcement (can't activate archived)

## Ports

Ports define **contracts** that outer layers must implement:

**Inbound Ports** - What the module can do:
- `CreateSample` - Create a new sample
- `GetSample` - Retrieve by ID
- `ListSamples` - List with pagination

**Outbound Ports** - What the module needs:
- `SampleRepositoryPort` - Data persistence
- `SampleClientPort` - External API communication

## Events

Domain events signal important state changes:

```typescript
// Published when sample is created
{ type: 'sample.created', payload: { id, name, status } }
```

## Errors

Domain-specific errors for business rule violations:

```typescript
throw new SampleNotFoundError(id);
throw new InvalidStatusTransitionError('ARCHIVED', 'ACTIVE');
```
