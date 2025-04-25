import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { postHandler } from '@/lib/handlers';
import { badRequest } from '@/lib/responses';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const readySchema = z.object({});

export const POST = postHandler(
  readySchema,
  async ({ id }: { id: string }) => {
    const stream = await prisma.stream.findUniqueOrThrow({
      where: { fixtureId: id },
    });
    if (stream.state === 'Complete') {
      return badRequest();
    }
    if (!stream.ingestPointId) {
      return badRequest();
    }

    // TODO: mark next segment as discontinuous if stream is already marked as live

    let port: number;
    while (true) {
      port = 13500 + Math.floor(Math.random() * 1000);
      const portExists = await prisma.stream.count({
        where: {
          controlPort: port,
        },
      });
      if (portExists === 0) {
        break;
      }
    }

    await prisma.stream.update({
      where: { fixtureId: id },
      data: {
        controlPort: port,
      },
    });

    return NextResponse.json({
      port,
    });
  },
  {
    requireAuthentication: { token: env.STREAM_CONTROLLER_TOKEN! },
  }
);
