import StreamPlayer from '@/components/StreamPlayer';
import { prisma } from '@/lib/db';
import { Group, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { EndStreamButton, GoLiveButton } from './components';

export default async function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: fixtureId } = await params;
  const stream = await prisma.stream.findUnique({
    where: {
      fixtureId,
    },
  });

  if (!stream) {
    return notFound();
  }

  return (
    <>
      <Title order={1}>{stream.name}</Title>

      <Group>
        {stream.ingestPointId && stream.state === 'Pending' && (
          <GoLiveButton id={stream.fixtureId} />
        )}
      </Group>

      {stream.state !== 'Pending' && (
        <StreamPlayer
          streamId={stream.fixtureId}
        />
      )}

      {stream.state === 'Live' && (
        <Group>
          <EndStreamButton id={stream.fixtureId} />
        </Group>
      )}
    </>
  );
}
