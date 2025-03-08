import { postHandler } from "@/lib/handlers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const newSegmentSchema = z.object({
    index: z.number(),
    timestamp: z.number(),
    filename: z.string(),
    duration: z.number(),
});

export const POST = postHandler(newSegmentSchema, async (params: { id: string }, segment) => {
    const { id: fixtureId } = params;
    const stream = await prisma.stream.findUniqueOrThrow({
        where: { fixtureId },
    });
    const newSegment = await prisma.hlsSegment.create({
        data: {
            fixtureId: stream.fixtureId,
            index: segment.index,
            duration: segment.duration,
            filename: segment.filename,
            timestamp: segment.timestamp
        }
    });

    return NextResponse.json(newSegment);
});
