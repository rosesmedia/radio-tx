'use server';

import DashboardShell from '@/components/DashboardShell';
import { prisma } from '@/lib/db';
import { Notifications } from '@mantine/notifications';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const u = await getServerSession();
  if (!u) {
    redirect('/api/auth/signin');
  }

  const isAnyStreamLive =
    (await prisma.stream.findFirst({
      where: {
        state: 'Live',
      },
    })) !== null;

  return (
    <DashboardShell isAnyStreamLive={isAnyStreamLive}>
      <Notifications />
      {children}
    </DashboardShell>
  );
}
