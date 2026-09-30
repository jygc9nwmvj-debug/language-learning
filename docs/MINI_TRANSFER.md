# Mini-Transfer in v0.5

Four fixed, versioned listening situations reuse unchanged production items and their natural audio. No generated Mandarin, new vocabulary, new grammar, new audio or changes to the ordinary 131 tasks. The clips retain their original voice; A/B labels identify turns. This tests narrow discourse comprehension, not generalization to new voices or novel sentence grammar.

| Case / revision | Canonical turns | Required context |
| --- | --- | --- |
| name-repeat / 1 | askname → say-again | Link a repeat request to the preceding question about B's name. |
| origin-slower / 1 | nationality → speak-slowly | Link slower delivery to the preceding question about B's country. |
| name-unresolved / 1 | askname → dont-understand | Infer that B's name remains unknown because B did not understand the question. Do not infer refusal. |
| apology-response / 1 | duibuqi → meiguanxi | Connect B's reassuring response to A's apology. |

Each question requires two meaning components. Translating only one line cannot supply both. All sequences are absent from existing item/task definitions. QA here is editorial/computational review of combinations of deployed expressions, not a new independent native-speaker certification.

## Eligibility and dosage

Both turns require explicit meaning/pronunciation introduction and an unassisted successful listening attempt. Optional inspection/practice is excluded. At a normal batch closure, after any existing paper recall, offer at most one unseen eligible case. Require eight ordinary completed tasks since the last offer (or eight total for the first), and at least 24 hours since the previous offer. These are conservative product starting values, not calibrated optimal intervals.

The ordinary planner and session plan remain unchanged. Transfer is additional; completing it leaves the closure cursor in place and the ordinary batch transition runs afterward. It never writes a relation, due date, normal attempt, or normal task-completion event. No general transfer mastery, difficulty or generation engine exists.

## Assessment

Two authored semantic-cue groups per case accept a bounded range of German paraphrases. Correct cue groups produce `complete`; one produces `partial`; none produces `not-demonstrated`. Guards reject uncertainty, selected contradictions and reversed speaker roles. Components, not literal answer-string equality, determine the result. Recognized and missing components are shown explicitly, followed by the solution. Before submission no transcript, Pinyin, translation or solution is rendered. Transcript is optional after submission.

This is conservative deterministic assessment, not unrestricted German semantic understanding. Unsupported paraphrases can be under-recognized. Missing-component feedback explicitly states this limit; `not-demonstrated` does not mean a learner definitely failed to understand. No pronunciation or individual-word competence is inferred. Tests contain full, partial, unrelated, negated, uncertain and role-reversed examples for every case; the fixture is `tests/fixtures/transfer-answers.mjs`.

## Evidence, novelty and recovery

Existing append-only events hold `transfer_seen`, `transfer_assessed`, `transfer_completed`, case ID/revision, first exposure time, outcome, recognized/missing component IDs, uncertainty and manual-test/known-before flags. The active preference `mini-transfer-active-v1` holds the current cursor, response draft and immutable submitted assessment. Existing backups include these tables without a format change.

Seen case IDs are excluded regardless of revision. The prior local one-case experiment excludes name-repeat from fresh production offers. A learner can mark “Dieses Gespräch kenne ich schon”; its result remains stored but is excluded from `firstAppExposure`. First app exposure cannot establish absence of exposure outside this app. Manual dev tests are also excluded. Deleting all learner data or using an unrelated browser loses this local history, as with the rest of the app.

Reload returns to the home screen; Weiterlernen resumes the active transfer, including draft/result, even beyond the ordinary resume window. Submitted assessments are idempotent and cannot be overwritten by delayed draft saves. Completing transfer neither advances nor rewrites the normal plan. The local test control is behind compile-time DEV branches and excluded from production assets.

## Verification

Full content validator, TypeScript, production build and all unit tests pass. Focused tests verify source reuse, prerequisites, novelty, minimum work/cooldown, all answer categories, atomic reservation, draft/result recovery, known-before evidence and unchanged relations/plans/planner output. A separate local production-build origin was tested through the ordinary backup/learning UI with synthetic data: unchanged preceding listening task, additional transfer, audio-only prompt, German paraphrase feedback, optional transcript, reload before/after submission, and continuation into normal recall. Desktop and 320/390 CSS-pixel layouts have no horizontal overflow. No physical-phone test and no real learner outcome are claimed.
