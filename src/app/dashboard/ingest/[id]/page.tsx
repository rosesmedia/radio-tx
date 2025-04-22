import { prisma } from '@/lib/db';
import { Group, Space, Text, Title } from '@mantine/core';
import { notFound } from 'next/navigation';
import { DeleteButton, EditButton } from './components';

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
        <EditButton id={id} ml={'auto'} />
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
