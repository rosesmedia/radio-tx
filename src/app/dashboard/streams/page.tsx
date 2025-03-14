import { StreamStatusIndicator } from '@/components/StreamStatusIndicator';
import { prisma } from '@/lib/db';
import {
  Button,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core';
import Link from 'next/link';

export default async function StreamsPage() {
  const streams = await prisma.stream.findMany({
    orderBy: {
      fixtureId: 'asc',
    },
  });

  const rows = streams.map((stream) => (
    <TableTr key={stream.fixtureId}>
      <TableTd>
        <StreamStatusIndicator stream={stream} />
      </TableTd>
      <TableTd>
        <Link href={`/dashboard/streams/${stream.fixtureId}`}>
          {stream.name}
        </Link>
      </TableTd>
      <TableTd>{stream.fixtureId}</TableTd>
    </TableTr>
  ));

  return (
    <>
      <Button component={Link} href="/dashboard/streams/new">
        New stream
      </Button>
      <Table striped>
        <TableThead>
          <TableTr>
            <TableTh>Status</TableTh>
            <TableTh>Name</TableTh>
            <TableTh>Fixture ID</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </>
  );
}
