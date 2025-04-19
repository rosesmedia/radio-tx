import { Center, Text } from '@mantine/core';
import Link from 'next/link';

interface Props {
  mt?: number;
}

export default function Footer(props: Props) {
  return (
    <Center>
      <Text {...props} p={8}>
        <Link href="https://github.com/rosesmedia/radio-tx">radio-tx</Link>{' '}
        version{' '}
        <Link
          href={
            process.env.NEXT_PUBLIC_GIT_COMMIT
              ? `https://github.com/rosesmedia/radio-tx/commit/${process.env.NEXT_PUBLIC_GIT_COMMIT}`
              : 'https://github.com/rosesmedia/radio-tx/'
          }
        >
          {process.env.NEXT_PUBLIC_GIT_COMMIT?.substring(0, 7)}
        </Link>
        . Built by the{' '}
        <Link href="mailto:computing@ury.org.uk">URY Computing Team</Link>.{' '}
        <Link href="https://www.york.ac.uk/about/legal-statements/">
          Disclaimer
        </Link>
      </Text>
    </Center>
  );
}
