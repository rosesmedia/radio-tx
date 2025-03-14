'use client';

import { Button } from '@mantine/core';
import Link from 'next/link';

export function SignInButton() {
  return (
    <Button fullWidth component={Link} href="/api/auth/signin">
      Radio sign-in
    </Button>
  );
}
