import { z } from 'zod';

export const createSampleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  metadata: z.record(z.unknown()).optional(),
});
