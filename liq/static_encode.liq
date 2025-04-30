#!/usr/bin/env liquidsoap

settings.frame.audio.channels := 2
settings.frame.audio.samplerate := 48000

log.level := 4

def get_env(key) =
  value = environment.get(key)
  if value != "" then
    value
  else
    log.critical("Must set the `#{key}` environment variable")
    shutdown(code=123)
    ""
  end
end

stream_id = get_env("STREAM_ID")
api_base = get_env("STREAM_API_BASE")
api_token = get_env("STREAM_API_TOKEN")

def notify_ready() =
  # the endpoint doesn't need any request body values, but liquidsoap json.stringify serialises {} as an empty array
  ignore(http.post(
    data = json.stringify({
      ready = true,
    }),
    headers = [
      ("Content-Type", "application/json; charset=UTF-8"),
      ("Authorization", "Bearer #{api_token}")
    ],
    "#{api_base}/api/stream/#{stream_id}/ready"
  ))
end

in = playlist.list(["boatrace-final.mp3"], loop=false)

aac_high =
  %ffmpeg(
    format = "mpegts",
    interleaved = false,
    %audio(
      codec = "aac",
      channels = 2,
      ar = 48000,
      b = "192k",
      profile = "aac_low"
    )
  )

streams = [("aac_high", aac_high)]

def segment_name(metadata) =
  let timestamp = int_of_float(time())
  let {stream_name, duration, position, extname} = metadata
  let filename = "#{stream_name}_#{duration}_#{timestamp}_#{position}.#{extname}"
  ignore(http.post(
    data = json.stringify({
      index = position,
      timestamp = timestamp,
      filename = filename,
      duration = duration,
    }),
    headers = [
      ("Content-Type", "application/json; charset=UTF-8"),
      ("Authorization", "Bearer #{api_token}")
    ],
    "#{api_base}/api/stream/#{stream_id}/segment"
  ))
  filename
end

def segment_changed(~state, filename) =
  if state == "created" and (not string.contains(filename, suffix=".m3u8")) then
    ignore(http.post(
      data = json.stringify({
        filename = path.basename(filename),
        ready = true,
      }),
      headers = [
        ("Content-Type", "application/json; charset=UTF-8"),
        ("Authorization", "Bearer #{api_token}")
      ],
      "#{api_base}/api/stream/#{stream_id}/segment/ready",
    ))
  end
end

clock.assign_new(sync="none",[in])

output.file.hls(
  playlist="stream.m3u8",
  segment_duration=4.0,
  segments=5,
  segments_overhead=null(),
  fallible=true,
  on_start=notify_ready,
  on_stop=shutdown,
  segment_name=segment_name,
  on_file_change=segment_changed,
  persist_at="./hls.state",
  "./hls/#{stream_id}/",
  streams,
  in
)
