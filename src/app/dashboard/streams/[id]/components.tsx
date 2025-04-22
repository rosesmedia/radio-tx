'use client';

import { startTransition, useActionState } from 'react';
import { endStream, startStream } from './actions';
import { notifications } from '@mantine/notifications';
import { resultMessage } from '@/lib/form-types';
import {
  Button,
  ButtonProps,
  PolymorphicComponentProps,
  Stack,
  Text,
} from '@mantine/core';
import { useRouter } from 'next/navigation';

export function GoLiveButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    async () => {
      const res = await startStream({ id });
      if (res.ok) {
        notifications.show({
          message: 'Stream starting...',
        });
      }
      return res;
    },
    { ok: true, data: undefined }
  );

  return (
    <Stack>
      <Text aria-live="polite">{resultMessage(state)}</Text>
      <Button
        color="green"
        loading={pending}
        onClick={() => {
          startTransition(action);
        }}
      >
        Go Live
      </Button>
    </Stack>
  );
}

export function EndStreamButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    async () => {
      const res = await endStream({ id });
      if (res.ok) {
        notifications.show({
          message: 'Ending stream...',
        });
      }
      return res;
    },
    { ok: true, data: undefined }
  );

  return (
    <Stack>
      <Text aria-live="polite">{resultMessage(state)}</Text>
      <Button
        color="red"
        loading={pending}
        onClick={() => {
          startTransition(action);
        }}
      >
        End stream
      </Button>
    </Stack>
  );
}

export function EditButton({
  id,
  ...props
}: { id: string } & Omit<
  PolymorphicComponentProps<'button', ButtonProps>,
  'onClick'
>) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/dashboard/streams/${id}/edit`)}
      {...props}
    >
      Edit
    </Button>
  );
}
