import { prisma } from '@/lib/db';
import {
  Card,
  Center,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconAccessPoint } from '@tabler/icons-react';

export default async function DashboardPage() {
  const liveStreams = await prisma.stream.count({ where: { state: 'Live' } });

  return (
    <Stack>
      <Title order={1}>Hello!</Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
        <Card shadow="sm" withBorder>
          <Group>
            <Center>
              <IconAccessPoint size={40} color="red" />
            </Center>

            <Title order={2}>Live streams: {liveStreams}</Title>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  );
}
