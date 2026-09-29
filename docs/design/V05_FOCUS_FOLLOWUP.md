# v0.5 — focused UI follow-up

Base: deployed `c9893c763c83ffb9f49e7b3f1b3d6d5ee13effdf`. Local working changes only; no deployment.

## System changes

- Existing assessment/phase state drives presentation markers. A saved assessment condenses the question, exact submitted answer and success feedback; the resolved Hanzi take visual priority. Detailed error/partial-answer feedback is retained.
- The global skip action is hidden once that task is assessed, or the writing sequence is saved. It stays available while work remains. Tone Lab is one composite task: answering one quiz question does not complete its remaining questions and notation practice. Optional writing repetition retains its existing explicit Continue action.
- One shared `ContinueButton` supplies the same labeled arrow action in recall, reading, tones, number sequences, speaking and writing. Existing callbacks, disabled conditions and event payloads are unchanged.
- Reference audio is a compact labeled pair, attached to its language object. Normal playback is primary; slow playback is secondary. Whole-phrase audio stays above expanded chunk/character information; chunk audio stays beside its own title. Existing playback/capture code is untouched.
- Starting speaking condenses the reference and folds already-visible contextual explanation into a reopenable disclosure. The reference and recording comparison controls remain available. No undisclosed Pinyin or prerequisite instruction is revealed by this presentation change.
- Opening a chunk reduces the whole phrase to context. Opening a character reduces the chunk title while the selected character becomes dominant. Existing authored notes, navigation, event calls and dismiss behavior remain.
- In Tone Lab, all four examples dominate first. Newly revealed meanings remain visible. Starting the quiz stimulus then folds the example area; it can be reopened. Question, play action and tone choices form one compact unit.
- Notation uses `mǎ → ma3`, then the existing prompted target/input; success shows the actual submitted form plus a check mark. The full convention remains in an accessible help disclosure. Error guidance stays visible; the full success feedback remains available to assistive technology without duplicating it visually.
- Desktop answer areas are capped at 34rem. Existing palette, typography, writing geometry, home/settings and print design remain.

## Deliberate limits

No learning content, assessment, scheduling, mastery, research schema or logging semantics changed. No introductory prerequisite is skipped. Error explanations are not reduced to generic correctness. Reference/own-recording controls remain available for meaningful comparison, including optional practice. The physical MacBook microphone/level issue remains the separate unresolved observation **OBS-2026-09-29-B** in `PRODUCT_OBSERVATIONS.md`; it was not investigated or repaired here.

## Proportional verification

- Production build, content validator and TypeScript: passed.
- Existing relevant unit tests: **18/18 passed** (`assessment-intent`, `attention`, `introduction`, `phrase`).
- Focused Chrome/WebKit checks: **12/12 passed**. Existing notation and phrase/assistance tests plus three UI-focused cases per engine. Existing notation assertions were updated only for the new markup; evidence and assessment assertions remain.
- Covered: unresolved/resolved recall; skip restored on the next object; desktop input width; tone-example/quiz focus and proximity; notation success/error/retry and evidence; 320px layout; traditional/simplified phrase exploration; preserved assistance events; reference controls and one simulated recording-state UI smoke check.
- The recording smoke uses a stub recorder to inspect visible/disabled UI and the explanation disclosure. No real encoder, signal, waveform, level or reliability study, and no broader subsystem regression.
- Screenshots inspected for desktop recall/quiz/notation and narrow phrase/character/speaking states. Whitespace/diff check passed.

Normal use still needs to judge whether the timing of condensation, density of phrase/character context and discoverability of the retained disclosures feel right. No further features or design direction proposed.
