'use client';

import {
  ActionIcon,
  Alert,
  Center,
  Group,
  Loader,
  Slider,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
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
  isLive: boolean;
}

const HLS_MIME = 'application/vnd.apple.mpegurl';

function formatTimestamp(timestamp: number): string {
  const seconds = Math.floor(timestamp % 60);
  const minutes = Math.floor((timestamp / 60) % 60);
  const hours = Math.floor(timestamp / 3600);
  const mmss = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return hours !== 0 ? `${hours}:${mmss}` : mmss;
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
    return (
      <Center>
        <Loader color="red" />
      </Center>
    );
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

function logEvent<T>(event: string, action?: (t: T) => void): (t: T) => void {
  return (t) => {
    console.log(`[player] [event] ${event}`);
    if (action) action(t);
  };
}

function StreamPlayerInner({ streamId, isLive }: Props) {
  const theme = useMantineTheme();

  const audio = useRef<HTMLAudioElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const streamUrl = `/api/stream/${streamId}/playlist.m3u8`;

  useEffect(() => {
    if (!audio.current) return;
    if (audio.current.canPlayType(HLS_MIME)) {
      console.log('[player] using browser built-in HLS');
      audio.current.src = streamUrl;
    } else if (Hls.isSupported()) {
      console.log('[player] using hls.js');
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
    <Stack>
      <audio
        ref={audio}
        onPlay={logEvent('onPlay', () => setIsPaused(false))}
        onPause={logEvent('onPause', () => setIsPaused(true))}
        // safari iOS seems to send the onWaiting event when the stream is still playing, so we make sure we aren't been lied to
        onStalled={logEvent('onWaiting', (e) => setLoading(e.currentTarget.readyState < HTMLMediaElement.HAVE_FUTURE_DATA))}
        onPlaying={logEvent('onPlaying', () => setLoading(false))}
        onCanPlay={logEvent('onCanPlay', () => setLoading(false))}
        onTimeUpdate={logEvent('onTimeUpdate', (e) => setCurrentTime(e.currentTarget.currentTime))}
        onDurationChange={logEvent('onDurationChange', (e) => setDuration(e.currentTarget.duration))}
        onLoadedMetadata={logEvent('onLoadedMetadata', () => setLoading(false))}
        onLoadedData={logEvent('onLoadedData', (e) => {
          if (e.currentTarget.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            setLoading(false);
          }
        })}
      />

      <Group>
        <Text>
          {formatTimestamp(currentTime)}{' '}
          {!isLive && !loading && <>/ {formatTimestamp(duration)}</>}
        </Text>

        <Slider
          color="rosesRed"
          flex={1}
          min={0}
          max={duration}
          value={currentTime}
          onChange={(value) => {
            if (!audio.current) return;
            audio.current.currentTime = value;
          }}
          label={(v) => formatTimestamp(v)}
          disabled={loading}
        />
      </Group>

      <br />

      <Group justify="center">
        <ActionIcon
          variant="transparent"
          size={48}
          aria-label="rewind backwards 10 seconds"
          disabled={loading}
          onClick={() => skipBackward10()}
          style={{ backgroundColor: '#ea3722' }}
        >
          <IconRewindBackward10 size={32} color="#ffffff" />
        </ActionIcon>

        <ActionIcon
          color="#ffffff"
          size={64}
          aria-label={audio?.current?.paused === false ? 'play' : 'pause'}
          onClick={() => togglePause()}
          disabled={loading}
          style={{ backgroundColor: '#ea3722' }}
        >
          {loading ? (
            <Loader color="#ffffff" />
          ) : isPaused ? (
            <IconPlayerPlay size={48} color="#ffffff" />
          ) : (
            <IconPlayerPause size={48} color="#ffffff" />
          )}
        </ActionIcon>

        <ActionIcon
          variant="transparent"
          size={48}
          aria-label="skip forwards 10 seconds"
          disabled={loading}
          onClick={() => skipForward10()}
          style={{ backgroundColor: '#ea3722' }}
        >
          <IconRewindForward10 size={32} color='#ffffff' />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
