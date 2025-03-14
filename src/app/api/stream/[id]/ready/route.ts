import { prisma } from "@/lib/db";
import { postHandler } from "@/lib/handlers";
import { badRequest } from "@/lib/responses";
import { notifyStreamStarted } from "@/lib/stream-controller";
import { NextResponse } from "next/server";
import { z } from "zod";

const readySchema = z.object({});

export const POST = postHandler(readySchema, async ({ id }: { id: string }) => {
    const stream = await prisma.stream.findUniqueOrThrow({
        where: { fixtureId: id, },
    });
    if (stream.state === 'Complete') {
        return badRequest();
    }
    if (!stream.ingestPointId) {
        return badRequest();
    }

    // TODO: mark next segment as discontinuous if stream is already marked as live

    await prisma.stream.update({
        where: { fixtureId: id, },
        data: {
            state: 'Live',
        }
    });

    await notifyStreamStarted(stream.fixtureId, stream.ingestPointId);

    return NextResponse.json({
        ok: true,
    });
});
