'use client';

import { Button, Group, Text } from '@mantine/core';
import { startTransition, useActionState } from 'react';
import { deleteIngestPoint } from './actions';
import { resultMessage } from '@/lib/form-types';

export function DeleteButton({ id }: { id: string }) {
  const [deleteState, triggerDelete, deletePending] = useActionState(
    () =>
      deleteIngestPoint({
        id,
      }),
    { ok: true, data: undefined }
  );

  return (
    <>
      <Text aria-live="polite">{resultMessage(deleteState)}</Text>
      <Group>
        <Button
          color="red"
          loading={deletePending}
          onClick={() => {
            startTransition(triggerDelete);
          }}
        >
          Delete
        </Button>
      </Group>
    </>
  );
}
