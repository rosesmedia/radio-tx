import { z } from "zod";

export const createIngestPointSchema = z.object({
    name: z.string(),
    icecastServer: z.string(),
    icecastMount: z.string(),
});
