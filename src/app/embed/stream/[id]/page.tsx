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

  if (!stream) {
    return notFound();
  }

  return (
    <Container>
      <StreamPlayer streamId={stream.fixtureId} />
    </Container>
  );
}
