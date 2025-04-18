import { postHandler } from '@/lib/handlers';
import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';

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
    return NextResponse.json(result);
  },
  {
    requireAuthentication: { token: env.STREAM_CONTROLLER_TOKEN! },
  }
);
