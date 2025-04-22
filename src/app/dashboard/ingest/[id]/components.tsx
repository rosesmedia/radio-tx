'use client';

import {
  Button,
  ButtonProps,
  Group,
  PolymorphicComponentProps,
  Text,
} from '@mantine/core';
import { startTransition, useActionState } from 'react';
import { deleteIngestPoint } from './actions';
import { resultMessage } from '@/lib/form-types';
import { useRouter } from 'next/navigation';

export function DeleteButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(
    () =>
      deleteIngestPoint({
        id,
      }),
    { ok: true, data: undefined }
  );

  return (
    <>
      <Text aria-live="polite">{resultMessage(state)}</Text>
      <Group>
        <Button
          color="red"
          loading={pending}
          onClick={() => {
            startTransition(action);
          }}
        >
          Delete
        </Button>
      </Group>
    </>
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
      onClick={() => router.push(`/dashboard/ingest/${id}/edit`)}
      {...props}
    >
      Edit
    </Button>
  );
}
