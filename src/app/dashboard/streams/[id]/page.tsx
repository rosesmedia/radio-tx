import StreamPlayer from '@/components/StreamPlayer';
import { prisma } from '@/lib/db';
import { Button, Group, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { EndStreamButton, GoLiveButton } from './components';
import Link from 'next/link';

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
        <Link
          href={`/dashboard/streams/${fixtureId}/edit`}
          style={{
            marginLeft: 'auto',
          }}
        >
          <Button>Edit</Button>
        </Link>
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
