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
jack_id = get_env("JACK_ID")

ob = audio_to_stereo(input.http("#{icecast_server}/#{icecast_mount}"))

beeps = metronome(12.0, frequency=1000.0)

out = fallback([ob, beeps])

output.jack(id=jack_id, out)
