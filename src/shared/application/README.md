# Shared Application

Shared application concerns used across all modules.

## Structure

```
application/
├── errors/          # Application-level errors
└── dtos/            # Common DTOs (pagination, etc.)
```

## Errors

Application errors with HTTP status code mapping:

| Error | Status | Usage |
|-------|--------|-------|
| `ValidationError` | 400 | Invalid input data |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Duplicate resource |
| `ApplicationError` | 500 | Base class |

### Usage

```typescript
// In use cases
if (!valid) {
  return Result.fail(new ValidationError('Invalid input', issues));
}

if (exists) {
  return Result.fail(new ConflictError('Sample', 'name', input.name));
}

const sample = await repository.findById(id);
if (!sample) {
  return Result.fail(new NotFoundError('Sample', id));
}
```

## DTOs

### Pagination

```typescript
import type { PaginatedResult } from '@shared/application/dtos/pagination.js';

// Result type
type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};
```

### Helper

```typescript
import { paginate } from '@shared/application/dtos/pagination.js';

// Build paginated response
const result = paginate(items, total, page, limit);
// Returns { data: T[], meta: PaginationMeta }
```
