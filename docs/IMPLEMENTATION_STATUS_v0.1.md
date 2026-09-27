# Local V0.1 implementation — 2026-09-27

## Scope

The later Complexity Cut controls implementation breadth. This is one private German Lesson-1
vertical slice, not a universal language-learning engine. `static-prototype/` is retained as history.

## Reproducible environment

Verified against the npm registry's current stable tags on 2026-09-27 and installed with exact versions:
React / React DOM 19.3.0; Vite 8.3.1; @vitejs/plugin-react 6.1.1; TypeScript 7.0.2;
Dexie 4.4.6; Zod 4.6.5; Hanzi Writer 3.7.3.
Node 24.21.0 / npm 11.19.0. Runtime minimum 22.18 for native TypeScript validation scripts.
Vite/plugin Node and peer requirements are compatible; npm reported zero vulnerabilities.
Lockfile is committed; use `npm ci` for reproduction.

Primary references:
- https://vite.dev/guide/
- https://hanziwriter.org/docs.html
- npm registry package metadata, retrieved during install (`npm view`, exact `@latest` resolution).

## Implemented

- Zod content schema and build validation: IDs, references, targets, QA metadata and actual nonempty WAV data.
- Data-driven initial plan and bounded due review. Eight canonical items; no extra curriculum.
- Minimal `(object, target)` state; reading/writing include script, other relations share evidence.
- Transactional attempts + append-only research events, session persistence, storage error UI.
- State backup and validation-before-merge import. Old v1 tables are preserved in exports but their
  automatically awarded "successes" are not converted into learning evidence.
- Deterministic beginner answer interpretation: Hanzi/Pinyin, marks/numbers/missing tones, name slot,
  and explicit clarification for likely typos. No speech evidence from typing.
- Local normal/slow synthesis, explicit development label, playback failure handling.
- Tone awareness/perception exercise, record/play/compare, no pitch scoring.
- 好 Hanzi Writer adapter with local JSON, guided practice, blank recall and paper self-report.
- A4 grouped worksheet and app install icons.
- Build-addressed, complete precache. Cache reads tolerate preview-server `Vary: Origin` for these
  static same-origin files. Install failure does not silently mark offline ready; no worker in dev.

## Deliberate hypotheses and limits

Independent success starts DEVELOPING. Only retrieval in a different session after at least 20 hours
adds delayed success. Two delayed successes yield STABLE, three DURABLE. Due intervals are 1/3/7 days.
A failure, uncertainty or assisted result remains FRAGILE. These are hypotheses, not validated parameters.
Reviews select up to six due relations. Errors repeat at most once with at least two intervening tasks;
otherwise they return in a later session. No novelty budget, full taxonomy or general session optimizer.

Audio is unreviewed local TTS. Naturalness, tones/sandhi and public redistribution approval are pending.
No claim that an exercise completion proves conversational ability. Writing self-reports remain distinct
from automatic recognition. Research export includes the display name and any voluntary reflection;
never raw microphone recordings or strokes. Export is manual; nothing uploads automatically.

## Verification

- Production build, content/audio validator and TypeScript pass.
- Six automated domain/storage tests: normalization, independent delayed evidence, due/script review,
  reference/QA validation, export/import and zero-length WAV rejection.
- Complete real Chrome flow: Lesson 1, evidence, export, close, offline cold reopen and simulated day-3 recall.
- Chrome phone viewport 390 × 844, denied microphone, pause/resume; no horizontal overflow.
- A4 print output inspected; one page.
- Record/replay and leaving with a live microphone tested with Chrome's synthetic input.

## Not yet verified / next human test

1. iPad Safari + Apple Pencil and iPhone Safari, then Android/desktop Safari/Firefox.
2. Actual microphone sound quality and browser permission behavior on those devices.
3. Real installed-PWA airplane mode (automated offline simulation is not a substitute).
4. Mandarin audio review and genuinely next-day recall using `LESSON_01_TEST_PROTOCOL_v0.1.md`.
5. Deploy to HTTPS only after selecting suitable audio for the intended audience.

No Cloudflare setup, push, public release, Lesson 2, accounts, FSRS, OCR or runtime AI were added.
