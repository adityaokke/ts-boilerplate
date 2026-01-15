# Application Layer

The **orchestration layer** that implements use cases by coordinating domain objects and infrastructure.

## Structure

```
application/
├── usecases/        # Use case implementations
└── validators/      # Input validation schemas
```

## Use Cases

Use cases implement the **inbound ports** from the domain layer:

```typescript
export class CreateSampleUseCase implements CreateSample {
  constructor(
    private readonly sampleRepository: SampleRepositoryPort,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: Logger,
  ) {}

  async execute(input: CreateSampleInput): Promise<Result<Sample, ApplicationError>> {
    // 1. Validate input
    // 2. Check business rules
    // 3. Create entity
    // 4. Persist
    // 5. Publish events
    // 6. Return result
  }
}
```

**Key patterns:**
- Implements inbound port interface
- Returns `Result<T, E>` for explicit error handling
- Depends on outbound ports (injected via constructor)
- Orchestrates but doesn't contain business logic

## Available Use Cases

| Use Case | Description |
|----------|-------------|
| `CreateSampleUseCase` | Creates a new sample with validation |
| `CreateSampleWithClientUseCase` | Creates sample with external API sync |
| `GetSampleUseCase` | Retrieves a sample by ID |
| `ListSamplesUseCase` | Lists samples with pagination |

## Validators

Zod schemas for input validation:

```typescript
export const createSampleSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  metadata: z.record(z.unknown()).optional(),
});
```

Validation happens at the **use case boundary**, not in controllers.

## Error Handling

Use cases return `Result<T, E>` instead of throwing:

```typescript
// Success
return Result.ok(sample);

// Failure
return Result.fail(new ValidationError('Invalid input', issues));
return Result.fail(new ConflictError('Sample', 'name', input.name));
```
