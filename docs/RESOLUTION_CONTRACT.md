# Resolution Contract — v0.5

Baseline: `ca959d5` (production `023c6d7`). Scope: existing operations, existing states, learner-facing resolution only. This is not a new task-state machine, assessment policy, scheduler or uniform screen layout.

## Enforced boundary

`src/core/exercises/resolution-contract.ts` declares required base roles and optional enrichment per operation. `Resolution.tsx` renders named slots, rejects unknown roles (including raw evidence, confidence, QA and matching fields), and rejects absent required roles in an existing resolved phase. Existing assistance flags additionally require an explicit assistance slot; it is not optional enrichment. There is no generic children/evidence prop. Existing callbacks, outcomes, saved feedback and phase transitions remain the authority. Compound operations use nested contracts: read → practice/encounter → target; target requires reference and audio in the existing reference container.

This establishes slot presence, not the semantic correctness of arbitrary React content. Reviewed source fingerprints, tests of actual rendered outcomes and the existing text-source review gate enforce the other side of that boundary. Replacing a required slot with an empty fragment would be a violation, not proof of compliance; source changes require renewed review. Neither gate is an NLP proof or a complete visual audit.

Interaction Rules 1–3 already require a compact reference with audio after a text response. Consequently listening/production resolve to their target form and meaning independently of exploration. Successful responses retain their existing Pinyin policy; this is not “show everything after success.” Reading retains its optional speaking/reference flow. Corrections retain the four existing ProductionFeedback cases and local/whole-response comparison.

## Operation contracts

| Operation | Existing resolved states | Required base | Optional enrichment / limits |
| --- | --- | --- | --- |
| Encounter / prerequisite introduction | revealed / connect | introduced reference, reference audio, existing continuation | contextual note/discovery, name slot, chunk exploration, optional recording; earlier focus stages remain gated, no success assessment |
| Listening → meaning | success / attention / error, with existing help flag | own response/result, target form and meaning, reference audio, next; assistance identified | phrase/chunk details, available slow audio; no exploration-dependent base |
| Reading → meaning | same | own response/result/help, existing target/practice reference with audio and next | existing Pinyin reveal and optional speaking; no new listening/production evidence |
| Text production | success / addition / tone / form / whole comparison | own answer and existing diagnostic feedback, target form/meaning, reference audio, next; assistance identified | existing correction Pinyin, available detail audio; no speech assessment |
| Writing | saved app result or paper self-report | own ink (screen) / already displayed comparison model (paper), result, assistance indication, next | optional repeat and existing print; no additional model contour after screen success |
| Screenless recall | revealed | expression/Pinyin, reference audio, explicit self-comparison and existing choices | no automatic correctness/pronunciation assertion; choices advance, no separate new result screen |
| Paper recall | revealed | characters/meanings, comparison instruction, existing self-report/continuation choices | no automatic handwriting judgment or newly introduced audio sequence |
| Tone listening | answered, including compatibility ToneRecall | existing selected answer/audio, correct tone/Pinyin feedback, next | no pronunciation conclusion; three ToneRecall definitions remain unscheduled compatibility |
| Tone notation | checked success/error | existing input/source comparison, feedback, next on success or retry on error | unchanged notation training; no invented “next after error” |
| Recording / imitation | recorded / playback | own playback and retake controls; enclosing operation supplies target reference and continuation | existing capture errors/quiet warning remain actionable recording information, no acoustic score |
| Number sequence | answered success/error | own sequence remains visible, result, correct character/Pinyin order, next | no new sequence audio; existing positions unchanged |
| Mini-Transfer | result | own answer, authored contextual solution, next; conversation replay remains above | optional transcript; internal assessment never rendered, no success/failure claim |

These are ten requested learning-operation families, with tone notation and two self-report variants represented separately; `target` is a composition contract, not a new learning operation. Internal assessment/evidence is neither removed nor rewritten.

## Exhaustive structural population

