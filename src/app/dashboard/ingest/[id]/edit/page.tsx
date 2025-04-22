import { prisma } from '@/lib/db';
import { EditIngestForm } from './form';

export default async function EditIngest({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;

  const ingestPoint = await prisma.ingestPoint.findUniqueOrThrow({
    where: {
      id: awaitedParams.id,
    },
  });

  return <EditIngestForm ingestPoint={ingestPoint} />;
}
