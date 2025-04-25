'use server';

import { action } from '@/lib/forms';
import { setSourceSchema, startStreamSchema } from './schema';
import { prisma } from '@/lib/db';
import { SafeError } from '@/lib/form-types';
import {
  notifyStreamStart,
  notifyStreamStop,
  setStreamSource,
} from '@/lib/stream-controller';

export const startStream = action(startStreamSchema, async ({ id }) => {
  const stream = await prisma.stream.findUniqueOrThrow({
    where: { fixtureId: id },
  });
  if (!stream.ingestPointId) {
    throw new SafeError('stream ingest point has not been configured');
  }
  await notifyStreamStart(stream.fixtureId);
});

export const endStream = action(startStreamSchema, async ({ id }) => {
  const stream = await prisma.stream.findUniqueOrThrow({
    where: { fixtureId: id },
  });

  if (stream.state !== 'Live') {
    throw new SafeError('stream is not live');
  }

  // TODO: trigger this from liquidsoap on_shutdown to ensure the playlist is ended after liquidsoap has finished sending chunks
  await prisma.stream.update({
    where: { fixtureId: id },
    data: { state: 'Complete' },
  });

  await notifyStreamStop(stream.fixtureId);
});

export const setSource = action(setSourceSchema, async ({ id, source }) => {
  const stream = await prisma.stream.findUniqueOrThrow({
    where: { fixtureId: id },
  });

  await setStreamSource(stream, source);

  return source;
});
