"use client";

import { AppShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import rosesLogomarkSmall from "@/assets/Roses_logomark_small.png";
import Link from "next/link";
import { IconHome, IconMicrophone } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import StreamsIcon from "./StreamsIcon";

export default function DashboardShell({ children, isAnyStreamLive }: { children: React.ReactNode; isAnyStreamLive: boolean }) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
          <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
          <Image alt="the roses media logo" src={rosesLogomarkSmall} />
          Roses Radio TX
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink component={Link} href="/dashboard" label="Home" leftSection={<IconHome />} active={pathname === "/dashboard"} />
        <NavLink component={Link} href="/dashboard/streams" label="Streams" leftSection={<StreamsIcon isAnyStreamLive={isAnyStreamLive} />} active={pathname.startsWith("/dashboard/streams")} />
        <NavLink component={Link} href="/dashboard/ingest" label="Ingest" leftSection={<IconMicrophone />} active={pathname.startsWith("/dashboard/ingest")} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
