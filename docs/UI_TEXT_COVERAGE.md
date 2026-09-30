# Production UI text inventory — coverage correction

2026-09-30. Baseline `main b3663de`, app `63e35c4`; public worker cache `mandarin-v01-e2a61bde915d0d3d` and `App-Bwd4uSP1.js` confirmed before work. Scope: UI-copy economy, source inventory and coverage process. No Mandarin-content, assessment, scheduler, mastery, transfer-evidence, recording or audio-asset change.

## Why the counterexample survived

At the baseline, `lesson-001.json` supplies `prompt.de = "Hören. Verstehen. Selbst sagen."` to eight `meet-*` encounter definitions. `content/index.ts` merges those definitions with generated buffer tasks. `LessonRunner` rendered `task.prompt.de` in its main heading and `previousTask.prompt.de` in inspection. The other 28 encounters get four generic headings from the same generator. This is a data-backed UI instruction path, not an unknown browser string or a second deployment.

The earlier [interaction report](V05_INTERACTION_RULES.md) claims “Alle produktiven Textquellen geprüft” but supplies a source-family table and representative state tests, no per-prompt inventory/disposition. Its QA records do not establish a deliberate decision to preserve this text. We cannot reconstruct an undocumented mental decision. What is established: the data/generator prompt path rendered the text; the previous process did not require evidence that each prompt was accounted for. Thus the broad completeness claim was unsupported. The earlier reports remain unchanged; this is an explicit correction, not a retrospective upgrade.

## Defined population and counting unit — exhaustive source accounting

Entry points: `/` → `src/main.tsx` → `App` → `LessonRunner`; settings, all currently scheduled learning families, previous-item inspection, error/wait/complete/reload states, optional disclosures and the printable worksheet. Document/share and installed-app naming are included. Restorable legacy `tone-recall` is separately inventoried as compatibility, not claimed as newly scheduled.

The machine envelope is deliberately larger than the reachable UI:

- every file under `src/`, plus `index.html`;
- public `.html`, `.js`, `.css`, `.json`, `.webmanifest` and `.svg` source files;
- TypeScript/TSX/JS string literals, complete templates, JSX text, **every** JSX expression (leaf outputs/attributes and composed conditional/list branches);
- every string value in source JSON and manifest data, including both content files, with its JSON paths;
- CSS `content` values and HTML text/attribute values;
- **131/131 resolved task prompts**, keyed by task ID after the actual generator/schema has run, including **36/36 encounters**.

A source entry is file + source kind + normalized text (task entries additionally include task ID). Repeated identical text in one file/kind is one entry with several locations. A template is one family, not every possible expanded value. Source entries therefore are **not counts of unique sentences**: catalogue value, data source, generated task prompt and consuming expression may each have an entry. Composed rendering branches are reported separately from text entries.

`qa/ui-text/inventory.json` records an explicit scope, function(s), reason and disposition for each entry. Source hashes additionally protect context/routing, imports and reused literals. No heuristic classifier runs during QA. The parser is the pinned Rolldown parser already used by the build toolchain; it parses TypeScript/JSX rather than scanning rendered pixels. `--list` shows exact current source locations; it never approves candidates.

### Exclusions and limits

The larger envelope explicitly separates internal IDs/events/types/selectors, English data not currently displayed, unused catalogue entries, the unused WritingPad/report modules, DEV-only transfer controls and the test harness. Public license pages are supporting documents outside the learning/settings/share UI, enumerated separately and untouched. Eight Hanzi geometry JSON files are hashed as assets; stroke paths are not prose. CSS geometry, browser-native permission/file/print dialogs, library-internal messages and arbitrary user-entered/imported historical strings are not authored UI sentences. User answers/names and stored feedback are accounted for by their display families, not by enumerating possible values. The existing raster share image is outside text-source extraction; no asset review/change is claimed.

`exhaustive` here means complete accounting of the defined current source population. It does **not** mean every task/state/browser combination was rendered or that a program proves each functional judgment correct. New source files, new strings, edited generators, changed output routing or stale decisions fail the contract check. The file hash gate is deliberately conservative: a non-text edit can also require re-review. Supporting sources outside this envelope must be added if they become a productive text path; that is part of reviewing an import/build/entry-point change.

## Functional classification and dynamic families

Allowed functions: `orientation`, `action`, `learning-content`, `feedback`, `necessary-system-information`, `redundant`. Non-display identifiers have no invented learner function. Multi-function composition entries point to their separately classified children.

| Dynamic path | Accounted sources and interpretation |
| --- | --- |
| Phase / task heading | LessonRunner branches, authored prompts, generator literals/templates and each resolved task ID. |
| Catalogue / control props | `de.ts`, callers, shared control names/captions, state-dependent recording/playback labels; accessible labels preserved. |
| Hanzi / Pinyin / meaning | Canonical word/item data, selected script, schema transformations, numbered-Pinyin conversion and render expressions. Language content preserved. |
| Notes / word and character details | Authored prose, reference tokens, glosses, tone notes and discoveries, resolved by `explanationParts` / `phraseUnits`. |
| Introduction | Hear/tone/Hanzi/connect branches and canonical tone labels; all prerequisite gates unchanged. |
| Answers and feedback | Entered/saved value, answerFeedback templates, existing interpretation/diagnosis and legacy fallback; no changed grading or persistence. |
| Writing | Scaffold title/instruction, model introduction, stroke-count/live error/recovery/completion statuses, paper and print families. |
| Tone practice | Example descriptions, heard-count status, quiz/notation output and legacy restored ToneRecall. |
| Sequences | Selected canonical forms, reference form/Pinyin sequence, open/completed feedback. |
| Transfer | Four fixed questions/solutions, speaker labels, own answer, feature counts, evidence disclaimer and optional transcript. |
| System/settings | Loading/offline/storage/import/reset/media failures and recovery, script-lock explanation, first-start action. |

