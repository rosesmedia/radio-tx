import { action } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const SegmentReady = z.object({
    filename: z.string(),
    ready: z.boolean().refine(arg => arg === true),
});

export const POST = action(SegmentReady, async (params: { id: string }, body) => {
    const { id: fixtureId } = params;
    const result = await prisma.hlsSegment.update({
        data: {
            ready: true,
        },
        where: {
            fixtureId,
            filename: body.filename,
        }
    });
    return NextResponse.json(result);
});
