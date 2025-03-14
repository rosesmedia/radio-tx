import { getServerSession, User } from "next-auth";
import { z, ZodTypeAny } from "zod";
import { authOptions } from "./auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { env } from "process";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Result, SafeError } from "./form-types";

export function action<T extends ZodTypeAny, R = void>(
    schema: T,
    action: (data: z.infer<T>, user: Omit<User, 'id'>) => Promise<R>,
): (data: unknown) => Promise<Result<R>> {
    return async (data) => {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return { ok: false, error: 'permission' };
        }
        const payload = schema.safeParse(data);
        if (!payload.success) {
            return {
                ok: false,
                error: 'validation',
                issues: payload.error.issues,
            };
        }
        try {
            const result = await action(payload.data, session.user);
            return {
                ok: true,
                data: result,
            };
        } catch (e) {
            if (isRedirectError(e)) {
                throw e;
            }
            if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
                return {
                    ok: false,
                    error: 'not-found',
                };
            }
            console.error('an error has occured', e);
            const showMessage = e instanceof SafeError || env.NODE_ENV !== 'production';
            return {
                ok: false,
                error: 'internal-server-error',
                messsage: showMessage ? `An error occured: ${e}` : 'An internal server error has occured',
            };
        }
    }
}
