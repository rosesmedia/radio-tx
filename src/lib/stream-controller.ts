import { z } from "zod";
import { env } from "./env";
import { SafeError } from "./form-types";

// TODO: update to radio.roses.media when moved to that domain
const USER_AGENT = 'roses-radio-tx/1.0 (+https://ury.org.uk)';

const errorSchema = z.object({
    message: z.string(),
});

function notify(action: string): (id: string) => Promise<void> {
    return async (id) => {
        const res = await fetch(`${env.STREAM_CONTROLLER_URL}/ingest/${id}/${action}`, {
            method: 'POST',
            headers: {
                'User-Agent': USER_AGENT,
            },
        });
        if (!res.ok) {
            const body = await res.json();
            const err = errorSchema.parse(body);
            console.error(`failed to notify ${action}:`, err.message);
            throw new SafeError(err.message);
        }
    }
}

export const notifyIngestCreated = notify('create');
export const notifyIngestUpdated = notify('update');
export const notifyIngestDeleted = notify('delete');
