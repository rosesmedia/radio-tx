import { prisma } from "@/lib/db";
import { getHandler } from "@/lib/handlers";
import { NextResponse } from "next/server";

export const GET = getHandler(async ({ id }: { id: string; }) => {
    const ingestPoint = await prisma.ingestPoint.findUniqueOrThrow({ where: { id } });
    return NextResponse.json(ingestPoint);
});
