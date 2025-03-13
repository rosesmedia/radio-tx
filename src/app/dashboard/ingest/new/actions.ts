'use server';

import { prisma } from "@/lib/db";
import { action } from "@/lib/forms";
import { createIngestPointSchema } from "./schema";

export const createIngestPoint = action(createIngestPointSchema, async (create) => {
    return await prisma.ingestPoint.create({
        data: {
            name: create.name,
            icecastServer: create.icecastServer,
            icecastMount: create.icecastMount,
        },
    });
});
