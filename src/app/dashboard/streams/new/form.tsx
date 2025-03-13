'use client';

import { useForm, zodResolver } from "@mantine/form";
import { createStream } from "./actions";
import { Button, Group, Select, TextInput } from "@mantine/core";
import { redirect } from "next/navigation";
import { createStreamSchema } from "./schema";
import { IngestPoint } from "@prisma/client";

export function NewStreamForm({ ingestPoints }: { ingestPoints: IngestPoint[]; }) {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      fixtureId: '',
      name: '',
      ingestPoint: '',
    },
    validate: zodResolver(createStreamSchema),
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        form.validate();
        if (form.isValid()) {
          const result = await createStream(form.values);
          if (!result.ok) {
            console.error("Something went wrong", result);
            alert("Something went wrong! Check the browser console for details.");
            return;
          }
          redirect(`/dashboard/streams`);
        }
      }}
    >
      <TextInput {...form.getInputProps("fixtureId")} label="Fixture ID" withAsterisk placeholder="123abcdef456" />
      <TextInput {...form.getInputProps("name")} label="Name" withAsterisk placeholder="Football Women's 1st" />
      <Select {...form.getInputProps("ingestPoint")} label="Ingest point" data={ingestPoints.map(ingest => ({
        label: ingest.name,
        value: ingest.id,
      }))} />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
}
