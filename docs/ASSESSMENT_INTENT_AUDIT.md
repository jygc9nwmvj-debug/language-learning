# Pilot correctness fix — assessment intent and answer leakage

2026-09-29. Baseline: freshly fetched production main `183c342`; live worker cache `mandarin-v01-265e39bbbb980410` matches that tested production build. Research/Lab branches excluded. Learning Architecture, Product Observations, current schema, task definitions, introduction gates, renderers and F-light evidence were the basis of this audit.

## Reported task: actual intent

The `tones` task is a bundle: deliberate tone introduction → three assisted tone-perception questions → notation-conversion practice. Its typing step compares against canonical `ma2` and emits `tone_notation_practice`, then `tone_notation_introduced` on success. It never calls the attempt/grading path for conversion. The notation event unlocks only the notation-convention prerequisite; an item-specific tone introduction is still separately required. F-light does not turn conversion events into lexical, perceptual or spoken-tone retrieval rows.

The old “Tippe má mit einer Tonzahl” and “Tippe ma und direkt dahinter die Zahl 2” failed to explain the transformation. The enclosing “Aus dem Gedächtnis” label was also wrong for the teaching/practice bundle. Showing má or the instructional mapping was not itself leakage: that is the conversion's source.

Now the section says **Vom Tonzeichen zur Tonzahl**, displays **má → ma_**, and asks **Schreib denselben Ton jetzt als Zahl.** `ma2` still succeeds; `ma4` receives **Das Tonzeichen in „má“ steht für Ton 2. Schreibe ma2.** Correct feedback connects the same mark to `ma2`. The bundle is labeled **Töne kennenlernen und üben**.

## Small model and invariant

The only new intent declaration is `notationPractice: { intent: 'tone_notation_conversion', sourceWord: 'ma2' }` on the existing Tone Lab task. Source display, expected answer and feedback derive from that canonical word. No new task kinds, scheduler targets, content items or assessment engine.

**An unassisted retrieval task must withhold the information it claims the learner retrieves. A transformation may show its required source; recognition may show the form being recognized. Requested help must remain distinguishable from independent retrieval.**

Deterministic protection is deliberately limited:

- Each task kind must use the assessment target implemented by its renderer: listen→listening, read/sequence→reading, recall→production, writing→writing, tone-recall→perception. Introduction/completion tasks cannot acquire a whole-task assessment target. The Tone Lab's existing inner perception questions remain separate assisted attempts.
- The conversion declaration is mandatory for Tone Lab and must reference one of the four canonical tone examples. It cannot be attached to retrieval/recognition/writing tasks to supply a visible conversion source while claiming another skill. Unsupported intent values fail schema validation.
- Focused UI checks enforce the fixed renderers' answer visibility and the paper-recall footer/worksheet boundary. Hanzi remain visible during recognition; instructional tone examples remain visible during introduction/conversion.
- Free-form German prompts and explanations still need editorial review. These checks do not semantically interpret prose or pretend duplicated-string searches can establish leakage. Adding a new cue renderer requires a matching assessment and visibility check.

## Audit of all 131 production task definitions

Method: canonical generated inventory (including all D tasks), existing kind/target/assessment flags, unique prompt variants, and shared rendering/evidence paths. No manual rewrite of 131 tasks. Counts below classify the baseline definition's normal intended route; missing-prerequisite teaching fallbacks are also retained and their presentation role corrected. “No issue” is limited to this mismatch/leakage class, not a new content certification.

