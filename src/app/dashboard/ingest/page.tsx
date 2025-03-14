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

export default async function IngestPage() {
  const ingestPoints = await prisma.ingestPoint.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  const rows = ingestPoints.map((ingest) => (
    <TableTr key={ingest.id}>
      <TableTd>
        <Link href={`/dashboard/ingest/${ingest.id}`}>{ingest.name}</Link>
      </TableTd>
      <TableTd>{ingest.icecastServer}</TableTd>
      <TableTd>{ingest.icecastMount}</TableTd>
    </TableTr>
  ));

  return (
    <>
      <Button component={Link} href="/dashboard/ingest/new">
        New ingest point
      </Button>
      <Table striped>
        <TableThead>
          <TableTr>
            <TableTh>Name</TableTh>
            <TableTh>Icecast server</TableTh>
            <TableTh>Icecast mountpoint</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </>
  );
}
