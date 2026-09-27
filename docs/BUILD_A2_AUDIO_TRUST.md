# Build A2 — Audio Trust (acceptance candidate)

A1 remains accepted. No writing, curriculum expansion, speech recognition, pronunciation scoring,
learner pitch analysis, identity/sync or new player is included.

## Recording audit and change

The earlier implementation could close microphone tracks before the final recorder chunk and
announced capture before browser readiness. Those risks were repaired before A2; historical
user failures cannot now be attributed conclusively to a specific one.

A2 found a remaining, reproducible synchronization issue: readiness waited for a nonempty chunk
AND 500 ms. Timeslices are delivery intervals, not microphone-readiness signals, and Safari may
batch them. That guaranteed pre-roll and could unnecessarily delay the speaking cue.

Current path: getUserMedia (processing requested off) → MediaRecorder listeners installed → start
→ browser `start` event AND live/unmuted audio tracks → speaking cue. A muted track must unmute
before the cue; there is no fixed preparation delay. All pre-cue data is retained. There is no VAD,
no trimming of learner speech, and no claim that a start event proves future acoustic integrity.
The existing 200 ms stop tail is retained conservatively to protect endings; it is not a readiness
workaround. A 10 s startup watchdog and 5 s finalization watchdog release the microphone on failure.

All nonempty chunks, including the final chunk, are assembled in order. Tracks stay open until
`stop`, which follows final data delivery. Browser-supported MIME selection remains WebM/Opus,
MP4 or Ogg/Opus, using the returned MIME. The final blob must decode. Extremely short but decodable
clips are retained rather than rejected solely for being below 200 ms. Existing silence/click
warnings retain playback and are recording-health heuristics, never pronunciation judgments.

Mute/end/hidden page/pause/error stops recording and marks interruption. An immediate interruption
can precede any decodable frame: it now reports interruption even if there is no clip to replay.
Unexpected native recorder stop is also marked interrupted. Reference playback is locked during
capture; retake and unmount release resources, late permission streams are stopped, URLs revoked.

References: [MediaRecorder start](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start),
[dataavailable timing](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/dataavailable_event).

## Tone Lab: explicit didactic contours

A single bounded TTS tone set was inspected and rejected: measured third-tone dip/rise was shallow
and the fourth tone had a prominent initial rise. Do not treat correct prompt text as correct audio.
The prior Wolfdog excerpts also did not make all teaching contours sufficiently explicit.

