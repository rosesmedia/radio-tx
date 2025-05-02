import { postHandler } from '@/lib/handlers';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { redis, USE_REDIS } from '@/lib/redis';

const segmentReadySchema = z.object({
  filename: z.string(),
  ready: z.boolean().refine((arg) => arg === true),
});

export const POST = postHandler(
  segmentReadySchema,
  async (params: { id: string }, body) => {
    const { id: fixtureId } = params;
    const result = await prisma.hlsSegment.update({
      data: {
        ready: true,
      },
      where: {
        fixtureId,
        filename: body.filename,
      },
    });
    if (USE_REDIS) {
      await redis.rPush(
        `stream:${fixtureId}:segments`,
        `#EXTINF:${result.duration},\n${env.HLS_SEGMENTS_URL}/${result.fixtureId}/${result.filename}`
      );
    }
    return NextResponse.json(result);
  },
  {
    requireAuthentication: { token: env.STREAM_CONTROLLER_TOKEN! },
  }
);
