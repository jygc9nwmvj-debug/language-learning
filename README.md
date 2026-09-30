# Mandarin — real learning pilot

**Current status / required maintenance:** [v0.5 central status](docs/V05_STATUS.md) is authoritative for deployed, blocked, deferred and undecided work. Read it before planning changes; update it with date and commit/state after every implemented, deployed or explicitly deferred change. Older reports below remain historical evidence.

Private German-language, local-first Mandarin app. No account or cloud learning service. Production is frozen except genuine bugs; current behavior includes recording replay completion, corrected assessment intent and uninterrupted continuation across internal batches. No automatic pronunciation scorer, English release or Paper Writing v2 integration.

Fresh Work chats: read [Learning Architecture](docs/LEARNING_ARCHITECTURE.md), [Product Observations](docs/PRODUCT_OBSERVATIONS.md), [Roadmap](docs/ROADMAP.md), [research index](docs/research/README.md), relevant research notes and [Pilot Evaluation Protocol](docs/PILOT_EVALUATION_PROTOCOL.md). Main preserves project knowledge; Lab artifacts stay isolated. Historical build reports and `static-prototype/` are not current priorities.

Test deployment: [Mandarin pilot](https://language-learning-abk.pages.dev/). Behavior baseline: `b229877`; served-asset verification and branch inventory are in the roadmap. Existing F-light is sufficient for the bounded pilot; no additional production measurement is required.

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

## Implemented foundation (later scope and corrections in the roadmap)

- Authored and Zod-validated Lesson 1, Traditional/Simplified; German UI strings use semantic IDs.
- Eight foundation items plus 28 Build D objects; 44 canonical words, 36 items, 131 resolved tasks and 76 audio references.
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

## Continuing review limits

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

## Audit / QA coverage

The project-wide [Coverage Contract](docs/COVERAGE_CONTRACT.md) distinguishes exhaustive inventories from representative testing. Production text inventory: `npm run check:ui-text`; see [scope and evidence](docs/UI_TEXT_COVERAGE.md).
