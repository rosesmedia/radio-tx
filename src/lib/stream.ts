import { Stream, StreamState } from "@prisma/client";
import { env } from "./env";

export interface StreamInfo {
    fixtureId: string;
    name: string;
    state: StreamState;
    hlsPlaylist: string;
}

export function toStreamInfo(stream: Stream) {
    return {
        fixtureId: stream.fixtureId,
        name: stream.name,
        state: stream.state,
        hlsPlaylist: `${env.PUBLIC_URL}/api/stream/${stream.fixtureId}/playlist.m3u8`,
    }
}
