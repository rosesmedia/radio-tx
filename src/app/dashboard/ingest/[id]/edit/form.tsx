'use client';

import { useForm, zodResolver } from '@mantine/form';
import { Button, Group, TextInput } from '@mantine/core';
import { IngestPoint } from '@prisma/client';
import { editIngestPoint } from './actions';
import { editIngestPointSchema } from './schema';

export function EditIngestForm({ ingestPoint }: { ingestPoint: IngestPoint }) {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      id: ingestPoint.id,
      name: ingestPoint.name,
      icecastServer: ingestPoint.icecastServer,
      icecastMount: ingestPoint.icecastMount,
    },
    validate: zodResolver(editIngestPointSchema),
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        form.validate();
        if (form.isValid()) {
          console.log(form.values);
          const result = await editIngestPoint(form.values);
          if (!result.ok) {
            console.error('Something went wrong', result);
            alert(
              'Something went wrong! Check the browser console for details.'
            );
            return;
          }
        }
      }}
    >
      <TextInput
        {...form.getInputProps('name')}
        label="Name"
        withAsterisk
        placeholder="ROB-5"
      />
      <TextInput
        {...form.getInputProps('icecastServer')}
        label="Icecast server"
        withAsterisk
        placeholder="https://radio.ingest.roses.media"
      />
      <TextInput
        {...form.getInputProps('icecastMount')}
        label="Icecast mountpoint"
        withAsterisk
        placeholder="ROB-5"
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
}
