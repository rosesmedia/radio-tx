import StreamPlayer from '@/components/StreamPlayer';
import { prisma } from '@/lib/db';
import { Button, Group, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { EditButton, EndStreamButton, GoLiveButton } from './components';

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
      <Group>
        <Title order={1}>{stream.name}</Title>
        <EditButton id={fixtureId} ml={'auto'} />
      </Group>

      <Group>
        {stream.ingestPointId && stream.state === 'Pending' && (
          <GoLiveButton id={stream.fixtureId} />
        )}
      </Group>

      {stream.state !== 'Pending' && (
        <StreamPlayer
          streamId={stream.fixtureId}
          isLive={stream.state === 'Live'}
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