| Task family | Count | Baseline finding |
| --- | ---: | --- |
| encounter | 36 | NO ISSUE: deliberate introduction/connection; forms, meanings and audio are legitimate teaching inputs |
| tones | 1 | CLEAR BUG: ambiguous conversion instruction and recall label/presentation role; not a falsely scored lexical-tone result |
| writing, guided | 8 | CLEAR BUG: `task_presented.role` said recall even for guided writing after visual introduction; actual attempt/F-light writing mode was already guided |
| writing, recall | 6 | 1 CLEAR BUG (`write-recall` for 好): paper-mode footer displayed 好 before response, and opening its answer-bearing worksheet was not marked as assistance; other 5 have no same-class issue in the independent route |
| listen | 32 | NO ISSUE: audio is the cue, meaning withheld until response/help; assistance is recorded |
| read | 18 | NO ISSUE: Hanzi is the necessary recognition source, meaning withheld; word-exploration answers are unavailable before response/help |
| recall | 23 | NO ISSUE: semantic/German cue, Mandarin form withheld; five declared tone-notation checks remain gated by item-specific introduction and notation convention |
| tone-recall | 3 | CLEAR BUG: prompts imply lexical memory while audio is required and the model correctly records perception; wording now asks which tone is heard |
| sequence | 3 | AMBIGUOUS / REVIEW: legitimate Hanzi selection/order task with semantic sequence cue, but fixed reversed button order may permit a positional shortcut |
| closure | 1 | CLEAR BUG: presentation metadata called completion recall; no scored retrieval was actually recorded |
| **Total** | **131** | **14 CLEAR BUG, 3 AMBIGUOUS / REVIEW, 114 NO ISSUE** |

The 14 are **not 14 grading errors**: five involve wording/visible cues; nine are presentation metadata (eight guided-writing definitions plus closure). The three perception task IDs stay unchanged: `tone-wo`, `tone-jiao`, `tone-xie`; their existing `perception` targets and F-light dimensions stay unchanged. The eight guided IDs are `write-guided`, `write-ni`, `write-wo`, `d-write-ren`, `d-write-yi`, `d-write-er`, `d-write-san`, `d-write-shi-number`.

Only clear findings were changed. The three review cases (`d-sequence-123`, `d-sequence-456`, `d-sequence-78910`) remain unchanged pending editorial/product review; their report already identifies group ordering, not independent writing. The visible comparison table in Tone Lab is valid assisted perception practice, not claimed independent tone recall.

## Paper recall correction

For recall of a character shown by the fixed worksheet (currently only `write-recall` for 好 among independent production tasks), omit the answer-bearing footer note. Keep ordinary paper instructions and all guided practice unchanged. Opening that worksheet before completing the attempt records existing `writing_hint` assistance with `source: worksheet`; the subsequent result remains self-reported and assisted. Printing after the learner has declared completion for comparison is not retroactively called assistance. No worksheet, stroke geometry, writing scaffold, content or recognition algorithm changes.

## Evidence and preservation

New conversion events carry `assessmentIntent`, `sourceWord`, `phase: guided_practice`, `evidence: app_checked`, and success/failure for that conversion only. They remain outside scored attempts/relations and outside F-light retrieval rows. Historical events are untouched; old practice events do not acquire invented results. No pronunciation claim is added.

Future task-presentation logs distinguish introduction, practice, recall and completion. Existing writing fallback to guided teaching is logged as practice. Actual scoring, tone gates, curriculum, task IDs/plans, scheduler rules, stored relations and historical report interpretation are unchanged except that newly requested answer-bearing worksheet help is now honestly assisted. Learner progress is preserved; no reset or migration.

## Verification and release

- Normal automated suite ran once: **84/84 passed**, including five new focused schema/provenance tests. Existing tests confirm language trust, introduction gates and scheduling remain intact.
- **Eight focused browser cases passed across Chrome and WebKit**: conversion success/wrong-number feedback/practice-only evidence; all three perception tasks plus representative lexical, meaning and recognition cue boundaries; missing-prerequisite introduction; paper-recall footer and requested worksheet assistance. The final WebKit conversion rerun sorts stored events by timestamp rather than UUID key order. Initial fixture failures were corrected by setting the current planner version and awaiting actual tone-introduction events before advancing; no application gates were weakened.
- Production build/typecheck and standard content validator passed: unchanged 44 words, 36 items, 131 tasks and 76 audio references.
- `git diff --check` passed. No audio acceptance, writing matrix, general UI audit, broad browser regression or manual D-content rereview.
- Deployment is explicitly authorized by the production bugfix brief after these checks. Learner data is not reset or migrated. The print-assistance check covers the in-app print control, not external paper aids or browser-menu activity.
