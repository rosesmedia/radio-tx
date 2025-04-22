import { prisma } from '@/lib/db';
import { Button, Group, Space, Text, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { DeleteButton } from './components';
import Link from 'next/link';

export default async function StreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingest = await prisma.ingestPoint.findUnique({
    where: {
      id,
    },
  });

  if (!ingest) {
    return notFound();
  }

  return (
    <>
      <Group>
        <Title order={1}>{ingest.name}</Title>
        <Link
          href={`/dashboard/ingest/${id}/edit`}
          style={{
            marginLeft: 'auto',
          }}
        >
          <Button>Edit</Button>
        </Link>
      </Group>

      <Space h="md" />

      <Title order={2}>Icecast server</Title>

      <Text>{ingest.icecastServer}</Text>

      <Space h="md" />

      <Title order={2}>Icecast mountpoint</Title>

      <Text>{ingest.icecastMount}</Text>

      <Space h="md" />

      <Title order={2}>Actions</Title>

      <DeleteButton id={ingest.id} />
    </>
  );
}
