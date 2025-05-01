import StreamPlayer from '@/components/StreamPlayer';
import { prisma } from '@/lib/db';
import { Container } from '@mantine/core';
import { notFound } from 'next/navigation';

import './style.css';
import Script from 'next/script';
import { env } from '@/lib/env';

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
        logPlayerErrors
      />

      {env.UMAMI_SCRIPT && env.UMAMI_SITE_ID && (
        <Script
          defer
          src={env.UMAMI_SCRIPT}
          data-website-id={env.UMAMI_SITE_ID}
        />
      )}
    </Container>
  );
}