`qa/resolution/coverage.json` accounts for **131/131 definitions**: 36 encounters, 32 listening, 18 reading, 23 production, 14 writing, one tone lab, three number sequences, three restorable ToneRecall definitions, one closure boundary. The latter four are explicit compatibility/orchestration cases, not 131 independently reachable assessment screens. Prerequisite-introduction replacement is accounted for per applicable definition. Paper/screenless, recording and the four fixed transfer cases are additional renderer families, not invented task IDs.

Each row records operation, existing resolution states, required roles/reference, present optional item/task fields and compound contracts. Source fingerprints cover 17 routing/rendering/schema files. New task assignments, states/optional-field population or changed reviewed renderer sources fail `check:resolution`, invoked by tests and production build. `--list` only enumerates; no approval/update command exists.

### Optional-field influence review

All optional declarations in the current content schema were reviewed by these groups, including their derived rendering fields:

| Fields | Permitted influence on resolution | Finding |
| --- | --- | --- |
| item.exploration, units.characters, derived character notes/writing target/detail audio | segmentation and optional explanatory interaction, never existence of target | **Violation corrected:** listening/production base previously depended on exploration |
| item.slowAudio, word.audio | slow/detail variant if supplied; natural item.audio remains mandatory for text reference | no base suppression; no new audio/assets |
| item.surfaceToneNumbers, exploration.pronunciation | authored contextual Pinyin/detail mapping | no operation/required-role change |
| item.meaning override, punctuation | actual reference/meaning content | no base suppression; authored meanings unchanged |
| item.slot | reference purpose: complete example versus fixed components for own production | **Additional violation corrected:** complete name example had been offered as production reference; see slot audit below |
| item.learning, learning.discovery, introduction.toneNote | optional note/discovery/tone guidance and existing introduction | must not gate base; existing filler suppression retained |
| review and reviewStatus/sources/reviewDate/notes; task.prompt.en | internal QA / currently undisplayed language | not normal resolution output |
| task.itemId/sequence, target, recall, toneIndex, notationPractice, assess | task-specific operation/data/assessment dimensions | already validated task identity, no optional-content-based success behavior; unchanged |

Exploration improperly gated the existence of the base; the supplementary real-world finding identified a separate slot-reference role error. Presence of optional semantic content is not itself an inconsistency.

### Internal-data display review

Reviewed sinks: all JSX families in the bound renderers plus the existing UI text inventory. Transfer `assessment.recognized` count and its matching-limit explanation were displayed and are removed; `state.assessment` is no longer read by that renderer. Saved answer/feedback/help remain intentional learner output. Production interpretation is translated by unchanged ProductionFeedback/displayDiagnosis, not dumped. Writing statistics and recorder metrics remain in events, while actual stroke guidance and actionable recording warnings remain visible. Review metadata, mastery/due data, fingerprints and source-status fields are not added to resolution. DEV controls and unused reports are outside normal learner resolution; unchanged.

## Contract QA

- Runtime slot validation: required roles, optional roles and rejected internal roles for every declared contract.
- Structural inventory: task count/IDs, explicit compatibility/boundary, unknown-kind rejection, stale routing hashes and changed population rejection.
- Seed: both expressions have identical mandatory listening roles across success/error/help; actual DOM includes form, meaning, audio and next, before/after reload.
- Transfer: no assessment access in renderer; own answer/solution/transcript remain; existing P1 tests retain internal `features-only` checks.
- Production grammar: existing inline-feedback regression suite retained.
- Representative rendering: Chrome/WebKit, 320/390/1280; existing interaction, hybrid, P1, production fixtures plus dedicated seed/tone/notation fixtures. Exact run results are recorded below. Source accounting is exhaustive for the defined population, visual coverage is representative.

## Explicit open decision

Re-showing a model contour after successful screen writing is a separate didactic hypothesis, **needs decision**, not implemented. Existing own ink and paper comparison remain. No accepted answers, Mandarin, transfer evidence, scheduler, mastery, interval, audio asset, human review or content-release-gate behavior changed.

