import { Stream, StreamState } from "@prisma/client";
import { IconAlertTriangle, IconExclamationMark, IconHeadphones } from "@tabler/icons-react";

import unavailable from "@/components/StreamStatusIndicator/unavailable.svg";
import live from "@/components/StreamStatusIndicator/live.svg";
import Image from "next/image";

export function StreamStatusIndicator({ stream }: { stream: Stream }) {
  switch (stream.state) {
    case "Pending":
      return stream.ingestPointId ? <Image alt="Pending" src={unavailable} /> : <IconAlertTriangle title="Ingest not configured" color="orange" />;
    case "Live":
      return <Image alt="Live" src={live} />;
    case "Complete":
      return <IconHeadphones aria-label="Catchup" />;
  }
}
