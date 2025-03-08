import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { z } from "zod";
import { internalServerError, notFound } from "./responses";

export function action<Params, Body>(
    schema: z.ZodSchema<Body>,
    handler: (p: Params, body: Body) => Promise<Response>,
): (req: Request, { params }: { params: Promise<Params> }) => Promise<Response> {
    return async (req, { params: p }) => {
        const params = await p;
        const data = await req.json();
        const parseResult = schema.safeParse(data);
        if (parseResult.success) {
            try {
                return await handler(params, parseResult.data);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
                    return notFound();
                } else {
                    console.error('failed to handle action:', e);
                    return internalServerError();
                }
            }
        } else {
            return NextResponse.json({
                error: 'Bad request',
                issues: parseResult.error.issues,
            });
        }
    };
}
