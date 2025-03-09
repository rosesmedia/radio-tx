import { StreamStatusIndicator } from "@/components/StreamStatusIndicator";
import { prisma } from "@/lib/db";
import { Table, TableTbody, TableTd, TableTh, TableThead, TableTr } from "@mantine/core";
import Link from "next/link";

export default async function StreamsPage() {
  const streams = await prisma.stream.findMany({
    orderBy: {
      fixtureId: "asc",
    },
  });

  const rows = streams.map((stream) => (
    <TableTr key={stream.fixtureId}>
      <TableTd>
        <StreamStatusIndicator status={stream.state} />
      </TableTd>
      <TableTd>
        <Link href={`/dashboard/streams/${stream.fixtureId}`}>{stream.name}</Link>
      </TableTd>
      <TableTd>{stream.fixtureId}</TableTd>
    </TableTr>
  ));

  return (
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
  );
}
