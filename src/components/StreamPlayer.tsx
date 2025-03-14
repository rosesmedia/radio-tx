'use client';

import { Alert, Loader } from '@mantine/core';
import { IconAlertSquareRounded } from '@tabler/icons-react';
import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

interface Props {
  streamId: string;
  isLive: boolean;
}

const HLS_MIME = 'application/vnd.apple.mpegurl';

function supportsHls(): boolean {
  return new Audio().canPlayType(HLS_MIME) !== '' || Hls.isSupported();
}

export default function StreamPlayer(props: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(supportsHls());
  }, []);

  if (supported === null) {
    return <Loader />;
  } else if (supported) {
    return <StreamPlayerInner {...props} />;
  } else {
    return (
      <Alert
        color="red"
        variant="outline"
        title="Unsupported browser"
        icon={<IconAlertSquareRounded />}
      >
        Your browser is currently not supported, sorry.
      </Alert>
    );
  }
}

function StreamPlayerInner({ streamId }: Props) {
  const audio = useRef<HTMLAudioElement>(null);

  const streamUrl = `/api/stream/${streamId}/playlist.m3u8`;

  useEffect(() => {
    if (!audio.current) return;
    if (audio.current.canPlayType(HLS_MIME)) {
      audio.current.src = streamUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        // we need to use the worker to avoid this until we can fix the liquidsoap script
        // https://github.com/savonet/liquidsoap/issues/4398
        // https://github.com/video-dev/hls.js/issues/7075
        enableWorker: true,
        workerPath: new URL(
          '../../node_modules/hls.js/dist/hls.worker.js',
          import.meta.url
        ).toString(),
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(audio.current);
      return () => hls.destroy();
    } else {
      console.error(
        'StreamPlayerInner initialised when HLS is not supported. This should not happen!'
      );
    }
  }, [streamUrl]);

  return <audio controls ref={audio} />;
}
