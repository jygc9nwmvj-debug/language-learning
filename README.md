# Mandarin — First contact · V0.1

Private German-language, local-first Lesson-1 vertical slice. No account or cloud services.
Scope: `docs/COMPLEXITY_CUT_v0.1.md`, then `docs/BUILD_HANDOFF_v1.1.md` and
`docs/MANDARIN_APP_MASTER_CURRENT.md`. The old `static-prototype/` is an archived mockup, not the app.

## Run

Node >=22.18 (verified with 24.21.0), npm (verified with 11.19.0).

```sh
npm ci
npm run dev
```

For the actual offline-capable build:

```sh
npm run build
npm run preview -- --host localhost --port 4173
```

Open http://localhost:4173. Wait for “Für offline bereit”. Development mode intentionally does not
register a worker. The build generates a content-addressed worker that precaches all compiled code,
styles, audio and licenses. Deployments must serve at the origin root. Service-worker updates wait
until the old app is closed. Microphone requires localhost or HTTPS.

## What works

- Authored and Zod-validated Lesson 1, Traditional/Simplified; German UI strings use semantic IDs.
- Eight expressions/characters, audio normal/slow, first tone-awareness task.
- Free recall with deterministic Pinyin/number/diacritic normalization. Missing or different written
  tones are distinct from content, and never imply spoken tone ability. Ambiguous typos ask for clarification.
- Only real answers/self-checks update `(object, target)` state. Continue/reveal/recording never imply mastery.
- Simple due-based review, hidden initial recall answers, help logging and at most one spaced retry.
- Hanzi Writer for 好 only, blank recall canvas, equal paper self-check, grouped A4 worksheet.
- Microphone record/play/compare; auto-stop at 15 seconds and cleanup on exit. No automatic speech scoring.
- IndexedDB transactions for state/evidence, resume, export and validated non-destructive backup merge.
- Local research log: task events, help, audio, self-checks, skips, durations and optional reflection.

## Tests

```sh
npm test
npm run test:e2e
```

Browser tests use an installed Google Chrome by default, in a fresh isolated profile. Build first.
They cover the lesson loop, saved evidence, export, denied microphone, pause/resume, phone layout,
print layout and a cold offline reopen with a simulated next-day review.

## Limits before real learning / release

Audio is local macOS TTS **draft**, not language-reviewed or cleared for public redistribution.
See `docs/ASSET_REGISTER_v0.1.md`. There is no automatic tone/pronunciation/free-writing assessment.
Review intervals (1/3/7 days), the six-relation review cap, and 好 as first writing target are hypotheses.
Paper/canvas evidence is labeled self-report; guided practice never proves independent recall.
Browser storage may be evicted: use export. If IndexedDB fails, the app shows an error instead of
pretending progress was saved. Backups include entered display name and voluntary reflection text.

Real iPad Safari + Pencil, actual microphone sound quality, airplane-mode installation, and human
next-day retention still require device testing. Cloudflare deployment and Lesson 2 are not part of
this local implementation. Read `docs/IMPLEMENTATION_STATUS_v0.1.md` before continuing.
