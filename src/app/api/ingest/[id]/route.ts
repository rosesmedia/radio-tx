import { prisma } from '@/lib/db';
import { env } from '@/lib/env';
import { getHandler } from '@/lib/handlers';
import { NextResponse } from 'next/server';

export const GET = getHandler(async ({ id }: { id: string }) => {
  const ingestPoint = await prisma.ingestPoint.findUniqueOrThrow({
    where: { id },
  });
  return NextResponse.json(ingestPoint);
}, {
  requireAuthentication: {
    token: env.STREAM_CONTROLLER_TOKEN!,
  },
});
