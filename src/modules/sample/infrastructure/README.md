# Infrastructure Layer

Implements **outbound ports** defined in the domain layer. Contains all external dependencies (databases, APIs, etc.).

## Structure

```
infrastructure/
├── repositories/    # Data persistence implementations
├── clients/         # External API clients
└── schemas/         # Database indexes and schema definitions
```

## Repositories

Repositories implement the `SampleRepositoryPort` port:

```typescript
export class SampleRepository implements SampleRepositoryPort {
  constructor(private readonly db: Db) {}

  async save(sample: Sample): Promise<void> {
    await this.collection.updateOne(
      { _id: sample.id },
      { $set: toDocument(sample) },
      { upsert: true }
    );
  }

  async findById(id: string): Promise<Sample | null> {
    const doc = await this.collection.findOne({ _id: id });
    return doc ? toDomain(doc) : null;
  }
}
```

**Key patterns:**
- Implements outbound port interface
- Maps between domain entities and persistence format
- Uses `toDocument()` and `toDomain()` for mapping
- No business logic - pure data access

## Document Mapping

```typescript
// Domain → Persistence
const toDocument = (sample: Sample): SampleDocument => ({
  _id: sample.id,
  name: sample.name,
  description: sample.description,
  status: sample.status,
  metadata: sample.metadata,
  createdAt: sample.createdAt,
  updatedAt: sample.updatedAt,
});

// Persistence → Domain
const toDomain = (doc: SampleDocument): Sample =>
  Sample.fromPersistence({
    id: doc._id,
    name: doc.name,
    // ...
  });
```

## Clients

Clients implement external API communication:

```typescript
export class SampleClient implements SampleClientPort {
  constructor(
    private readonly config: Config,
    private readonly logger: Logger,
  ) {}

  async getById(id: string): Promise<Result<SampleClientResponse, SampleClientError>> {
    // HTTP request to external service
  }
}
```

## Adding New Implementations

When adding a new persistence layer (e.g., PostgreSQL):

1. Create `sample-repository-postgres.ts`
2. Implement `SampleRepositoryPort` interface
3. Register in `src/container.ts`
4. No changes needed in domain or application layers
