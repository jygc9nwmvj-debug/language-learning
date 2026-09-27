# Language Learning PWA — Mandarin Vertical Slice v0.1

Repository-ready prototype for an offline-first, account-free language-learning platform.

## What is implemented

- data-driven Lesson 1 runner
- Traditional / Simplified switch
- local progress in IndexedDB (Dexie)
- static local audio assets (prototype quality only)
- microphone capture + local F0/pitch-contour extraction
- basic contour feedback (not a general pronunciation score)
- Mandarin tone lab
- pointer-based writing canvas for pen/finger
- first-class paper mode + print styling
- personalized `我叫 [name]` step
- mini-dialogue + recall
- revisit mode with changed order/scaffolding
- PWA service worker / offline caching
- responsive phone/tablet/desktop UI

## Important prototype limitation

The bundled Mandarin WAV files are **technical placeholder audio generated locally for the prototype**. They are not approved teaching audio and must be replaced before public release with QA-reviewed Mandarin TTS or native-speaker recordings.

Likewise, the pitch analyzer proves local browser processing. Its feedback must be validated before being treated as pedagogically authoritative.

## Run locally

```bash
npm install
npm run dev
```

Microphone APIs normally require `https://` or `localhost`.

## Build

```bash
npm run build
```

## Architecture

Read:
- `docs/V0_1_TECH_SPEC.md`
- `docs/CONTENT_SCHEMA.md`
- `docs/MANDARIN_APP_MASTER.md`
- `docs/LESSON_01_FLOW_v0.1.md`

The core is intended to stay language-agnostic. Mandarin-specific tone/Hanzi logic lives under `src/languages/mandarin`.
