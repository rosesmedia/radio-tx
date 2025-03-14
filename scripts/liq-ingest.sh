#!/usr/bin/env bash

set -eux -o pipefail

if [ $# -ne 1 ]; then
    echo "Usage: $0 <ob id>"
    exit 1
fi

ingest_point=$(curl --silent --fail "$STREAM_API_BASE/api/ingest/$1")

JACK_ID=$(echo "$ingest_point" | jq --raw-output .id)
ICECAST_SERVER=$(echo "$ingest_point" | jq --raw-output .icecastServer)
ICECAST_MOUNT=$(echo "$ingest_point" | jq --raw-output .icecastMount)

export JACK_ID
export ICECAST_SERVER
export ICECAST_MOUNT

exec /usr/bin/liquidsoap "/usr/local/libexec/liquidsoap/ice_to_jack.liq"