Current four clips use the first isolated /ma/ in Wolfdog's
[FourMandarinTones.ogg](https://commons.wikimedia.org/wiki/File:FourMandarinTones.ogg), 0.30–1.30 s,
as their common voiced basis. Praat overlap-add resynthesis replaces only its pitch tier;
no duration scaling. Shared timbre and duration make the intended contrasts clearer technically.
The app and licence page explicitly label them as edited teaching contours, not unedited natural speech.

- Tone 1: approximately 205 Hz, level.
- Tone 2: approximately 117 → 220 Hz.
- Tone 3: approximately 156 → 95 → 200 Hz (full isolated teaching contour).
- Tone 4: approximately 227 → 100 Hz.

These are measured exported-file contours, not only synthesis targets. No measurement code runs
on learner audio. Tone 3 remains explicitly distinguished from connected-speech realizations.
Subjective naturalness, audible artifacts and beginner usefulness still require human listening.

Source and derivatives: **Wolfdog, CC BY-SA 4.0**. Attribution, changes and licence link shipped in
`public/licenses/mandarin-tones.html`. Source preserved under scripts/audio-source.
Offline processing: Praat/Parselmouth 0.4.7 (GPLv3); no library shipped in the app.
[Established Praat workflow](https://parselmouth.readthedocs.io/en/stable/examples/pitch_manipulation.html).

## Natural and careful_slow

Old files used AVSpeechSynthesizer rates 0.32 and 0.0. Separate calls alone did not establish distinct
speaking styles. All 16 active phrase files are replaced by separately generated style-conditioned
speech using **Qwen3-TTS-12Hz-1.7B-CustomVoice**, preset **Serena**, local MLX-Audio 0.4.4 (MIT).
Model: Apache 2.0, [official model card](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice).
4-bit conversion: mlx-community; pinned revision, prompts, seeds and file hashes in A2_AUDIO_MANIFEST.json.
No learner audio or voice cloning. No generated outputs are claimed to be a real speaker recording.

Natural requests calm, clear Mandarin; careful_slow requests deliberate articulation and syllable
spacing. Both use generation speed=1 and playbackRate=1. No resampling-for-speed, pitch shifting,
time stretching or duration-tier manipulation is used for any phrase pair. The separate, explicitly
edited Tone Lab assets are the only pitch-manipulated references.

A few generations were rejected for excessive pauses/runaway duration; final single 我 uses terminal
punctuation to obtain a bounded utterance. Exact final text and instructions are preserved. All pairs
are distinct and slow is longer, but duration is only a regression signal, not quality proof.
The old >1.5× rule encouraged duration over style, so the new minimum is 1.2×; 我 is 1.25× and needs
particular listening attention. Other pairs range approximately 1.5–4.3×. Human acceptance can still
reject exaggeration or insufficient style difference. Current audio status remains prototype/draft.

Scripts/generate-a2-audio.py reproduces candidates into a scratch output directory; it never updates
production assets automatically. Libraries/models are isolated build tools, not app dependencies.
Canonical item → audio (natural) / slowAudio (careful_slow) mapping stays in lesson content. Tone files
now also have explicit canonical references; screens no longer invent tone asset paths.
Validation rejects missing/identical variants, missing tone references, missing/broken WAV files,
manifest mapping errors and unexpected asset hashes. No asset-management system introduced.

## Test evidence and limits

- Content validation and production build pass. 34 Node tests and 18 targeted Chrome/WebKit browser cases pass.
- Ten consecutive actual MediaRecorder signal captures per engine, 0.12–6 s: beginning, end,
  continuity and playback verified with controlled frequencies. Tests include very quick stop.
- Ten additional Mandarin speech-file captures per engine: short words and phrases repeated to
  approximately 4.8 s. Source/recorded energy envelopes, duration and full playback checked.
  These are controlled browser inputs, not an acoustic Mandarin correctness test.
- Mocked delayed final chunks verify exact byte assembly, empty-chunk handling, readiness without
  waiting for a timeslice, and track release after final data. Permission, interruption, silence,
  click, reference-lock and disposal regressions tested.
- All 20 reference files play to completion at rate 1 in Chrome and WebKit, including mobile viewport.
- A real default Mac microphone stream was opened (live, unmuted). Ten additional recordings through
  the actual Mac speaker→microphone path were exercised using reference playback, including retakes
  without reload and longer repeated phrases. All ten decoded and played to completion without silence/click/interruption warnings (1.44–8.52 s recorded duration, RMS 0.034–0.096). The external player launch adds silence; these durations are not UI latency measurements. This does not substitute for a person speaking/listening.
- Human auditory Mandarin validation has NOT been performed by the agent. Successful playback and
  acoustic metrics do not prove intelligibility, correct Mandarin or pedagogical quality.
- A physical iPhone / installed Safari PWA is unavailable to this runtime. WebKit tests are not an
  iPhone test. iOS interruptions, lock screen, first permission grant and hardware onset remain for
  real-device acceptance. A silent interval without browser interruption signals cannot reliably be
  distinguished from an intentional pause without the out-of-scope speech/VAD analysis.

## Acceptance route

`/__test/a1#audio` on the existing isolated test preview opens **A2 – Audio direkt testen**.
No real learner/research writes. Record, immediately replay, retake; Reset remounts and discards the
local recording. Select each pair and compare the four contours without replaying the course.

Real-device checklist: first permission grant; ten consecutive mixed-duration takes (我, 你, 好,
谢谢, 我叫 Wolfram, 你好, name question, longer phrase, longer phrase, 我); start on the speaking cue;
stop quickly for two takes; listen for intact start/end and unintended gaps; reset once. Repeat in
Mac browser and iPhone Safari, plus installed PWA if used. Judge all four tone contrasts and at least
我 / 你好 / 谢谢 / name question natural versus careful_slow. No fifth-tone teaching is added.

A2 is an acceptance candidate, not a claim of completed human audio approval. Stop after deployment.
