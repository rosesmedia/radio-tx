'use client';

import { Button, Group, Text } from '@mantine/core';
import { startTransition, useActionState } from 'react';
import { deleteIngestPoint } from './actions';
import { resultMessage } from '@/lib/form-types';

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