## Supplementary slot-reference audit

Population: all 36 normalized items, 131 task definitions, schema slot declarations, name interpolation and reference/audio paths. Exactly **one slot item** (`wojiao`, `name`) occurs in **three definitions**: `meet-wojiao` (introduction), `recall-wojiao` (own production), `tone-jiao` (restorable comprehension compatibility). The screenless renderer also uses fixed-component references, but the current screenless eligibility list does **not** schedule this slot item; this is a renderer-level guard, not a newly enabled learning path. No other personalized slot is declared in the current productive population.

Existing `polly-wojiao` natural/slow audio is a complete example with Wolfram (historical `A2_AUDIO_MANIFEST.json` records the text and SSML with the name; `A2_POLLY_WORKFLOW.md` confirms it). Its asset is retained. The error was its role, not a missing audio-file replacement. Introduction and tone comprehension now explicitly label the complete recording as an example, never a model of the learner's chosen name. Production help/resolution and the guarded screenless renderer use only the **existing fixed component audios** `wo` and `detail-jiao`, individually labelled by their existing forms. This is not stitched sentence audio or new Mandarin content. The open-name instruction remains visible; no example name is supplied as the learner's answer. Phrase-detail contextual replay cannot reintroduce the complete slot example.

`reference-role.ts` distinguishes target / complete example / fixed components by purpose. The reviewed fixed-component mapping must exist for every slot; unknown mappings fail rather than falling back to the complete example. Coverage binds each slot task to its role, fixed component sources and help/resolved/reload paths. Changes to slot population or roles require renewed review. Optional exploration does not select the basic fixed-component reference; current parts are explicitly bound to explicitly mapped existing sources; their pre-existing linguistic review status is unchanged. Accepted open-name answers, assessment, saved preference and audio assets are unchanged.

Regression: every slot has a reviewed, complete fixed-word mapping with no full-example source; a new unreviewed slot fails closed. Real browser tests submit a different name (Eva), cover correct/error/help and reload at 320/390/1280 in Chrome/WebKit, and inspect audio requests for absence of the full Wolfram example in the production reference.

## Release QA — 2026-09-30

- Structural: **131/131** definitions, **17** bound renderer/routing sources, all current optional-field declarations, and **1 slot item / 3 definitions** reviewed. Three tone compatibility definitions and one closure boundary remain explicit exceptions to ordinary assessed task screens.
- Source/text inventory: **67 files / 3,537 entries / 0 unclassified**. Changed expressions and text individually reviewed; ledger hashes are review bindings, not semantic proofs.
- Function tests: **176 passed**, including **17 new** contract/population/slot regressions. Production build and typecheck passed.
- Browser regression population: **116 distinct selected cases** in Chrome/WebKit (100 existing cases plus 16 new contract/slot cases). The final contract run passed 16/16; existing operation regressions passed on the same implementation except the subsequent addition of the explicit example label to the tone-introduction compatibility route, which the final contract run covers. Recording/hybrid screenshots were additionally refreshed against the final build.
- Representative views: all ten operation families; reachable success/error/help and self-report states where applicable; 320/390/1280 px, Chrome/WebKit, reload. Snapshot fixtures for notation do not independently retest its answer evaluator. Representative images manually inspected; this is **not** every item × state × viewport × browser combination.
- Initial failures were stale pre-consolidation test labels/intro steps and, in the slot test, immediate overlapping replay followed by comparison of a transient audio warning across reload. Fixtures now use current controls and wait for real playback completion; no media/assessment workaround added. One overlapping early test run lost its shared preview server; the final runs are sequential.
- Scope comparison with `ca959d5`: Mandarin content, accepted-answer and production diagnostic rules, progress/storage, scheduling, hybrid eligibility, transfer evidence/cases and audio files unchanged. The three recorded P2 findings are untouched. No learner data used for test fixtures.

Production publication is recorded separately in `V05_STATUS.md` after public asset verification.
