# Pilot production bugfix — recording reliability

2026-09-29. Reported environment: Safari on a MacBook Pro using its built-in microphone.

## Baseline and scope

Fetched production `main`: `acfa24938a4d516942f8deface61f8e29fd3c9c4`; latest application change `fb6c4c0` (F-light). Rebuilding this main revision reproduced the live `/assets/App-f-KmE21Q.js` and `/sw.js` byte for byte; worker cache `mandarin-v01-c4ac911d73c24f51`. Live label: **F-light · E · UI1 · C2.3+ · Inhalte D**. Research/Lab changes excluded.

Read LEARNING_ARCHITECTURE, PRODUCT_OBSERVATIONS, deployment, Build C interaction flow, A2 Polly workflow and F-light documentation; inspected the production capture/playback implementation. This is a blocked-flow repair, not a new learning build.

## A — stuck replay: reproduced and corrected

The new focused test uses each browser's real MediaRecorder with a controlled Web Audio stream, rather than substituting a pre-encoded MP3. On unmodified main, WebKit's first automatic playback ended normally. On replay it reached `audio.ended === true` and the end of the media, but `paused` stayed false and neither `ended` nor `pause` was dispatched. The React handlers therefore never released the interaction lock; manual pause did. Chrome completed normally. This reproduces the observed symptom in Playwright WebKit, not a claim to have instrumented the user's exact Safari session or identified WebKit's internal defect.

Recorder completion now runs from both the normal ended/pause events and `timeupdate` **when the element itself reports ended**. The latter reconciles WebKit's missing-event state and pauses the completed element so another replay starts cleanly. No duration estimate, timeout, gain change, or seeking-to-the-end workaround. Continue still respects all other existing gates.

Handlers validate the current element and blob; stale events from removed elements or a previous capture cannot release a new capture's lock. Ended/pause handlers check actual media state, so an obsolete queued event cannot terminate an active replay. Each blob has its own keyed element. Auto playback, manual replay, and pause use the same completion path and original blob.

## B — low recording level: WATCH / active investigation

Repeated user observation: Safari, built-in MacBook Pro microphone, healthy macOS input indication, intermittently extremely quiet app recordings. This is retained as a real unresolved problem. The macOS meter and browser capture need not have identical processing.

### Production pipeline

1. `getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}})`. No requested sample rate, sample size, channel count, input volume, or specific device ID. These boolean requests are not proof of actual track settings.
2. Browser stream goes directly to MediaRecorder. No capture Web Audio graph, gain node, compressor, normalization, or resampling code.
3. Codec preference: first supported of `audio/webm;codecs=opus`, `audio/mp4`, `audio/ogg;codecs=opus`; otherwise browser default. No explicit bitrate. `start(200)` collects every nonempty chunk, including the final chunk; normal stop retains the existing 200-ms capture tail and releases tracks after stop.
4. Original chunks become one Blob. A separate AudioContext decodes it only to inspect duration and audible energy for the existing health warning. Decoded samples are never re-encoded or used as the playback source.
5. One object URL of that original blob is used by automatic playback and replay. Native HTMLAudioElement playback; application code sets no playback gain/volume, mute, compressor or conversion. The ordinary defaults are volume 1, unmuted, rate 1.
6. The app does not persist learner microphone bytes. Existing events record only capture metadata/health, not pronunciation correctness.

### Requested versus actual

The actual affected **hardware** track settings/capabilities and a representative quiet voice take have not been captured in this investigation. Do not claim the requested processing flags were honored on that device. No physical-microphone level diagnosis can be inferred from the deterministic stream used by automation.

The small [local diagnostic](../tools/recording-diagnostic/README.md), excluded from production output, exposes the relevant supported settings/capabilities and separates sampled microphone input, full decoded blob measurements, and native playback settings. It records no device/group IDs and never uploads or saves audio. Audio is released on discard/new take/close. Playback remains the native element path. An experimental Web Audio output tap returned zeros for a healthy WebKit blob, so it was removed; output amplitude, actual speaker loudness and macOS output gain remain unmeasured. It reports peak/RMS, clipping and quiet-window fractions, not pronunciation scores.

No root cause of the intermittent low level is established. Disabling browser processing may matter, but changing those flags or adding gain/AGC without a representative input/blob/output comparison would be speculative. **No level correction is shipped.** Reference audio and capture constraints are unchanged.

## Verification

See the final focused test results and diagnostic measurements below. No A1 browser QA, A2 hearing acceptance, writing matrix, D content review, product UI audit, or broad browser regression was run. Existing domain tests ran once as the normal production check; the build's standard content validator remains intact.

Production learning semantics, scheduler, curriculum, reference assets, F-light evidence, storage format and existing learner data are untouched. Bug A is explicitly authorized for production independently of Bug B.

### Focused results

- Normal domain suite: **79/79 passed**, run once.
- Production build/typecheck and standard content validation passed; 44 words, 36 items, 131 tasks, 76 audio references unchanged.
- **10/10 focused browser cases passed** (5 per engine): real encoder automatic end/repeated replay/manual pause/Continue, obsolete event safety and exit during playback, rejected autoplay/manual recovery, local level diagnostic, existing final-chunk/integrity test. The old capture test was updated only to finish the existing introduction before accessing Record. An early new-test expectation incorrectly assumed the next object rather than checking departure from the recorder; corrected without changing app navigation.
- Baseline WebKit failure was captured before the production fix: first playback emitted pause/ended, replay emitted play/playing but then had ended=true, paused=false and no completion event. Corrected replay handles that state successfully.
- Manual/source transitions stop playback; subsequent capture/remount is usable. Synthetic stale ended/pause events while the current element is still playing do not unlock Continue. Old element events cannot affect later capture.
- No generated/accepted reference audio bytes were changed. No diagnostic file is included in the production output. `git diff --check` passed.

### Synthetic level results (not hardware evidence)

A 440-Hz sine with amplitude .1 fed a generated stereo MediaStream. Nominal peak -20 dBFS, RMS about -23 dBFS. macOS 27.0.1; automated Chrome 154 and Playwright WebKit (Safari 26.6 user-agent).

| Measurement | Chrome | WebKit |
| --- | ---: | ---: |
| Sampled input peak dBFS | -20.00 | -20.00 |
| Sampled input RMS dBFS | -23.05 | -23.91 |
| Decoded blob peak dBFS | -19.70 | -19.00 |
| Decoded blob RMS dBFS | -23.02 | -22.90 |
| Blob clipping fraction | 0 | 0 |
| Blob quiet-window fraction | 0 | 0 |
| Sampled input quiet-window fraction | 0 | .183 |
| Chosen recorder MIME | audio/webm;codecs=opus | audio/webm;codecs=opus |
| Reported recorder bitrate | 128000 | 192000 |

The sampled WebKit input includes zero windows; input/blob sampling is not time aligned. These tests do not demonstrate intermittent hardware loss and do not justify gain. Both resulting decoded blobs retain a healthy controlled signal. Both native elements report volume 1, muted false, rate 1 and the same blob. Native speaker-output amplitude remains unmeasured.

Generated-stream settings: Chrome exposes sampleRate 48000, sampleSize 16, channelCount 2, latency .01; capabilities list false-only echo cancellation/noise suppression/AGC and 16-bit samples. WebKit exposes empty settings/capability objects for this generated stream. **These are not the built-in microphone's actual settings.** Both decoded blobs are 48-kHz stereo in this run; physical Safari may select another supported codec/container or track format.
