import { StreamState } from '@prisma/client';
import { IconAlertTriangle, IconHeadphones } from '@tabler/icons-react';

import unavailable from '@/components/StreamStatusIndicator/unavailable.svg';
import live from '@/components/StreamStatusIndicator/live.svg';
import Image from 'next/image';

export function StreamStatusIndicator({
  state,
  ingestPointId,
}: {
  state: StreamState;
  ingestPointId?: string;
}) {
  switch (state) {
    case 'Pending':
      return ingestPointId ? (
        <Image alt="Pending" src={unavailable} />
      ) : (
        <IconAlertTriangle title="Ingest not configured" color="orange" />
      );
    case 'Live':
      return <Image alt="Live" src={live} />;
    case 'Complete':
      return <IconHeadphones aria-label="Catchup" />;
  }
}
