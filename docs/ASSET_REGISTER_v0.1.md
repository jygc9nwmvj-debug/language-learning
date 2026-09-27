# Local prototype assets

## Mandarin speech — private development only

All 20 files under `public/audio/mandarin/` were generated locally on 2026-09-27 with the installed
macOS Mandarin voice `Meijia` through `/usr/bin/say`. No cloud request or learner recording was used.

- Phrase/word files: Traditional text in `src/languages/mandarin/content/lesson-001.json`.
- Normal synthesis: 160 words/minute; separate `-slow` synthesis: 110 words/minute.
- Tone samples: 媽, 麻, 馬, 罵 at 130 words/minute; files `ma1.wav` through `ma4.wav`.
- Format: WAV, signed 16-bit little endian.
- No post-hoc playback-rate change or pitch correction.
- Status: **draft / unreviewed**. The slow synthesis is not yet confirmed to be natural careful speech.
- Not a public-release audio source/license approval. Replace or clear redistribution terms and obtain
  Mandarin pronunciation review before publishing these assets.

The app labels these files as unreviewed. Its tone questions exercise UI and awareness; they do not
validate the acoustic quality of the source or the learner's pronunciation. Typed Pinyin never changes
speaking/tone-production state. Recording is ephemeral and local; no microphone samples enter exports.

## 好 stroke data

`src/languages/mandarin/data/hao.json`: exact unmodified 好.json from npm `hanzi-writer-data@2.0.1`.
Tarball SHA-1: `09ce12eb1c47d86aeb33313e622f17ba5cbac1ad`.
Source: https://github.com/chanind/hanzi-writer-data (derived from Make Me a Hanzi / Arphic fonts).
Copyright (C) 1999 Arphic Technology Co., Ltd. License: Arphic Public License,
retained verbatim at `public/licenses/ARPHICPL.txt`.
Only this character is bundled. Hanzi Writer uses the supplied JSON loader, never its default CDN.
Hanzi Writer 3.7.3: MIT, David Chanin; notice at `public/licenses/hanzi-writer-MIT.txt`.

## Icons and worksheet

Small geometric app icons were created for this repository. Worksheet is local HTML/CSS using system
fonts; no external typeface, illustration, QR service or remote asset is required.
