# Common

Core utilities and types used throughout the application. This is the **innermost shared layer** with zero dependencies.

## Structure

```
common/
├── types/           # Core type definitions
├── constants/       # Application constants
└── utils/           # Helper functions
```

## Types

### Result<T, E>

Functional error handling without exceptions:

```typescript
import { ok, err, type Result } from './types/result.js';

// Creating results
const success = ok(value);
const failure = err(error);

// Using results
if (result.ok) {
  console.log(result.value);  // T
} else {
  console.log(result.error);  // E
}
```

### Branded Types

Type-safe IDs using branded types:

```typescript
import { Brand } from './types/branded.js';

type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

// Prevents accidental mixing
function getUser(id: UserId) { ... }
getUser(orderId);  // TypeScript error!
```

### Module Interface

Contract for module registration:

```typescript
import type { Module } from './types/module.js';

const sampleModule: Module = {
  name: 'sample',
  register: (container) => { ... },
  routes: (container) => router,
};
```

## Constants

Application-wide constants:

```typescript
import { ErrorCodes } from './constants/error-codes.js';
```

## Utils

### Async Utilities

```typescript
import { sleep, retry } from './utils/async.js';

await sleep(1000);  // Wait 1 second

const result = await retry(() => fetchData(), 3, 100);  // Retry 3 times
```
