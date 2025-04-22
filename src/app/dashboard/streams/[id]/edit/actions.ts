'use server';

import { prisma } from '@/lib/db';
import { action } from '@/lib/forms';
import { editStreamSchema } from './schema';

export const editStream = action(editStreamSchema, async (edit) => {
  return await prisma.stream.update({
    where: {
      fixtureId: edit.previousId,
    },
    data: {
      fixtureId: edit.fixtureId,
      name: edit.name,
      ingestPoint: edit.ingestPoint
        ? { connect: { id: edit.ingestPoint } }
        : undefined,
      state: edit.ingestPoint ? undefined : 'Pending',
    },
  });
});
