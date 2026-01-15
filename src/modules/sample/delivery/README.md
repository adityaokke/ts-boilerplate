# Delivery Layer

Entry points for the module. Adapts external protocols (HTTP, GraphQL, gRPC) to use cases.

## Structure

```
delivery/
├── http/            # REST API
│   ├── controller.ts
│   └── routes.ts
├── graphql/         # GraphQL API
│   ├── schema.graphql
│   └── resolvers.ts
├── grpc/            # gRPC API
│   ├── sample.proto
│   └── handler.ts
└── events/          # Event handlers
    └── handlers/
```

## HTTP Delivery

### Controller

Handles HTTP-specific concerns and delegates to use cases:

```typescript
export class SampleController {
  constructor(
    private readonly createSample: CreateSample,
    private readonly getSample: GetSample,
    private readonly listSamples: ListSamples,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    const result = await this.createSample.execute(req.body);
    if (!result.ok) return next(result.error);
    res.status(201).json(result.value);
  }
}
```

### Routes

Express router configuration:

```typescript
export const createSampleRoutes = (controller: SampleController): Router => {
  const router = Router();
  router.post('/samples', controller.create);
  router.get('/samples', controller.list);
  router.get('/samples/:id', controller.getById);
  return router;
};
```

## GraphQL Delivery

Schema and resolvers for GraphQL API.

## gRPC Delivery

Protocol buffer definitions and handlers for gRPC API.

## Event Handlers

Handlers for domain events from other modules or external sources:

```typescript
export class SampleCreatedHandler {
  async handle(event: SampleCreatedEvent): Promise<void> {
    // React to sample creation (notifications, analytics, etc.)
  }
}
```
