'use client';

import { useForm, zodResolver } from "@mantine/form";
import { createIngestPoint } from "./actions";
import { Button, Group, TextInput } from "@mantine/core";
import { redirect } from "next/navigation";
import { createIngestPointSchema } from "./schema";

export function NewIngestPointForm() {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      name: "",
      icecastServer: "",
      icecastMount: "",
    },
    validate: zodResolver(createIngestPointSchema),
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        form.validate();
        if (form.isValid()) {
          console.log(form.values);
          const result = await createIngestPoint(form.values);
          if (!result.ok) {
            console.error("Something went wrong", result);
            alert("Something went wrong! Check the browser console for details.");
            return;
          }
          redirect(`/dashboard/ingest`);
        }
      }}
    >
      <TextInput {...form.getInputProps("name")} label="Name" withAsterisk placeholder="ROB-5" />
      <TextInput {...form.getInputProps("icecastServer")} label="Icecast server" withAsterisk placeholder="https://radio.ingest.roses.media" />
      <TextInput {...form.getInputProps("icecastMount")} label="Icecast mountpoint" withAsterisk placeholder="ROB-5" />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Create</Button>
      </Group>
    </form>
  );
}
