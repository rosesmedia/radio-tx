'use client';

import { Alert, Loader } from "@mantine/core";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

interface Props {
  streamId: string;
  isLive: boolean;
}

const HLS_MIME = 'application/vnd.apple.mpegurl';

function supportsHls(): boolean {
    return (new Audio().canPlayType(HLS_MIME) !== '') || Hls.isSupported();
}

export default function StreamPlayer(props: Props) {
    const [supported, setSupported] = useState<boolean | null>(null);

    useEffect(() => {
        setSupported(supportsHls());
    }, []);

    if (supported === null) {
        return <Loader />
    } else if (supported) {
        return <StreamPlayerInner {...props} />
    } else {
        return <Alert color='red' variant='outline' title='Unsupported browser' icon={<IconAlertSquareRounded />}>
            Your browser is currently not supported, sorry.
        </Alert>
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
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(audio.current);
            return () => hls.destroy();
        } else {
            console.error('StreamPlayerInner initialised when HLS is not supported. This should not happen!');
        }
    }, [streamId]);

  return <audio controls ref={audio} />;
}
