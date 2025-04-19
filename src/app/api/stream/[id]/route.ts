import { prisma } from '@/lib/db';
import { getHandler } from '@/lib/handlers';
import { toStreamInfo } from '@/lib/stream';
import { NextResponse } from 'next/server';

export const GET = getHandler(async ({ id }: { id: string }) => {
  const stream = await prisma.stream.findUniqueOrThrow({
    where: { fixtureId: id },
  });
  return NextResponse.json(toStreamInfo(stream));
});
