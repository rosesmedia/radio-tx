'use server';

import { prisma } from "@/lib/db";
import { action } from "@/lib/forms";
import { createStreamSchema } from "./schema";

export const createStream = action(createStreamSchema, async (create) => {
    if (create.ingestPoint !== null) {
        const ingestPoint = await prisma.ingestPoint.findFirstOrThrow({
            where: {
                id: create.ingestPoint,
            },
        });
        return await prisma.stream.create({
            data: {
                fixtureId: create.fixtureId,
                name: create.name,
                ingestPointId: ingestPoint.id,
            },
        });
    } else {
        return await prisma.stream.create({
            data: {
                fixtureId: create.fixtureId,
                name: create.name,
                state: 'Pending',
            },
        });
    }
});
