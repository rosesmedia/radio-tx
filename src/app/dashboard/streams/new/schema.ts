import { z } from 'zod';

export const createStreamSchema = z.object({
  fixtureId: z.string(),
  name: z.string(),
  ingestPoint: z
    .string()
    .nullable()
    .transform((s) => (s === '' ? null : s)),
});
