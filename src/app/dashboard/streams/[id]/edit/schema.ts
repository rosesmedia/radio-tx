import { z } from 'zod';

export const editStreamSchema = z.object({
  previousId: z.string(),
  fixtureId: z.string(),
  name: z.string(),
  ingestPoint: z
    .string()
    .nullable()
    .transform((s) => (s === '' ? null : s)),
});
