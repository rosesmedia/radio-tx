import { prisma } from '@/lib/db';
import { getHandler } from '@/lib/handlers';
import { NextResponse } from 'next/server';

export const GET = getHandler(async () => {
  const ingestPoints = await prisma.ingestPoint.findMany();
  return NextResponse.json({
    ingestPoints,
  });
});
