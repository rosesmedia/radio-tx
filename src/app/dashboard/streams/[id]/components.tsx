'use client';

import { startTransition, useActionState } from 'react';
import { endStream, setSource, startStream } from './actions';
import { notifications } from '@mantine/notifications';
import { Result, resultMessage } from '@/lib/form-types';
import { Button, ButtonGroup, Stack, Text } from '@mantine/core';

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

export function SourceSelector({
  id,
  currentSource: initialSource,
}: {
  id: string;
  currentSource: number;
}) {
  const [state, action, pending] = useActionState<Result<number>, number>(
    async (_, source) => {
      const res = await setSource({ id, source });
      return res;
    },
    { ok: true, data: initialSource }
  );

  const currentSource = state.ok ? state.data : -1;

  return (
    <Stack>
      <Text aria-live="polite">{resultMessage(state)}</Text>
      <ButtonGroup>
        <SourceSelectButton
          id={id}
          currentSource={currentSource}
          pending={pending}
          action={action}
          source={1}
          label="PGM"
        />
        <SourceSelectButton
          id={id}
          currentSource={currentSource}
          pending={pending}
          action={action}
          source={2}
          label="SRT"
        />
        <SourceSelectButton
          id={id}
          currentSource={currentSource}
          pending={pending}
          action={action}
          source={3}
          label="END"
        />
        <SourceSelectButton
          id={id}
          currentSource={currentSource}
          pending={pending}
          action={action}
          source={4}
          label="TDF"
        />
      </ButtonGroup>
    </Stack>
  );
}

export function SourceSelectButton({
  source,
  label,
  pending,
  currentSource,
  action,
}: {
  id: string;
  source: number;
  label: string;
  pending: boolean;
  currentSource: number;
  action: (payload: number) => void;
}) {
  return (
    <Button
      loading={pending}
      onClick={() => {
        startTransition(() => action(source));
      }}
      variant={currentSource === source ? 'filled' : 'default'}
    >
      {label}
    </Button>
  );
}
