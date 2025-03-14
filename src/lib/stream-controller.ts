import { z } from 'zod';
import { env } from './env';
import { SafeError } from './form-types';

// TODO: update to radio.roses.media when moved to that domain
const USER_AGENT = 'roses-radio-tx/1.0 (+https://ury.org.uk)';

const errorSchema = z.object({
  message: z.string(),
});

async function sendRequest(path: string): Promise<void> {
  if (!env.STREAM_CONTROLLER_URL) {
    return;
  }
  const res = await fetch(`${env.STREAM_CONTROLLER_URL}${path}`, {
    method: 'POST',
    headers: {
      'User-Agent': USER_AGENT,
    },
  });
  if (!res.ok) {
    console.log(res.status);
    const body = await res.json();
    const err = errorSchema.parse(body);
    console.error(`failed to send notification to ${path}:`, err.message);
    throw new SafeError(err.message);
  }
}

function notifyIngest(action: string): (id: string) => Promise<void> {
  return (id) => sendRequest(`/ingest/${id}/${action}`);
}

function notifyStream(action: string): (id: string) => Promise<void> {
  return (id) => sendRequest(`/stream/${id}/${action}`);
}

export const notifyIngestCreated = notifyIngest('create');
export const notifyIngestUpdated = notifyIngest('update');
export const notifyIngestDeleted = notifyIngest('delete');

export const notifyStreamStart = notifyStream('start');
export const notifyStreamStop = notifyStream('stop');

export function notifyStreamStarted(
  streamId: string,
  ingestId: string
): Promise<void> {
  return sendRequest(`/stream/${streamId}/patch/${ingestId}`);
}
