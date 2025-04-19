import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { getHandler } from "@/lib/handlers";
import { badRequest } from "@/lib/responses";
import { toStreamInfo } from "@/lib/stream";
import { Stream } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = getHandler(async (_: undefined, req) => {
  const state = req.nextUrl.searchParams.get('state');

  let streams: Stream[];
  if (state === null || state === 'live') {
    streams = await prisma.stream.findMany({
      where: { state: 'Live' },
    });
  } else if (state === 'complete') {
    streams = await prisma.stream.findMany({
      where: { state: 'Complete' },
    });
  } else if (state === 'pending') {
    streams = await prisma.stream.findMany({
      where: { state: 'Pending' },
    });
  } else {
    return badRequest();
  }

  return NextResponse.json({
    streams: streams.map(toStreamInfo)
  });
});