Counts and QA results below are generated/reported against the final reviewed ledger, not inferred from test volume.

## Redundancy corrections

Eleven contextual decisions are recorded in [changes.json](../qa/ui-text/changes.json): **9 removals, 2 condensations**.

- R01–R05: five generic encounter-heading texts/families, affecting 36 task definitions (8 authored, 28 generated). Phase orientation and immediate action stay. The same heading is suppressed in previous-item inspection.
- R06: remove the additional “Lerne den Ausdruck zuerst kennen.” during prerequisite introduction; existing introduction remains fully operative.
- R07: remove only “Ein Zeichen selbst schreiben.” from five generated guided-writing headings; concrete writing/recall meaning cues remain.
- R08: remove duplicate “Mandarin” eyebrow from the start page; “Mandarin lernen”, its introductory explanation and account/storage information remain.
- R09: collapse ready/offline subline into one specific “Funktioniert jetzt auch offline.” status. Wait/failure/retry states retained.
- R10: omit the duplicate paragraph during brief writing preview; existing live status tells the learner the model will disappear. Later writing instruction remains.
- R11: “Hinweise zum Ausdruck” only when actual context exists. An explicit predicate preserves meaningful note, discovery, segmentation or name guidance. Read-completion and empty/filler-only contexts no longer offer an empty disclosure.

The already suppressed filler “Ein kurzer Ausdruck für dein nächstes Gespräch.” is accounted for, not claimed as a new correction. Learning notes about number use, politeness, tone, proper names and response context remain domain content; no automatic shortening. Safety confirmations, source-vs-own recording labels, self-report limits, feature-match limits and accessibility names are intentionally retained.

## Durable process

[Coverage Contract](COVERAGE_CONTRACT.md), linked from repository `AGENTS.md` and README, applies to UI/content/audio/learning logic/human review/releases. `npm run check:ui-text` runs in both `npm test` and production `npm run build`. Human semantic review remains necessary; an automatically updated ledger would defeat the purpose.

## Quantified result

Final ledger: **3,418 / 3,418 source entries classified, 0 unclassified**, across **63 source files** in the defined envelope.

| Disposition / scope | Entries |
| --- | ---: |
| Active production text/output entries | 891 |
| Active production composition/routing families (separate, not extra sentences) | 125 |
| Suppressed sources | 50 |
| Restorable legacy compatibility | 10 |
| Development / test | 130 |
| Unused catalogue/modules and supporting license documents | 158 |
| Internal non-text identifiers/formatting/attributes | 2,054 |
| **Total** | **3,418** |

The **891** active text/output entries comprise 282 data entries, 222 source literals, 102 JSX fragments, 21 template families, 173 leaf display expressions, 86 active resolved task prompts, four HTML metadata/text entries and one CSS disclosure symbol. The other 45 resolved task prompts are 36 suppressed encounters, five suppressed generic writing prompts, three compatibility tasks and one hidden closure prompt.

By primary functional classification, the 891 comprise **372 learning-content, 313 action, 76 feedback, 70 orientation and 60 necessary-system-information**. These are source-accounting categories, not measured learning outcomes. **889 active entries retained, two contextually condensed**; the eleven explicit correction decisions are **nine removals and two condensations**. The 50 suppressed-source records include multiple source/task occurrences of the removed families and two records of the previously suppressed filler. Do not add these quantities as though they were unique sentences.

## QA — representative rendering, exhaustive source accounting

- Inventory: 3,418/3,418 entries; resolved tasks 131/131; explicit classifications and source-context hashes verified. Five inventory tests exercise unclassified additions, source changes/new files, stale removals, literal/template/dynamic-sink extraction, all resolved prompts and unresolved redundancy decisions.
- Functional regression: **159/159** tests passed (the existing 154 plus five inventory checks).
- Browser regression: **134 distinct cases** in Chrome/WebKit selected from text-coverage, interaction-consolidation, inline-feedback, stable-layout, visual-focus, visual-v05, product-ui, p1-audit, hybrid and hosting. Initial run: 130 passed, four failed solely on old `Testversion C` selectors. Hosting expectations updated to the already released Private Lernversion / first-start action; **six hosting cases rerun and passed**, covering the four failures and two already-passing cases. No open failure in this selected set.
- New representative text fixtures at **320 / 390 / 1280 px in both engines**: start/offline, first encounter, prerequisite introduction, short and long known expressions, genuine note/discovery vs empty context, previous-object inspection and correct read completion; all four generated encounter groups and the generic guided-writing heading are represented. The six text cases were rerun after completing those representatives and passed. Existing inline fixtures cover correct/wrong/missing tones, spelling, missing/additional tokens, full mismatch and correct answers. Writing test observes all four stages and confirms a single preview instruction; completed state and optional repeat retained. Accessible control names, no horizontal overflow, reload, existing reduced-motion/focus checks preserved.
- Visual inspection sampled Chrome 320 first encounter, Chrome 390 long phrase/discovery, Chrome 1280 correct read; WebKit 320 pragmatic/politeness note, WebKit 390 home and writing preview. Additional screenshots are local artifacts under `work/text-coverage` and the existing suite directories. This is **representative visual coverage**, not an individual visual review of all 131 definitions.
- Production build, content validation and TypeScript passed. Protected content, answer/assessment, scheduler/progress, transfer cases/evidence and Recorder files have no diff from baseline. Existing media fixtures exercise UI states only; no physical microphone/audio quality/Safari-level claim.

## Publication

Implementation and build are verified locally; publication confirmation follows after the authorized push and public artifact comparison. Production cache expected from this build: `mandarin-v01-a8f4e9494f171775`, app `App-CmQsOYd3.js`.
