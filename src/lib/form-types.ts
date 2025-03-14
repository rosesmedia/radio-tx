import { ZodIssue } from "zod";

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
    error: 'not-found';
} | {
    ok: false,
    error: 'internal-server-error';
    messsage: string;
};

export class SafeError extends Error {}

export function resultMessage<T>(result: Result<T>): string | null {
    if (result.ok) {
        return null;
    }
    switch (result.error) {
        case 'internal-server-error':
            return result.messsage;
        case 'not-found':
            return 'Not found';
        case 'permission':
            return 'Unauthorised';
        case 'validation':
            // TODO
            return JSON.stringify(result.issues);
    }
}
