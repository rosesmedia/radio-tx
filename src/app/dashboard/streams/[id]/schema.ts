import { z } from 'zod';

export const startStreamSchema = z.object({
  id: z.string(),
});

export const setSourceSchema = z.object({
  id: z.string(),
  source: z.number().refine((v) => v >= 1 && v <= 4),
});
