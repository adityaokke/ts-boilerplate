/**
 * Script to remove all sample module files and all README files from the boilerplate
 * Run with: npm run clean:sample
 *
 * After running this script:
 * 1. Update src/container.ts to remove sample module imports
 * 2. Create your own module following the same structure
 */

import { rmSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// List of sample files and directories to remove
const filesToRemove = [
  // Sample module (entire directory)
  'src/modules/sample',

  // Tests - Sample
  'tests/unit/domain/entities/sample.test.ts',
  'tests/unit/application/usecases/sample',
  'tests/mocks/repositories/sample-repository.ts',

  // All README files
  'README.md',
  'src/modules/README.md',
  'src/shared/README.md',
  'src/shared/domain/README.md',
  'src/shared/application/README.md',
  'src/shared/infrastructure/README.md',
  'src/shared/common/README.md',
  'tests/README.md',
];

console.log('Cleaning sample module files and README...\n');

let removedCount = 0;
let skippedCount = 0;

for (const file of filesToRemove) {
  const fullPath = join(rootDir, file);

  if (existsSync(fullPath)) {
    try {
      rmSync(fullPath, { recursive: true, force: true });
      console.log(`  Removed: ${file}`);
      removedCount++;
    } catch (error) {
      console.error(`  Error removing ${file}:`, error.message);
    }
  } else {
    console.log(`  Skipped (not found): ${file}`);
    skippedCount++;
  }
}

console.log(`\nDone! Removed ${removedCount} items, skipped ${skippedCount} items.`);
console.log(`
Next steps:
1. Update src/container.ts:
   - Remove sample module imports
   - Remove sample module registrations
   - Remove sample routes mounting

2. Create your own module in src/modules/your-module/ following the structure:
   src/modules/your-module/
   ├── domain/
   │   ├── entities/
   │   ├── interfaces/
   │   ├── events/
   │   └── errors/
   ├── application/
   │   ├── usecases/
   │   └── validators/
   ├── infrastructure/
   │   └── repositories/
   ├── delivery/
   │   ├── http/
   │   ├── graphql/
   │   └── grpc/
   └── index.ts
`);
