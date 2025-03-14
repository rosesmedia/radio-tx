'use server';

import { action } from "@/lib/forms";
import { deleteIngestPointSchema } from "./schema";
import { prisma } from "@/lib/db";
import { notifyIngestDeleted } from "@/lib/stream-controller";
import { redirect } from "next/navigation";

export const deleteIngestPoint = action<typeof deleteIngestPointSchema, void>(deleteIngestPointSchema, async ({ id }) => {
    await prisma.ingestPoint.delete({
        where: {
            id,
        },
    });
    await notifyIngestDeleted(id);
    redirect('/dashboard/ingest');
});
