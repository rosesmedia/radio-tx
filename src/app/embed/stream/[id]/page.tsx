import StreamPlayer from '@/components/StreamPlayer';
import { prisma } from '@/lib/db';
import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import { notFound } from 'next/navigation';

import './style.css';
import Script from 'next/script';
import { env } from '@/lib/env';
import { IconHourglass } from '@tabler/icons-react';

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
  if (!stream) {
    return notFound();
  }

  if (stream.state === 'Pending') {
    return <Container pt={40}>
      <Stack>
        <Center>
          <IconHourglass className='hourglass-spin' size={48} color='#ea3722' />
        </Center>

        <Center>
          <Title order={1}>
            This stream hasn't started yet
          </Title>
        </Center>
      </Stack>
    </Container>
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
