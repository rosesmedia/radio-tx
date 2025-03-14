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

icecast_server = get_env("ICECAST_SERVER")
icecast_mount = get_env("ICECAST_MOUNT")
ingest_id = get_env("INGEST_ID")

ob = stereo(input.http("#{icecast_server}/#{icecast_mount}", self_sync=false))

beeps = metronome(12.0, frequency=1000.0)

out = fallback([ob, beeps], track_sensitive=false)

output.jack(id="ingest_#{ingest_id}", out)
