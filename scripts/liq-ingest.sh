#!/usr/bin/env bash

set -eux -o pipefail

if [ $# -ne 1 ]; then
    echo "Usage: $0 <ob id>"
    exit 1
fi

ingest_point=$(curl --silent --fail -H "Authorization: Bearer $STREAM_API_TOKEN" "$STREAM_API_BASE/api/ingest/$1")

INGEST_ID=$(echo "$ingest_point" | jq --raw-output .id)
ICECAST_SERVER=$(echo "$ingest_point" | jq --raw-output .icecastServer)
ICECAST_MOUNT=$(echo "$ingest_point" | jq --raw-output .icecastMount)

export INGEST_ID
export ICECAST_SERVER
export ICECAST_MOUNT

exec /usr/bin/liquidsoap "/usr/local/libexec/liquidsoap/ice_to_jack.liq"
