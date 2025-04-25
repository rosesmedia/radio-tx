#!/usr/bin/env bash

set -eux -o pipefail

config=$(curl --silent --fail --request POST -H 'Content-Type: application/json' --data '{}' -H "Authorization: Bearer $STREAM_API_TOKEN" "$STREAM_API_BASE/api/stream/$STREAM_ID/prepare")

PORT=$(echo "$config" | jq --raw-output .port)

export PORT

exec /usr/bin/liquidsoap "/usr/local/libexec/liquidsoap/streamer.liq"
