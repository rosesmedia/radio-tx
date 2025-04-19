import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { internalServerError, notFound, unauthorized } from './responses';

async function wrapHandler(
  handler: () => Promise<Response>
): Promise<Response> {
  try {
    return await handler();
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      return notFound();
    } else {
      console.error('failed to handle action:', e);
      return internalServerError();
    }
  }
}

export interface HandlerOptions {
  requireAuthentication?: { token: string };
}

function checkAuth(req: Request, options?: HandlerOptions): boolean {
  const requireToken = options?.requireAuthentication?.token;
  if (requireToken) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return false;
    if (authHeader !== `Bearer ${requireToken}`) return false;
  }
  return true;
}

export function getHandler<Params>(
  handler: (p: Params, req: NextRequest) => Promise<Response>,
  options?: HandlerOptions
): (
  req: NextRequest,
  { params }: { params: Promise<Params> }
) => Promise<Response> {
  return async (req, { params: p }) => {
    if (!checkAuth(req, options)) {
      return unauthorized();
    }
    const params = await p;
    return await wrapHandler(() => handler(params, req));
  };
}

export function postHandler<Params, Body>(
  schema: z.ZodSchema<Body>,
  handler: (p: Params, body: Body) => Promise<Response>,
  options?: HandlerOptions
): (
  req: Request,
  { params }: { params: Promise<Params> }
) => Promise<Response> {
  return async (req, { params: p }) => {
    const params = await p;
    if (!checkAuth(req, options)) {
      return unauthorized();
    }
    const data = await req.json();
    const parseResult = schema.safeParse(data);
    if (parseResult.success) {
      return await wrapHandler(() => handler(params, parseResult.data));
    } else {
      return NextResponse.json(
        {
          error: 'Bad request',
          issues: parseResult.error.issues,
        },
        {
          status: 400,
        }
      );
    }
  };
}
