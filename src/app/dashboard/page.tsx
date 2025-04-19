import { Button, ButtonGroup, Title } from '@mantine/core';

export default async function DashboardPage() {
  return (
    <>
      <Title order={1}>Hello!</Title>

      <ButtonGroup>
        <Button>OBR</Button>
        <Button variant="default">STN</Button>
        <Button variant="default">TDF</Button>
        <Button variant="default">END</Button>
      </ButtonGroup>
    </>
  );
}
