import { z } from 'zod';

export const deleteIngestPointSchema = z.object({
  id: z.string(),
});
