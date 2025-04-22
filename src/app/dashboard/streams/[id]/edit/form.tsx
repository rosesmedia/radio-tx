'use client';

import { useForm, zodResolver } from '@mantine/form';
import { Button, Group, Select, TextInput } from '@mantine/core';
import { redirect } from 'next/navigation';
import { IngestPoint, Stream } from '@prisma/client';
import { editStreamSchema } from './schema';
import { editStream } from './actions';

export function EditStreamForm({
  ingestPoints,
  stream,
}: {
  ingestPoints: IngestPoint[];
  stream: Stream;
}) {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      previousId: stream.fixtureId,
      fixtureId: stream.fixtureId,
      name: stream.name,
      ingestPoint: stream.ingestPointId,
    },
    validate: zodResolver(editStreamSchema),
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        form.validate();
        if (form.isValid()) {
          const result = await editStream(form.values);
          if (!result.ok) {
            console.error('Something went wrong', result);
            alert(
              'Something went wrong! Check the browser console for details.'
            );
            return;
          }
          redirect(`/dashboard/streams/${result.data.fixtureId}`);
        }
      }}
    >
      <TextInput
        {...form.getInputProps('fixtureId')}
        label="Fixture ID"
        withAsterisk
        placeholder="123abcdef456"
      />
      <TextInput
        {...form.getInputProps('name')}
        label="Name"
        withAsterisk
        placeholder="Football Women's 1st"
      />
      <Select
        {...form.getInputProps('ingestPoint')}
        label="Ingest point"
        data={ingestPoints.map((ingest) => ({
          label: ingest.name,
          value: ingest.id,
        }))}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Edit</Button>
      </Group>
    </form>
  );
}
