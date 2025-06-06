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
  Tooltip,
} from '@mantine/core';
import {
  IconAlertSquareRounded,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBack,
  IconPlayerSkipForward,
  IconRewindBackward10,
  IconRewindForward10,
} from '@tabler/icons-react';
import Hls from 'hls.js';
import * as Sentry from '@sentry/nextjs';
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { maybeGetUmami } from '@/lib/umami';

interface Props {
  streamId: string;
  isLive: boolean;
  logPlayerErrors?: boolean;
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

function maybeLogPlay(fixtureId: string, isLive: boolean, timestamp: number) {
  maybeGetUmami()?.track(`play-${isLive ? 'live' : 'catchup'}`, {
    fixtureId,
    timestamp,
  });
}

export default function StreamPlayer(props: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(supportsHls());
  }, []);

  if (supported === null) {
    return (
      <Center>
        <Loader color="#ea3722" />
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

function PlayPauseButton({
  isPaused,
  loading,
  togglePause,
  hideOnMobile,
}: {
  isPaused: boolean;
  loading: boolean;
  togglePause: () => void;
  hideOnMobile?: boolean;
}) {
  return (
    <Tooltip
      label={isPaused ? 'Pause' : 'Play'}
      visibleFrom={hideOnMobile ? 'xxs' : undefined}
    >
      <ActionIcon
        color="#ea3722"
        size={64}
        aria-label={isPaused === false ? 'play' : 'pause'}
        onClick={() => togglePause()}
        disabled={loading}
        visibleFrom={hideOnMobile ? 'xxs' : undefined}
      >
        {loading ? (
          <Loader color="white" />
        ) : isPaused ? (
          <IconPlayerPlay size={48} />
        ) : (
          <IconPlayerPause size={48} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}

function logEvent<T>(event: string, action?: (t: T) => void): (t: T) => void {
  return (t) => {
    console.log(`[player] [event] ${event}`);
    if (action) action(t);
  };
}

function StreamPlayerInner({ streamId, isLive, logPlayerErrors }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

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
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          if (logPlayerErrors) Sentry.captureException(data);

          switch (data.type) {
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('attempting to recover from fatal media error');
              hls.recoverMediaError();
              break;
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('fatal network error occured');
              break;
            default:
              console.error('unrecoverable error occurred');
              hls.destroy();
          }
        }
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(audio.current);
      return () => hls.destroy();
    } else {
      console.error(
        'StreamPlayerInner initialised when HLS is not supported. This should not happen!'
      );
    }
  }, [streamUrl, logPlayerErrors]);

  const togglePause = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    if (audio.current.paused) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  }, [audio, loading]);

  const skipBackToStart = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    audio.current.currentTime = 0;
  }, [audio, loading]);

  const skipBackward10 = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    audio.current.currentTime = audio.current.currentTime - 10;
  }, [audio, loading]);

  const skipForward10 = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    audio.current.currentTime = audio.current.currentTime + 10;
  }, [audio, loading]);

  const skipForwardToLive = useCallback(() => {
    if (!audio.current) return;
    if (loading) return;
    audio.current.currentTime = Math.max(0, audio.current.duration - 8);
  }, [audio, loading]);

  const onPlay = useCallback(
    (e: SyntheticEvent<HTMLAudioElement>) => {
      setIsPaused(false);
      if (!hasStartedPlaying) {
        maybeLogPlay(streamId, isLive, e.currentTarget.currentTime);
        setHasStartedPlaying(true);
      }
    },
    [hasStartedPlaying, isLive, streamId]
  );

  return (
    <Stack>
      <audio
        ref={audio}
        onPlay={logEvent('onPlay', onPlay)}
        onPause={logEvent('onPause', () => setIsPaused(true))}
        // safari iOS seems to send the onWaiting event when the stream is still playing, so we make sure we aren't been lied to
        onStalled={logEvent('onWaiting', (e) =>
          setLoading(
            e.currentTarget.readyState < HTMLMediaElement.HAVE_FUTURE_DATA
          )
        )}
        onPlaying={logEvent('onPlaying', () => setLoading(false))}
        onCanPlay={logEvent('onCanPlay', () => setLoading(false))}
        onTimeUpdate={logEvent('onTimeUpdate', (e) =>
          setCurrentTime(e.currentTarget.currentTime)
        )}
        onDurationChange={logEvent('onDurationChange', (e) =>
          setDuration(e.currentTarget.duration)
        )}
        onLoadedMetadata={logEvent('onLoadedMetadata', () => setLoading(false))}
        onLoadedData={logEvent('onLoadedData', (e) => {
          if (e.currentTarget.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
            setLoading(false);
          }
        })}
      />

      <Group>
        <Text visibleFrom="xxs">
          {formatTimestamp(currentTime)}{' '}
          {!isLive && !loading && <>/ {formatTimestamp(duration)}</>}
        </Text>

        <Slider
          color="#ea3722"
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

      <Center hiddenFrom="xxs">
        <Text>
          {formatTimestamp(currentTime)}{' '}
          {!isLive && !loading && <>/ {formatTimestamp(duration)}</>}
        </Text>
      </Center>

      <Group justify="center" hiddenFrom="xxs">
        <PlayPauseButton
          isPaused={isPaused}
          loading={loading}
          togglePause={togglePause}
        />
      </Group>

      <Group justify="center">
        {isLive && (
          <Tooltip label="Rewind to start">
            <ActionIcon
              color="#ea3722"
              size={42}
              aria-label="Rewind to start"
              disabled={loading}
              onClick={() => skipBackToStart()}
            >
              <IconPlayerSkipBack size={24} color="white" />
            </ActionIcon>
          </Tooltip>
        )}

        <Tooltip label="Rewind 10 seconds">
          <ActionIcon
            color="#ea3722"
            size={48}
            aria-label="Rewind 10 seconds"
            disabled={loading}
            onClick={() => skipBackward10()}
          >
            <IconRewindBackward10 size={32} color="white" />
          </ActionIcon>
        </Tooltip>

        <PlayPauseButton
          isPaused={isPaused}
          loading={loading}
          togglePause={togglePause}
          hideOnMobile
        />

        <Tooltip label="Skip 10 seconds">
          <ActionIcon
            color="#ea3722"
            size={48}
            aria-label="Skip forward 10 seconds"
            disabled={loading}
            onClick={() => skipForward10()}
          >
            <IconRewindForward10 size={32} color="white" />
          </ActionIcon>
        </Tooltip>

        {isLive && (
          <Tooltip label="Skip to live">
            <ActionIcon
              color="#ea3722"
              size={42}
              aria-label="Skip to live"
              disabled={loading}
              onClick={() => skipForwardToLive()}
            >
              <IconPlayerSkipForward size={24} color="white" />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Stack>
  );
}
