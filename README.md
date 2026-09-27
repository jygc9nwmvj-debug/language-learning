# Mandarin — Continuous learning · Build D

Private German-language, local-first Lesson-1 vertical slice. No account or cloud learning services.
Scope: `docs/COMPLEXITY_CUT_v0.1.md`, then `docs/BUILD_HANDOFF_v1.1.md` and
`docs/MANDARIN_APP_MASTER_CURRENT.md`. The old `static-prototype/` is an archived mockup, not the app.

Test deployment: https://language-learning-abk.pages.dev/ . Current build: **D — Continuous Learning**.
[Build D report](docs/BUILD_D_CONTINUOUS_LEARNING.md): 28 new objects, small multi-session planner,
76 Polly-only references and five selective writing targets.
[Build C report](docs/BUILD_C_INTERACTION_FLOW.md) covers progressive speaking/reading, atomic transitions,
automatic own-recording playback and verified offline readiness.
[Build B report](docs/BUILD_B_WRITING_FOUNDATION.md) documents the short 好 → 你 → 我 progression,
honest SVG ink, established patterns, recognition limits and internal tests.
A1 Language Trust and A2 Audio Trust remain in place. Lesson 2 is untouched.

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

Open http://localhost:4173. Wait for “Bereit zum Lernen”. Development mode intentionally does not
register a worker. The build generates a content-addressed worker that precaches all compiled code,
styles, audio and licenses. Deployments must serve at the origin root. Service-worker updates activate after complete precaching, even with old tabs open. Reload to display
the downloaded update; active exercises are never reloaded automatically. One prior asset bundle is retained. Microphone requires localhost or HTTPS.

## What works

- Authored and Zod-validated Lesson 1, Traditional/Simplified; German UI strings use semantic IDs.
- Eight expressions/characters, audio normal/slow, tone introduction plus three spaced tone retrievals.
- Free recall with deterministic Pinyin/number/diacritic normalization. Missing or different written
  tones are distinct from content, and never imply spoken tone ability. Ambiguous typos ask for clarification.
- Only real answers/self-checks update `(object, target)` state. Continue/reveal/recording never imply mastery.
- Simple due-based review, hidden initial recall answers, help logging and at most one spaced retry.
- Hanzi Writer for 好 / 你 / 我: slower demonstration, four/three fading productions, brief blank recall.
  Actual SVG handwriting stays visible; immediate stroke feedback and automatic stage transitions.
  Later and next-session recall for 好; per-stage errors/hints/help in the existing event log.
  Paper remains self-report, with the existing A4 worksheet.
- Microphone record/play/compare; ready/finalizing states, up to 60 seconds, interruption notices and cleanup on exit. No automatic speech scoring.
- IndexedDB transactions for state/evidence, resume, export and validated non-destructive backup merge.
- Local research log: task events, help, audio, self-checks, skips, durations and optional reflection.

## Tests

```sh
npm run validate-content
npm test
npx playwright install webkit
npm run test:e2e
```

Browser tests use installed Google Chrome and Playwright WebKit, in fresh isolated profiles. Build first.
They cover the lesson loop, saved evidence, export, denied microphone, pause/resume, phone layout,
print layout, a cold offline reopen with a simulated next-day review, a 10-take capture continuity series
per engine, interruption/pending-permission cleanup and controlled Hanzi Writer pointer tests.

## Limits before real learning / release

Audio provenance and the remaining human-review flags are documented in `docs/A2_POLLY_WORKFLOW.md`
and the A2 manifest. Build B does not modify audio assets. There is no automatic speech scoring.
Writing recognition is Hanzi Writer's expected-stroke check, not OCR, a beauty score or proof of retention.
Four/three immediate productions and the existing review intervals are test hypotheses.
Paper evidence is self-report; guided practice never proves independent recall.
Browser storage may be evicted: use export. If IndexedDB fails, the app shows an error instead of
pretending progress was saved. Backups include entered display name and voluntary reflection text.

Real iPad Safari + Pencil, actual microphone sound quality, airplane-mode installation, and human
next-day retention still require device testing. Cloudflare Pages auto-deploys the main branch; see `docs/DEPLOY_CLOUDFLARE.md`. Read
`docs/BUILD_B_WRITING_FOUNDATION.md` for the current writing behavior. Do not implement Lesson 2 yet.
