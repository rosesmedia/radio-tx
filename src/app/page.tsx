import Image from 'next/image';
import { Button, Center, Stack, Title } from '@mantine/core';
import rosesLogo from '@/assets/Roses_logomark.png';
import { SignInButton } from '@/components/SignInButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { SignOutButton } from '@/components/SignOutButton';
import Footer from '@/components/Footer';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Center>
        <Stack justify="center">
          <Image
            src={rosesLogo}
            alt="the Roses logo, a side profile of a red and white stylised rose"
          />

          <Title order={1}>
            <Center>Roses Live Radio 2025</Center>
          </Title>

          {session ? (
            <>
              <Button component={Link} href={'/dashboard'}>
                Dashboard
              </Button>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </Stack>
      </Center>
      <footer>
        <Footer mt={16} />
      </footer>
    </>
  );
}
