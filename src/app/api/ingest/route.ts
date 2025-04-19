import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { getHandler } from '@/lib/handlers';
import { NextResponse } from 'next/server';

export const GET = getHandler(
  async () => {
    const ingestPoints = await prisma.ingestPoint.findMany();
    return NextResponse.json({
      ingestPoints,
    });
  },
  {
    requireAuthentication: {
      token: env.STREAM_CONTROLLER_TOKEN!,
    },
  }
);
