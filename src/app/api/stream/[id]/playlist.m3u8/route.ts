import { getHandler } from '@/lib/handlers';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

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
  resp.push('#EXT-X-MEDIA-SEQUENCE:0');
  resp.push(`#PLAYLIST:${stream.name}`);
  // resp.push('#EXT-X-DISCONTINUITY-SEQUENCE:0');
  resp.push('#EXT-X-PLAYLIST-TYPE:EVENT');
  const entries = stream.HlsSegment.map(
    (segment) =>
      `#EXTINF:${segment.duration},\n${env.HLS_SEGMENTS_URL}/${stream.fixtureId}/${segment.filename}`
  );

  if (stream.state === 'Complete') {
    entries.push('#EXT-X-ENDLIST');
  }

  const playlist = [...resp, ...entries].join('\n');
  return new Response(playlist, {
    headers: {
      'Content-Type': 'application/vnd.apple.mpegurl',
    },
  });
});
