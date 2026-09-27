# Mandarin — First contact · Build A1

Private German-language, local-first Lesson-1 vertical slice. No account or cloud learning services.
Scope: `docs/COMPLEXITY_CUT_v0.1.md`, then `docs/BUILD_HANDOFF_v1.1.md` and
`docs/MANDARIN_APP_MASTER_CURRENT.md`. The old `static-prototype/` is an archived mockup, not the app.

Test deployment: https://language-learning-abk.pages.dev/ . Current build: **A1 — Language Trust**.
[Build A1 report](docs/BUILD_A1_LANGUAGE_TRUST.md) covers root-cause evidence, canonical content,
validation, tests and limits. Earlier writing/audio repairs remain; Lesson 2 and Build A2 are untouched.

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
styles, audio and licenses. Deployments must serve at the origin root. Service-worker updates activate after complete precaching, even with old tabs open. Reload to display
the downloaded update; active exercises are never reloaded automatically. One prior asset bundle is retained. Microphone requires localhost or HTTPS.

## What works

- Authored and Zod-validated Lesson 1, Traditional/Simplified; German UI strings use semantic IDs.
- Eight expressions/characters, audio normal/slow, tone introduction plus three spaced tone retrievals.
- Free recall with deterministic Pinyin/number/diacritic normalization. Missing or different written
  tones are distinct from content, and never imply spoken tone ability. Ambiguous typos ask for clarification.
- Only real answers/self-checks update `(object, target)` state. Continue/reveal/recording never imply mastery.
- Simple due-based review, hidden initial recall answers, help logging and at most one spaced retry.
- Hanzi Writer for 好 only: observe, three fading productions, brief blank recall, later and next-session recall.
  Per-stage errors/hints/results in the research log; free writing and paper remain self-report. Grouped A4 worksheet.
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

The licensed spoken four-tone demo and separately synthesized natural/slow phrases are **draft**,
not independently language-reviewed. Broader redistribution of macOS-generated speech still needs review.
See `docs/ASSET_REGISTER_v0.1.md`. There is no automatic tone/pronunciation/free-writing assessment.
Review intervals (1/3/7 days), the six-relation review cap, and 好 as first writing target are hypotheses.
Paper/canvas evidence is labeled self-report; guided practice never proves independent recall.
Browser storage may be evicted: use export. If IndexedDB fails, the app shows an error instead of
pretending progress was saved. Backups include entered display name and voluntary reflection text.

Real iPad Safari + Pencil, actual microphone sound quality, airplane-mode installation, and human
next-day retention still require device testing. Cloudflare Pages auto-deploys the main branch; see `docs/DEPLOY_CLOUDFLARE.md`. Read
`docs/RETEST_v0.1.2.md` before continuing. Do not implement Lesson 2 yet.
