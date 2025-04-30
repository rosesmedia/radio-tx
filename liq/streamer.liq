#!/usr/bin/env liquidsoap

settings.frame.audio.channels := 2
settings.frame.audio.samplerate := 48000

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
control_port = int_of_string(get_env("PORT"))

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

in = input.jack(id="streamer_#{stream_id}")

source = ref(2)

starting = amplify(0.5, single("/opt/radio-tx/starting.wav"))
ended = amplify(0.5, single("/opt/radio-tx/ended.wav"))
techdiff = amplify(0.5, single("/opt/radio-tx/techdiff.wav"))

def handle_set_source(request, response) =
    response.status_code(200)
    new_source = int_of_string(request.query["source"])
    if (new_source >= 1 and new_source <= 4 and new_source != source()) then
        source.set(new_source)
        if (new_source == 2) then
            starting.skip()
        elsif (new_source == 3) then
            ended.skip()
        elsif (new_source == 4) then
            techdiff.skip()
        end
        response.json({source=source()})
    else
        response.json({source=source()})
    end
end

def handle_get_source(request, response) =
  response.status_code(200)
  response.json({source=source()})
end

harbor.http.register(port=control_port, method="POST", "/source/:source", handle_set_source)
harbor.http.register(port=control_port, method="GET", "/source", handle_get_source)

stream = switch(
  [
    ({source() == 1}, in),
    ({source() == 2}, starting),
    ({source() == 3}, ended),
    ({source() == 4}, techdiff),
    ({true}, techdiff),
  ],
  track_sensitive=false
  # transitions=[
  #   do_nice_fade, do_nice_fade, do_nice_fade, do_nice_fade, do_nice_fade
  # ]
)

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

output.file.hls(
  playlist="stream.m3u8",
  segment_duration=4.0,
  segments=5,
  segments_overhead=null(),
  on_start=notify_ready,
  segment_name=segment_name,
  on_file_change=segment_changed,
  persist_at="./hls.state",
  "/var/www/hls/#{stream_id}/",
  streams,
  stream
)
