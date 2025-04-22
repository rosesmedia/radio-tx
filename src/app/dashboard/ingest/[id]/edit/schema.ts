import { z } from 'zod';

export const editIngestPointSchema = z.object({
  id: z.string(),
  name: z.string(),
  icecastServer: z.string(),
  icecastMount: z.string(),
});
