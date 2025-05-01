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
    select: {
      fixtureId: true,
      name: true,
      state: true,
      hideOnDashboard: true,
      ingestPoint: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  const rows = streams.filter(stream => !stream.hideOnDashboard).map((stream) => (
    <TableTr key={stream.fixtureId}>
      <TableTd>
        <StreamStatusIndicator
          state={stream.state}
          ingestPointId={stream?.ingestPoint?.id}
        />
      </TableTd>
      <TableTd>
        <Link href={`/dashboard/streams/${stream.fixtureId}`}>
          {stream.name}
        </Link>
      </TableTd>
      <TableTd>{stream.fixtureId}</TableTd>
      <TableTd>{stream.ingestPoint?.name ?? '<unset>'}</TableTd>
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
            <TableTh>Ingest</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </>
  );
}
