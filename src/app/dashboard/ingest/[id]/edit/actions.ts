'use server';

import { prisma } from '@/lib/db';
import { action } from '@/lib/forms';
import { editIngestPointSchema } from './schema';
import { notifyIngestUpdated } from '@/lib/stream-controller';
import { redirect } from 'next/navigation';

export const editIngestPoint = action(editIngestPointSchema, async (edit) => {
  const ingestPoint = await prisma.ingestPoint.update({
    where: {
      id: edit.id,
    },
    data: {
      name: edit.name,
      icecastServer: edit.icecastServer,
      icecastMount: edit.icecastMount,
    },
  });
  await notifyIngestUpdated(ingestPoint.id);
  redirect(`/dashboard/ingest/${ingestPoint.id}`);
});
