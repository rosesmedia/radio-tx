import { getServerSession, User } from "next-auth";
import { z, ZodIssue, ZodTypeAny } from "zod";
import { authOptions } from "./auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { env } from "process";

export type Result<T = void> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: 'permission';
} | {
    ok: false;
    error: 'validation';
    issues: ZodIssue[];
} | {
    ok: false,
    error: 'internal-server-error';
    messsage: string;
};

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
            console.error('an error has occured', e);
            return {
                ok: false,
                error: 'internal-server-error',
                messsage: env.NODE_ENV === 'development' ? `An error occured: ${e}` : 'An internal server error has occured',
            };
        }
    }
}
