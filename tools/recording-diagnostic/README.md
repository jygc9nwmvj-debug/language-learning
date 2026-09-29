# Local recording-level diagnostic

Not part of the production build or normal learner UI. Run from the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory tools/recording-diagnostic
```

Open http://localhost:8765 in **Safari on the affected MacBook Pro**, select the built-in microphone if the browser asks, record a short normal phrase, stop, and replay. Compare a healthy and a quiet take if the intermittent problem recurs naturally. The browser may request microphone permission for localhost separately from production. This does not change the production permission flow.

The page uses the exact production audio constraints and codec preference. It shows the browser's actual exposed settings/capabilities (without device/group IDs), input measurements, decoded original-blob measurements, and native playback settings. It does not upload anything or save audio. New take, Discard, or page close releases audio; maximum capture is 15 seconds. Do not interpret the synthetic automated tests as a built-in microphone measurement.

- Input: periodic 1024-sample mono analyser windows, taken from a parallel stream tap.
- Blob: every decoded channel, in 20-ms windows; peak, RMS, clipping fraction and quiet-window fraction.
- Output: native volume/mute/rate and same-blob checks, with ordinary playback for listening. No Web Audio playback routing is added. Output amplitude, speaker loudness and macOS output gain are **not measured**. An experimental playback tap returned all-zero data for a known healthy WebKit blob; it was removed because this instrumentation would not reliably represent native playback.
- Quiet threshold: RMS below .004 (about -48 dBFS). Clipping threshold: absolute sample >= .999. These are descriptive signal checks, not speech or pronunciation judgements. A zero level is printed as null dBFS.
- Input sampled windows can omit transients, downmix stereo, or include edge silence; they are not sample-aligned comparisons. Use sustained speech/sound and inspect differences with those limitations.

If input and blob are both quiet, investigate the browser/device capture path. If input is healthy but the blob is quiet, investigate recording/encoding. If the decoded blob is healthy but native listening is quiet, investigate playback/output routing; this page cannot establish speaker-output amplitude. A healthy macOS input meter alone does not establish the level delivered to `getUserMedia`.

Copy the displayed JSON only if diagnostic evidence is needed. There is no audio export button, normalization, compressor, gain correction, or permanent analytics framework.
