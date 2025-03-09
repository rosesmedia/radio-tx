import { StreamState } from "@prisma/client";
import { IconHeadphones } from "@tabler/icons-react";

import unavailable from '@/components/StreamStatusIndicator/unavailable.svg';
import live from '@/components/StreamStatusIndicator/live.svg';
import Image from "next/image";

export function StreamStatusIndicator({ status }: { status: StreamState}) {
    switch (status) {
        case 'Pending':
            return <Image alt="Pending" src={unavailable} />
        case 'Live':
            return <Image alt="Live" src={live} />
        case 'Complete':
            return <IconHeadphones aria-label="Catchup" />
    }
}