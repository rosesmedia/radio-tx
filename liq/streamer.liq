#!/usr/bin/env liquidsoap

settings.server.telnet := true

stream_id = "abcde"

# in = input.srt(
#     bind_address = "0.0.0.0",
#     mode = "listener",
#     port = 8889,
#     start = true,
# )

# in = mksafe(in)

in = input.jack(id="stream_in")

aac_high =
  %ffmpeg(
    format = "mpegts",
    %audio(codec = "aac", channels = 2, ar = 44100, b = "192k")
  )

streams = [("aac_high", aac_high)]

def segment_name(metadata) =
  let timestamp = int_of_float(time())
  let {stream_name, duration, position, extname} = metadata
  let filename = "#{stream_name}_#{duration}_#{timestamp}_#{position}.#{extname}"
  http.post(
    data = json.stringify({
      index = position,
      timestamp = timestamp,
      filename = filename,
      duration = duration,
    }),
    headers = [("Content-Type", "application/json; charset=UTF-8")],
    "http://localhost:3000/api/stream/#{stream_id}/segment"
  )
  filename
end

def segment_changed(~state, filename) =
  if state == "created" then
    _ = http.post(
      data = json.stringify({
        filename = path.basename(filename),
        ready = true,
      }),
      headers = [("Content-Type", "application/json; charset=UTF-8")],
      "http://localhost:3000/api/stream/#{stream_id}/segment/ready",
    )
  end
end

output.file.hls(
  playlist="stream.m3u8",
  segment_duration=4.0,
  segments=5,
  segments_overhead=null(),
  segment_name=segment_name,
  on_file_change=segment_changed,
  persist_at="./hls.state",
  "./hls/",
  streams,
  in
)
