'use server';

import { prisma } from '@/lib/db';
import { action } from '@/lib/forms';
import { createStreamSchema } from './schema';

export const createStream = action(createStreamSchema, async (create) => {
  return await prisma.stream.create({
    data: {
      fixtureId: create.fixtureId,
      name: create.name,
      ingestPoint: create.ingestPoint
        ? { connect: { id: create.ingestPoint } }
        : undefined,
      state: create.ingestPoint ? undefined : 'Pending',
    },
  });
});
