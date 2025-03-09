import { Indicator } from "@mantine/core";
import { IconAccessPoint } from "@tabler/icons-react";

export default function StreamsIcon({ isAnyStreamLive }: { isAnyStreamLive: boolean; }) {
    if (isAnyStreamLive) {
        return <Indicator color="red">
            <IconAccessPoint />
        </Indicator>
    } else {
        return <IconAccessPoint />
    }
}
