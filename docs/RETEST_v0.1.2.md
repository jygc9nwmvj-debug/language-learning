# Lesson 1 — second-test version 0.1.2

**Current extension:** [Writing fading 0.1.3](WRITING_FADING_v0.1.3.md) supersedes the writing progression below; other repairs remain.

Scope: repairs to V0.1 only. Lesson 2 untouched. No pitch grading, speech recognition, handwriting OCR,
new engine, accounts or curriculum expansion.

## Capture fixes

The previous implementation announced recording immediately after calling start(), and stopped input
tracks immediately after calling stop(), before the final dataavailable/stop sequence. Browser speech
processing was left at defaults and the limit was an undisclosed 15 seconds. These are concrete risks;
we cannot retrospectively prove which caused each learner-reported failure.

Now: permission → preparing → recording → finalizing → replay. At least 500 ms and a nonempty encoder
chunk with live/unmuted input are required before “Aufnahme läuft”. All initial chunks are retained.
Echo cancellation, noise suppression and automatic gain control are requested off to avoid suppressing
short isolated syllables. Browser-supported Opus/WebM, MP4 or Ogg is chosen; actual returned MIME is
used. Chunks accumulate every 200 ms, including the final chunk. Stop allows a 200 ms tail, waits for
finalization, then closes tracks. Maximum 60 seconds is visible. Startup/finalization timeouts release
resources. Hidden tab, muted/ended track or recorder error stops capture and marks it uncertain.
Reference playback is stopped and locked during capture; comparison playback cannot overlap.
The completed blob must decode and have nontrivial duration. Fewer than four audible 20 ms windows
(at RMS >0.004) produces a silence/click warning while retaining playback. These levels are
engineering heuristics, not speech recognition. Very quiet speech can trigger the same warning.

Recordings remain ephemeral. Local log adds only duration, chunk count, bytes, codec and interruption
flag plus audible-window duration; no audio or inferred pronunciation score. OS-level dropouts without a browser event cannot be
reliably identified as such: silence might be a real pause. Actual MacBook microphone verification is
still required. Reported environment: MacBook Pro, built-in microphone; browser unspecified.

## Audio, tones and typing

Four-tone demo replaced with a licensed, spoken set; source/cut details and remaining listening QA in
ASSET_REGISTER_v0.1.md. The third-tone explanation separates isolated full contour from natural context.
Eight separate natural/slow pairs re-exported; slow speech is 1.64–1.68× as long before equal padding.
No player speed or pitch manipulation. Human listening approval remains open.

Tone Lab now briefly teaches ma1→mā, ma2→má, ma3→mǎ, ma4→mà, neutral 5/0, then requires one practical
ma2 keyboard exercise. Tone parsing checks each authored syllable rather than concatenated digits.
Missing notation (including partially missing) and wrong notation are separate from correct word
recall; spoken tone ability stays unknown. Three short audio tone retrievals are interleaved later
using 我, 叫 in 我叫, and first 謝 in 謝謝. No new lexical content.

## Writing and paper

“Vorlage zeigen” now fills the actual Hanzi Writer canvas in place and toggles visibly; blank/paper
modes display a reference adjacent to the writing area. Hint evidence is still recorded.

Hanzi Writer 3.7.3 evaluation uses real pointer gestures in its quiz with **no outline or character**,
default leniency, hints effectively disabled. Six canonical median paths complete 好; the same paths
with alternating ±9 px horizontal and ±6 px vertical deviations also complete it; six unrelated
horizontal strokes are rejected, with no correct strokes or completed character. These are controlled
simulated pen gestures, not a representative sample of human handwriting. The recognizer checks
ordered strokes against a fixed character, not holistic legibility: recognizable alternative stroke
order may fail. The blank canvas therefore remains ungraded self-report. No custom evaluator added.
Documentation: https://hanziwriter.org/docs.html#quizzing

Paper mode and A4 output preserved. Future multi-character sheets should use an array of due writing
relations with per-row cell size in the Mandarin Worksheet component. This is a presentation change,
not a new scheduler or mastery model; no per-character page rule is introduced. Smaller grids must
remain a hypothesis to test, not evidence of handwriting skill.

## Verification

2026-09-27: build and 8 domain/storage/asset tests passed. All 17 initial browser checks passed
(Chrome plus WebKit 26.6), including a separate ten-take series in each engine. A final focused
rerun passed all 10 affected checks, including both ten-take series and the new silence/click warnings.
Across the suites, all 19 distinct browser cases passed, with no skipped or flaky outcomes. The first WebKit test failure came from assigning
its getUserMedia method on a transient wrapper; installing the test mediaDevices object corrected
that simulation. No production workaround for that test-only issue was introduced.


Build/content validation and unit tests cover typing, evidence, persistence and audio variant duration.
Browser tests cover full Lesson 1 including typed-number practice and distributed tone retrievals,
local backup, offline cold reopen, delayed review, phone viewport, A4, visible reference toggle,
retest preserving historical sessions, interrupted/denied/pending microphone cleanup and handwriting.
Ten consecutive short/long recordings use a synthetic Web Audio source feeding the **real** browser
MediaRecorder: 0.45, 0.8, 1.2, 3, 6 seconds, twice. Distinct beginning/middle/end frequencies, decoded
20 ms windows and playback completion check preservation and absence of internal signal dropouts.
This isolates the browser capture chain; it does not certify the physical microphone, OS processing,
Bluetooth, the learner’s voice, every browser version or long background recording.

## Production navigation repair

Cloudflare returns HTTP 308 from /index.html to /. The previous worker precached /index.html;
WebKit reproduced the production reload failure: “Response served by service worker has redirections”.
The worker now precaches the unredirected root / and uses that response for navigation. Its own source
also contributes to the cache identity, so worker-strategy changes get a separate cache. A local server
reproducing Cloudflare’s redirect verifies online reload followed by reload with the origin server
shut down in Chrome and WebKit. This uses server unavailability because WebKit offline emulation
itself has an upstream navigation bug: https://github.com/microsoft/playwright/issues/42775 . No learner database or history is cleared. These two added checks bring the distinct browser
cases to 21; the affected lesson/offline checks are rerun after the repair.

## Second learner test

URL: https://language-learning-abk.pages.dev/
Close every old app tab/window and reopen online; confirm **Testversion 0.1.3** on the home screen.
Use Einstellungen & Sicherung → Lesson 1 vollständig erneut testen. Earlier research/history remains.
Wait for “Aufnahme läuft … Jetzt sprechen” each time. Suggested ten recordings:
wǒ, nǐ, wǒ jiào Wolfram, 謝謝, one 5–10 second sentence; repeat those five once.
Replay each immediately and note missing beginning/end, silence or dropouts, plus browser name/version.
Then complete the full lesson: compare all four tone examples, normal/slow, template toggle, typed ma2,
three distributed tone questions, free writing and paper. Export the research log if anything fails.
Do not start Lesson 2 until this second loop has been evaluated.

## Technical references

- MediaRecorder final data/stop ordering: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/dataavailable_event
- Recording lifecycle specification: https://www.w3.org/TR/mediastream-recording/
- Source attribution and transformations: [asset register](ASSET_REGISTER_v0.1.md).
