import { getHandler } from "@/lib/handlers";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = getHandler(async ({ id }: { id: string }) => {
    const stream = await prisma.stream.findFirstOrThrow({
        where: {
            fixtureId: id,
        },
        include: {
            HlsSegment: {
                where: {
                    ready: true,
                },
                orderBy: {
                    index: 'asc',
                },
            },
        },
    })

    const resp = [];
    resp.push('#EXTM3U');
    resp.push('#EXT-X-TARGETDURATION:4');
    resp.push('#EXT-X-VERSION:3');
    resp.push('#EXT-X-MEDIA-SEQUENCE:212');
    const entries = stream.HlsSegment.map(segment => `#EXTINF:${segment.duration},\n${segment.filename}`);
    const playlist = [...resp, ...entries].join('\n');
    return new Response(playlist, {
        headers: {
            'Content-Type': 'application/vnd.apple.mpegurl',
        }
    })
});
