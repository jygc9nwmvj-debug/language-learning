> A2 supersedes the audio sections below. Current provenance, generation and limitations: [BUILD_A2_AUDIO_TRUST.md](BUILD_A2_AUDIO_TRUST.md), [A2_AUDIO_MANIFEST.json](A2_AUDIO_MANIFEST.json). Earlier sections are historical.

# V0.1.2 audio and writing assets

## Four-tone introduction — replaced after first learner test

`public/audio/mandarin/ma1.wav` … `ma4.wav` are excerpts of **FourMandarinTones.ogg**, Wolfdog,
2019-10-26, https://commons.wikimedia.org/wiki/File:FourMandarinTones.ogg .
Source and adapted files: **CC BY-SA 4.0**, https://creativecommons.org/licenses/by-sa/4.0/ .
Attribution, license and edit notice are shipped at `public/licenses/mandarin-tones.html`, linked in Tone Lab.
Source SHA-1: db81e637a2f1908eacb7244845fbf9162e410ec8.
Cuts in seconds: [0.30,1.30], [1.65,2.70], [3.00,4.15], [4.45,5.30].
Converted Ogg to mono PCM16 WAV, 44.1 kHz. No pitch correction, time stretching or resynthesis.
The four excerpts keep one speaker. Native-speaker status is not asserted by the source.

Offline acoustic inspection supports a stable first tone, a clear second-tone rise (roughly 95→150 Hz
in voiced portions), a third-tone dip with a return upward, and a short fourth tone. These rough
measurements are not a pedagogical approval or a learner-scoring algorithm. No acoustic analysis
was added to the app. Independent listening approval by a Mandarin teacher and the learner remains open.
The UI explicitly distinguishes the full isolated third-tone example from its contextual realization.

## Eight phrases/words — new natural and careful_slow exports

Generated locally 2026-09-27 using `AVSpeechSynthesizer`, selected installed `zh-TW` voice;
Traditional text from lesson-001.json. Generator source: `scripts/synthesize-mandarin.swift`.
Rates: **0.32 natural**, **0.0 careful_slow**. Two separate synthesis requests per item.
Native synthesis controls the pace; the player always runs at rate 1. No post-hoc pitch/time effects.
PCM16 WAV at 22.05 kHz; 100 ms leading and 150 ms trailing playback margins added to both variants.
No learner recording or cloud speech service used. The former `say -r160/-r110` files were replaced
because those settings produced an inadequate audible duration difference.

Measured synthesis duration, excluding the identical 250 ms playback margins:

| Item | natural (s) | careful_slow (s) | ratio |
|---|---:|---:|---:|
| nihao | 0.620 | 1.024 | 1.65 |
| wo | 0.339 | 0.569 | 1.68 |
| ni | 0.318 | 0.524 | 1.65 |
| hao | 0.426 | 0.708 | 1.66 |
| wojiao | 0.643 | 1.057 | 1.64 |
| askname | 1.432 | 2.371 | 1.66 |
| xiexie | 0.713 | 1.175 | 1.65 |
| zaijian | 0.712 | 1.172 | 1.65 |

A regression test checks every variant remains more than 1.5× as long excluding margins.
This verifies pace difference, not naturalness or careful articulation. Listening review remains open;
all lesson audio stays **draft / unreviewed**, not published/approved teaching content. Existing
macOS synthesized-audio redistribution review for a broader public release remains unresolved.

## 好 stroke data

`src/languages/mandarin/data/hao.json`: exact unmodified 好.json from npm `hanzi-writer-data@2.0.1`.
Tarball SHA-1: `09ce12eb1c47d86aeb33313e622f17ba5cbac1ad`.
Source: https://github.com/chanind/hanzi-writer-data (derived from Make Me a Hanzi / Arphic fonts).
Copyright (C) 1999 Arphic Technology Co., Ltd. License: Arphic Public License,
retained verbatim at `public/licenses/ARPHICPL.txt`.
Build B also bundles unmodified 你.json and 我.json from the same pinned package version (see BUILD_B_WRITING_FOUNDATION.md). Hanzi Writer uses the supplied JSON loader, never its default CDN.
Hanzi Writer 3.7.3: MIT, David Chanin; notice at `public/licenses/hanzi-writer-MIT.txt`.

## Icons and worksheet

Small geometric app icons were created for this repository. Worksheet is local HTML/CSS using system
fonts; no external typeface, illustration, QR service or remote asset is required.
