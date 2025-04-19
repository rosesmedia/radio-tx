import StreamPlayer from '@/components/StreamPlayer';
import { prisma } from '@/lib/db';
import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

export default async function StreamEmbed({
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

  // TODO: maybe a "not live yet" page instead of a 404
  if (!stream || stream.state === 'Pending') {
    return notFound();
  }

  return (
    <Container pt={40}>
      <StreamPlayer
        streamId={stream.fixtureId}
        isLive={stream.state === 'Live'}
      />
    </Container>
  );
}
