'use client';

import { ActionIcon, Alert, Group, Loader, Slider } from '@mantine/core';
import {
  IconAlertSquareRounded,
  IconPlayerPause,
  IconPlayerPlay,
  IconRewindBackward10,
  IconRewindForward10,
} from '@tabler/icons-react';
import Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  streamId: string;
}

const HLS_MIME = 'application/vnd.apple.mpegurl';

function formatTimestamp(
  timestamp: number,
  includeSeconds: boolean = false
): string {
  const seconds = Math.round(timestamp % 60);
  const minutes = Math.round((timestamp / 60) % 60);
  const hours = Math.round(timestamp / 3600);
  const hhmm = `${hours}:${minutes.toString().padStart(2, '0')}`;
  return includeSeconds
    ? `${hhmm}:${seconds.toString().padStart(2, '0')}`
    : hhmm;
}

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
  const [isPaused, setIsPaused] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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

  const togglePause = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    if (audio.current.paused) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  }, [audio, loading]);

  const skipForward10 = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    audio.current.currentTime = audio.current.currentTime + 10;
  }, [audio, loading]);

  const skipBackward10 = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    audio.current.currentTime = audio.current.currentTime - 10;
  }, [audio, loading]);

  return (
    <div>
      <audio
        ref={audio}
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        onStalled={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      />

      <br />

      <Slider
        color="red"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(value) => {
          if (!audio.current) return;
          audio.current.currentTime = value;
        }}
        label={(v) => formatTimestamp(v, true)}
        disabled={loading}
      />

      <br />

      <Group justify="center">
        <ActionIcon
          variant="transparent"
          size={48}
          aria-label="rewind backwards 10 seconds"
          disabled={loading}
          onClick={() => skipBackward10()}
        >
          <IconRewindBackward10 size={32} color="red" />
        </ActionIcon>

        <ActionIcon
          color="red"
          size={64}
          aria-label={audio?.current?.paused === false ? 'play' : 'pause'}
          onClick={() => togglePause()}
          disabled={loading}
        >
          {loading ? (
            <Loader color="white" />
          ) : isPaused ? (
            <IconPlayerPlay size={48} />
          ) : (
            <IconPlayerPause size={48} />
          )}
        </ActionIcon>

        <ActionIcon
          variant="transparent"
          size={48}
          aria-label="skip forwards 10 seconds"
          disabled={loading}
          onClick={() => skipForward10()}
        >
          <IconRewindForward10 size={32} color="red" />
        </ActionIcon>
      </Group>
    </div>
  );
}
