import { getHandler } from "@/lib/handlers";
import { prisma } from "@/lib/db";

const BASE_URL = 'http://localhost:3001/hls/';

export const GET = getHandler(async ({ id }: { id: string }) => {
    const stream = await prisma.stream.findFirstOrThrow({
        where: {
            fixtureId: id,
            state: {
                in: ['Live', 'Complete'],
            },
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
    });

    const resp = [];
    resp.push('#EXTM3U');
    resp.push('#EXT-X-TARGETDURATION:4');
    resp.push('#EXT-X-VERSION:3');
    resp.push('#EXT-X-MEDIA-SEQUENCE:212');
    resp.push('#EXT-X-PLAYLIST-TYPE:EVENT');
    const entries = stream.HlsSegment.map(segment => `#EXTINF:${segment.duration},\n${BASE_URL}${segment.filename}`);

    if (stream.state === 'Complete') {
        entries.push('#EXT-X-ENDLIST');
    }

    const playlist = [...resp, ...entries].join('\n');
    return new Response(playlist, {
        headers: {
            'Content-Type': 'application/vnd.apple.mpegurl',
        }
    })
});
