import { prisma } from '@/lib/db';
import { EditStreamForm } from './form';

export default async function EditStream({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const awaitedParams = await params;

  const ingestPoints = await prisma.ingestPoint.findMany();

  const stream = await prisma.stream.findUniqueOrThrow({
    where: {
      fixtureId: awaitedParams.id,
    },
  });

  return <EditStreamForm ingestPoints={ingestPoints} stream={stream} />;
}
