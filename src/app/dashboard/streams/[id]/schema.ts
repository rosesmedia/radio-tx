import { z } from "zod";

export const startStreamSchema = z.object({
    id: z.string(),
});
