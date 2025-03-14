'use server';

import { prisma } from '@/lib/db';
import { action } from '@/lib/forms';
import { createIngestPointSchema } from './schema';
import { notifyIngestCreated } from '@/lib/stream-controller';
import { redirect } from 'next/navigation';

export const createIngestPoint = action(
  createIngestPointSchema,
  async (create) => {
    const ingestPoint = await prisma.ingestPoint.create({
      data: {
        name: create.name,
        icecastServer: create.icecastServer,
        icecastMount: create.icecastMount,
      },
    });
    await notifyIngestCreated(ingestPoint.id);
    redirect(`/dashboard/ingest`);
  }
);
