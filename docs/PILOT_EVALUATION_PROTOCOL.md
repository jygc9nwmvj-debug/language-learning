# Mandarin pilot: pre-specified evaluation protocol and F-light audit

Date: 2026-09-29 · Version 1 · Status: analysis only, before inspecting learner exports.

## Decision

**No critical production-instrumentation gap was identified for a bounded descriptive review. Continue the pilot.** Existing raw events, together with the current task definitions, support useful answers to all three questions. The stock F-light Markdown report alone is insufficient: the analyst must apply the exclusions, joins, session reconstruction and reporting rules below to its JSON and the original backup. These are analysis requirements, not a request to change the app.

| Core question | Conclusion |
| --- | --- |
| A. What is retrieved after real delays? | **PARTIAL, meaningfully answerable:** task-specific app-checked recognition, listening comprehension, typed expression and tone-notation evidence; bounded digital-writing evidence; separate oral/paper self-reports. Actual retained speaking/pronunciation accuracy is unmeasured. Adequate delayed observations are not guaranteed. |
| B. Is dosage/progression sustainable? | **PARTIAL, descriptively answerable:** introductions, task mix, timed engagement, subsequent retrieval/help and return patterns. Describe the observed trajectory; do not declare an optimal dose or infer sustainability beyond this pilot. |
| C. What does natural learning flow look like? | **PARTIAL, meaningfully answerable:** recorded starts/resumes/voluntary pauses, linked continuous batches, task visits, help, skips and hybrid use. Exact psychological session boundaries, reasons for leaving and all off-screen work remain unknown. |

There are **no learner results in this document**. All validation data were synthetic. No production code, learner state, scheduler, curriculum, UI, instrumentation or deployment was changed. This new documentation file is the only repository change.

## 1. Verified baseline and evidence boundaries

- Repository: [jygc9nwmvj-debug/language-learning](https://github.com/jygc9nwmvj-debug/language-learning).
- A live remote-ref query returned `main = b229877377b664bdc737106f661852445f76eff5`; local `HEAD` and `origin/main` matched. The local checkout is named `recording-reliability`, branch `fix/continuous-boundaries`, but its audited commit is current remote main. Its working tree was clean before this document.
- Production: [language-learning-abk.pages.dev](https://language-learning-abk.pages.dev/). Read-only HTTP checks found `index-CEa50sgD.js` and service-worker cache `mandarin-v01-7924864fc57d5423`. Downloaded live `sw.js` and `App-Z-IRrE4i.js` matched the existing local production artifacts byte-for-byte by SHA-256: respectively `fef17b6dbf825548ad99585a83edc18faa4d6d9585b90933c094c234254ef905` and `df4729cd5cfe83d1f57c2aa7c7a15d03406a9e0dbcf33e6521899579c1efeb62`.
- This verifies the served assets against the existing local build, not which cached version is running in an already-open learner PWA. No learner browser or database was opened. No new production build or deployment was run.
- Current production includes assessment-intent correction `bc0e5c6` and continuous-flow correction `b229877`. Automatic batch transitions replace proactive stopping screens. Historical Build E/F descriptions of those screens do not describe current behavior.
- No Research/Lab implementation was used as production evidence.

Sources read: [Learning Architecture](LEARNING_ARCHITECTURE.md), [Product Observations](PRODUCT_OBSERVATIONS.md), [Research README](research/README.md), [F-light](BUILD_F_LIGHT_OBSERVABILITY.md), [Build E](BUILD_E_HYBRID_PILOT.md), [Assessment Intent](ASSESSMENT_INTENT_AUDIT.md), [Continuous-flow correction](CONTINUOUS_FLOW_CORRECTION.md), and the current implementation linked below.

Keep five categories separate in the final report: external research; architecture/product decisions; real-use observations; measured learner records; hypotheses/inferences. This audit verifies measurement semantics; it does not newly validate the external literature. Earlier pilot data remain earlier evidence, not retrospectively corrected data.

## 2. Audit matrix — central deliverable

“Available” refers to the current raw export plus fixed task definitions, not necessarily an existing report table. “Needed before review” means an analysis requirement or prerequisite, **not** approval to instrument. A critical gap would prevent a meaningful bounded answer to A, B or C. Limitations that narrow an answer without preventing it are explicitly noncritical. All missing capabilities below are nice to have for this pilot; none merits implementation now.

| Research question | Metric / evidence | Current event/field source | Available now? YES / PARTIAL / NO | Reliability / limitation | Needed before pilot review? YES / NO | Minimal fix if required |
| --- | --- | --- | --- | --- | --- | --- |
| A: introduction → later attempt | Item/dimension/script introduction, attempt and timestamps | `introduction_dimensions`: item, dimensions, form, script, toneNumbers, introductionVersion; `tone_attention_confirmed`; `tone_notation_introduced`; report introduction IDs and rows | YES | Acknowledged introduction is exposure, not proven attention; historical introductions may be missing; component reuse is not expanded by F-light | YES | Analysis: require supported prerequisites; show missing baselines. No instrumentation |
| A: meaning/comprehension | Correct/incorrect meaning responses by cue type | `attempt` for `read` → hanzi_recognition; `listen` → listening_comprehension | YES | Accepted-answer checks, not unrestricted semantic understanding; do not merge the two cue types | YES | None |
| A: typed phrase/form retrieval | Result, content, construction, syllables; tone outcome separate | `attempt` on `recall`, `assessToneNotation`, `toneNotation`, `evidence`, `assisted` | YES | A typed known expression, not verified oral production or broad transfer; phrase-form result can succeed with wrong tones | YES | Analysis: retain separate form/tone rows and shared event ID |
| A: independent tone knowledge | Lexical tone-notation retrieval after explicit tone/convention teaching | Report `tone_notation`; raw assessment flags and tone result | PARTIAL | Only assessed tasks; Hanzi answers can leave tone notation unknown; no spoken tone accuracy | YES | Exclude conversion and unknown tone results from resolved outcome counts; preserve unknown denominator |
| A: tone perception | Identify a heard tone | `tone-recall` attempts → tone_perception | YES | Auditory categorization, not lexical-tone recall; Tone Lab attempts are guided practice | YES | Keep separate from tone notation and oral accuracy |
| A: independent digital writing | Completed recall-mode production, assistance, stroke errors/restarts | `attempt`: writingRecall, mode, selfReport, result; `writing_stage_*`, `writing_stroke_error`, `writing_clear`, hints | PARTIAL | Algorithm checks successive strokes with feedback; final success can follow corrections; no holistic first-pass handwriting score | YES | Analysis: add error/restart annotations; no clean-recall claim from final success alone |
| A: oral form and pronunciation | Screenless self-report; recordings as behavior | `screenless_recall`: evidence, pronunciation, result, assisted, revealedBeforeAttempt; `recording_completed_uncertain` | PARTIAL | Oral form is self-reported; pronunciation accuracy unavailable | YES | Keep self-report separate. Objective speaking assessment is noncritical/nice to have; do not add it |
| A: assistance/reveal before response | Unaided, assisted, failed/unsure, direct reveal, unknown | Attempt `assisted`; `pinyin_reveal`, writing help/preview/animation, `previous_object_help`; Screenless revealedBeforeAttempt | YES | Task-specific semantics; regular help often reveals an answer but is recorded as assistance; replay is not automatically help | YES | Join by occurrence and event order; distinguish pre-result help from later comparison |
| A/C: help without an answer | Revealed/helped then skipped or unresolved occurrence | Help events + `skip`, presentation/visit, completion and subsequent lifecycle | PARTIAL | No scored row if no submitted result; lack of result is not failure | YES | Analysis: separate no-result opportunities from submitted attempts |
| A: real delay | Exact milliseconds from supported introduction and previous same-dimension attempt | `at`; report sinceIntroductionMs, sincePreviousRetrievalMs, delayMs, source IDs | YES | Wall clock; report delay ignores other-modality exposure and excludes optional practice; timestamps can tie | YES | Reband raw milliseconds; inspect intervening item exposure; mark ambiguous order |
| A: unrefreshed delay | Was there other recorded practice/reveal between anchor and attempt? | Full item history, audio/help/introduction/attempt/completion, hybrid `items`, inspection/optional events | PARTIAL | In-app exposures observable incompletely; outside study and silent inspection unknown | YES | Annotate known intervening exposure; never equate report delay with absence of study |
| B: new material | First recorded item introductions; first dimension/script introductions | Report introductions + raw earlier history; separate global convention | YES | “First recorded” may not mean first ever; repeated introduction entries are not new items | YES | Deduplicate item/dimension/script; distinguish historical-unknown and component reuse |
| B: new Hanzi/writing targets | Unique item/form recognition introduction; writing introduction/completion | `dimensions=hanzi/writing`, `script`, canonical form; task/content mapping | YES | Whole phrases are not independent knowledge of each component character; active targets and actual practice differ | YES | Report items/forms and writing targets separately; no expansion into mastered characters |
| B: dose/mix | Introductions, genuine retrieval occurrences, guided practice, assistance | `task_presented.role`, introduction events, attempts, task IDs/kinds; activeVisit evidence | YES | Several dimensions per task; raw event-count ratio is misleading | YES | Use occurrence-level counts and dimension-tagged exposure; no optimal ratio |
| B: delayed difficulty and returns | Delayed failures/help, first attempts per bout, exact return gaps | Report rows + raw lifecycle and timestamps | YES | Task difficulty and selection change; repeated attempts dependent | YES | Display item coverage and composition alongside outcomes |
| B: due backlog / reason selected | Snapshot relation dueAt; delivered repeats | Backup relations; plans; raw repeat occurrences; scheduler | PARTIAL | Current due snapshot is available; historical snapshots and reasons are not directly logged; relation states are not mastery | NO | Historical backlog precision is nice to have; omit reconstruction and instrumentation |
| B: different progression speeds | Introduced dimensions, observed retrieval, assistance and exposure by task family | Intro dimensions + mapped rows + visit maxima | PARTIAL | Listening/speaking bundled in some tasks; unequal item pools and assessment opportunities; speaking unscored | YES | Present parallel evidence profiles with coverage; do not rank causal efficacy |
| B/C: active time | Sum visit maxima, time by task family | observabilityVersion=1, activeVisitId, activeTaskMs; `active_time` checkpoints | PARTIAL | Foreground approximation; idle cap; excludes inspection; paper undercount; no clean within-task modality split | YES | Label approximation; attribute a visit once; unknown/mixed task bucket |
| C: natural bouts and session gate | Starts/resumes, linked batches, pauses; active time per reconstructed bout | `session_start/resume/pause`; session_end / learning_continue reason=batch_transition and reciprocal IDs | PARTIAL | Internal IDs are not natural sessions; silent idle/close not fully recorded | YES | Reconstruct bouts per §6; censor uncertain endpoints; no new end event needed |
| C: voluntary stopping / re-entry | Explicit pause and next recorded entry | `session_pause`, `session_start`, `session_resume` | YES | Pause records a voluntary UI exit, not its motivation; abrupt close is unknown | YES | None beyond cautious labels |
| C: continuation / objects per bout | Linked batch transitions, presented/completed item occurrences and unique items | task_presented, task_completed, taskId/index/visit; batch links | YES | Repetition and introductions are not all new objects; do not count closure sentinel | YES | Count occurrences and unique items separately |
| C: skips / incomplete work | Skip, offered-without-result, last unresolved occurrence | `skip`, raw offer/presentation/result/completion sequence | PARTIAL | Cannot infer frustration or permanent abandonment; export can cut off ongoing work | YES | Mark explicit skip, unresolved/censored and later-resumed separately |
| C: replay / retake / repetition | Logged reference plays, recordings started/completed, optional writing/back inspection | audio_replay, slow_audio, attention_audio_replay, attention_slow_audio, recording_*, inspection_*, optional_* | PARTIAL | Some plays are automatic; own-recording replay has no event; counts of recordings do not establish why repeated | NO | Missing replay/retake detail is nice to have; no instrumentation |
| Hybrid: offers/use/defer | Offers, reveal, result, skip; unresolved offer | screenless_offered/revealed/recall; paper_offered/revealed/recall/skipped; Screenless `skip` | YES | Offer is not participation; group paper outcome is not three individual results | YES | Deduplicate occurrence; show offer-to-result linkage and unresolved offers |
| Hybrid: eligible but not offered | Eligibility opportunities | `hybrid.ts`, partial presentation/history and stored plans | PARTIAL | No complete eligibility-decision log; mutable plan snapshots; do not invent an eligibility denominator | NO | Nice to have; use recorded offers as denominator |
| Hybrid: subsequent independent test | Later app-checked item attempt after hybrid exposure | Screenless item / Paper items joined to later attempts with exact time and provenance | YES | May not occur; paper-group uncertainty cannot identify failed character; exposure confounded | YES | Show natural subsequent evidence if present, otherwise none; no causal claim |
| All: app version and historical ambiguity | Field availability and documented change periods | contentVersion, observabilityVersion, assessmentIntent, lifecycle semantics; deployment records | PARTIAL | contentVersion remains build-d-1, observabilityVersion stays 1 through fixes; exact running commit not in each event | YES | Use known release/use context; unknown periods separate. Per-event build fingerprint is nice to have, not implemented |
| All: local data access | Complete local backup and traceable report | exportLearningState; CLI learning-report; event IDs | YES | One browser/origin only; resets or unexported devices can lose coverage | YES | Obtain complete existing export(s), preserve originals, no cloud |

## 3. Primary outcome and unit of analysis

Primary outcome: **a documented retrieval attempt after a real delay, with its item, dimension, cue, provenance, assistance and result preserved**. There is no total learning/retention/efficiency/mastery score.

Use the occurrence key `(sessionId, taskId, detail.index)` where present, joined to `activeVisitId` and presentation events. An occurrence can span reloads/visits; a visit is not a new independent test. Historical records without enough identifiers remain explicitly ambiguous. A task completion without an attempt is not retrieval success: teaching can replace the task because prerequisites were missing.

For primary tables, take the **first scored retrieval attempt for each item/dimension/script in a reconstructed learning bout**. Retain subsequent attempts as a separately labeled within-bout practice table. Do not select the best attempt. Keep all raw IDs and exclude optional inspection/repetition from scored retrieval; they can still be relevant exposure. A single typed attempt may contribute one expression row and one tone-notation row: never add those to a total of independent attempts. Count unique events as well as dimension rows.

Primary rows require supported introduction prerequisites, genuine retrieval phase, known item/dimension and valid timing. App-checked and self-report tables are separate; unknown provenance is a third category. Preserve unknown outcome/support in the displayed denominator; never turn unknown into incorrect or silently drop it. Rows with a known prior-attempt interval but missing introduction go to a supplementary “prior retrieval known; introduction unknown” table, not the primary introduction-to-retrieval table.

Outcomes are mutually exclusive: unaided success; assisted success; failed/unsure (retain the raw distinction); direct reveal without claimed prior attempt where the task supports it; unknown. Failure takes precedence over assisted success. Also show assistance as a separate flag, including on failures. For ordinary read/listen/recall, `pinyin_reveal` exposes the reference but the result is an assisted attempt; do not recode every such success as failure. For Screenless, `revealedBeforeAttempt=true` identifies “Direkt nachgesehen”; the ordinary comparison reveal precedes every self-report and is not itself failure.

Report helped/revealed occurrences with no submitted result separately. “Skipped after help” and “result missing” are not scored failures. Distinguish resolved-attempt denominator from retrieval-opportunity/offer denominator and give both counts where relevant.

### What each dimension actually measures

- **Hanzi recognition:** typed meaning from a visible Hanzi form. The form is a legitimate cue; no inference of independent handwriting.
- **Listening comprehension:** accepted meaning response from reference audio. Replay is legitimate cue use, not automatically assistance. No conversational listening generalization.
- **Written expression retrieval:** typed Mandarin/Pinyin from a semantic prompt; checks known lexical form/construction. It does not validate speaking or novel transfer. `detail.script` on these attempts can mean response encoding (`pinyin`/`hanzi`), because interpretation detail overrides the general script field; do not mistake it for the learner's `hant`/`hans` setting. For visual evidence use the applicable stored session/visit script.
- **Tone notation:** separate assessed item-specific output; omitted/different/unknown preserved. `tone_notation_conversion` is guided conversion from a visible source and is excluded, even when app-checked. Tone Lab's guided perception is also excluded from independent delayed recall.
- **Tone perception:** identify a heard tone; not retrieval of an unseen lexical tone and not pronunciation.
- **Independent digital writing:** `writingRecall=true`, `mode=screen`, app-checked outcome. Use the frozen runtime mode, never infer it from the task ID. Guided modes, even their brief hidden-template stage, are guided production. “Unaided success” means completed without recorded hint/reference assistance, **not necessarily correct on the first stroke attempt**. Join stroke-error, clear, stage-restart and interruption events before the result. Annotate errors/restarts; where the full occurrence cannot be linked, clean-first-pass status is unknown. The final attempt does not carry cumulative stroke-quality detail. Missing result is not handwriting failure.
- **Paper-mode individual writing:** the same task's paper result is self-report, separate from digital checks. Pre-completion opening of the answer-bearing worksheet is recorded assistance in current code; after-completion comparison is not. Earlier records affected by the documented leakage correction cannot be upgraded retrospectively.
- **Screenless spoken-form recall:** the learner reports what was said before reveal; pronunciation remains unknown. Its scheduler relation is `meaning`, but its report dimension is spoken-form self-report. Do not interpret scheduler target as the measured skill.
- **Paper group:** three targets, one group report. “One or more unsure” cannot be allocated to particular characters; success cannot be expanded into three objectively correct writing attempts. `assisted=false` is the app's recorded condition, not verification that no outside reference was used.
- **Hanzi sequence:** group selection/order, not individual handwriting or broad recall. Keep outside primary single-item tables, especially given the documented positional-shortcut ambiguity.
- **Recording:** participation/technical behavior only. No pronunciation correctness, acoustic-quality or speaking-retention outcome.

## 4. Exact delays and exposure history

Retain event timestamps and exact milliseconds. F-light selects the latest supported introduction for every prerequisite; its `introductionAt` is the latest of those prerequisite timestamps. Preserve first recorded introduction as a separate exposure field, all introduction source IDs, latest matching introduction, previous same-dimension retrieval and both raw intervals.

F-light `delayMs` is the smaller available interval since matching introduction or previous same-dimension retrieval. It can be non-null even when introduction is missing. It does **not** reset for every different-modality attempt, optional inspection, reference play or Paper exposure. Label it “time since the recorded same-dimension retrieval/introduction anchor”, never “time without seeing the item”. Prior retrieval may have been assisted or unsuccessful.

Pre-specified display bands, calculated from exact milliseconds:

| Band | Rule |
| --- | --- |
| Short delay | 0 ≤ delay < 24 hours |
| 24-hour scale | 24 ≤ delay < 72 hours |
| 72-hour scale | 72 ≤ delay < 168 hours |
| Longer | delay ≥ 168 hours |
| Unknown | Missing/invalid/ambiguous interval |

Also flag same versus different reconstructed bout; “short” is not synonymous with “in-session”. These bands replace neither scheduler rules nor raw data. Existing F-light bands `<20h`, `20–48h`, `≥48h` must not be relabeled as 24h/72h evidence. Scheduler 20-minute/20-hour thresholds are product parameters, not scientific cutoffs.

For each selected delayed row, inspect intervening recorded exposures to the same item/form, including other-dimensional attempts and feedback, introductions, relevant reference/help, optional inspection/practice and membership in hybrid Paper groups. Retain exposure IDs and elapsed time to the latest such recorded exposure as a supplementary field. Reference audio required as the listening/perception test cue is not an answer reveal or a pre-test refresh; do not reset the retention anchor to that cue. An exposure already used as the anchor is not counted again as intervening exposure.

Present known intervening refresh separately from “no intervening refresh recorded”. Unlogged outside study, OS input assistance, component overlap and already-printed references prevent the latter from proving unexposed retention. Ambiguous event order or exposure content stays unknown. Do not invent a cross-modality “true retention interval”. Browser wall-clock changes, equal-millisecond events and merged multi-device histories require flags; UUID sort order does not establish action order.

## 5. Dosage and multi-speed progression

Count first recorded introductions during the pilot after consulting earlier exported history. Exclude the global notation convention (`item=all`) from vocabulary counts. Separate repeated teaching and historical-unknown introductions. For Hanzi, count introduced item/form targets; a phrase containing several characters is not several independently introduced recognition targets. For writing, distinguish authored active-writing targets from targets actually introduced/practised.

Report introduction-containing, guided-practice and genuine-retrieval **occurrences**, not a ratio of every emitted event. One occurrence can involve more than one phase; mark overlap rather than adding percentages to 100%. Optional practice, assisted work and hybrid exposure receive their own counts. New recorded items per measured active hour is a descriptive rate only; calculate it only with adequate valid timed coverage and identify untimed activity. It is not an efficiency score.

By day and reconstructed bout, show counts of new item/dimension introductions, retrieval opportunities/results, delayed help/failures, active time by task family, and return intervals. Compare the three profiles—listening/spoken activity, Hanzi recognition, active writing—without claiming their assessments or time units are interchangeable. Mixed introduction tasks are not divisible into exact listening/speaking/reading minutes from current data; retain a mixed-introduction bucket.

The unchanged scheduler uses bounded batches, weak recent results to limit new items, due/fragile/consolidation selection, rotating modalities, and a writing slot. Writing-recall availability is narrower than recognition; new guided targets can precede recall. It does not guarantee comparable delayed samples for every dimension. Relations' FRAGILE/STABLE/DURABLE states and 20-hour delayed-success rule are scheduling state, not measured mastery. Current `dueAt` snapshot and delivered repeats may be described, but do not retrospectively reconstruct a precise daily backlog from mutable current relations/plans.

“Sustainable during the observed period” can only describe continued returns and the observed workload/assistance/delayed-retrieval trajectory, with difficulty and exposure changes stated. An absence of returns is not automatically overload. No X-items/hour optimum, success threshold, adaptive recommendation or cross-dimensional efficacy ranking is pre-specified.

## 6. Learning bouts, flow and active time

F-light `sessions` counts distinct **internal session IDs across all input events**, including historical evidence. It is not a count of genuine learning sessions. Session `startedAt`/`updatedAt` and legacy `durationMs`, `responseTimeMs`, `activeMs` are not substitutes for bounded active time.

Reconstruct an operational learning bout as follows:

1. Start at an explicit `session_start` or `session_resume` entry into learning (historical learner continuation can start one too). Require at least one meaningful learning record: introduction, attempt, completed learning task, writing activity or hybrid result; opening the app alone does not count toward the gate.
2. Join automatic `session_end` → `learning_continue` where reason is `batch_transition` and reciprocal next/previous IDs agree. These are persistence boundaries, never voluntary stops. Do not count an invisible closure sentinel as a learning object.
3. End at explicit `session_pause`. A later entry starts another observed bout, including when it reuses the same internal ID. A pause does not itself imply fatigue or dissatisfaction.
4. Without an explicit end, retain a censored endpoint at the last observed evidence. If a fresh entry occurs, close the earlier interval as censored; do not call it a voluntary stop. Reloads/re-entry can split apparent bouts; flag immediate same-occurrence re-entry and exclude ambiguous fragments from the confirmed-session gate count. Report confirmed count plus uncertain fragments.
5. No inactivity-gap threshold defines a “genuine session”. Long silence within an open page is not reconstructable precisely. Show operational foreground engagement and observed entry/pause structure; do not claim uninterrupted attention. Missing lifecycle coverage is an uncertainty, not a fabricated stop.

Use active-time visit maxima to describe each bout's duration, with observed wall-clock span separately. List individual bout durations and median/range once there are at least five confirmed bouts; do not fit a distribution or rank longer/shorter as better. Show unique learning items and task occurrences per bout, batch transitions, explicit stops, next entries, skips and unresolved occurrences. Return intervals use recorded entry minus the preceding observed endpoint; intervals after a censored endpoint are explicitly approximate.

### Timing definition and error

`ActiveTime` uses `performance.now()`. Only foreground, unblocked time within 60 seconds of recent pointer-down, keyboard or input activity accumulates. No keystrokes, text or coordinates are stored for timing. A new task visit resets the timer; checkpoints appear on completion, pause/cleanup, page hide and hidden transition. Sum **maximum `activeTaskMs` per `(sessionId, activeVisitId)`**, never the sum of every event. Map each visit once to its primary learning task; inspection events may carry the current visit ID but a different task ID. Use its non-inspection presentation/checkpoints as the task source, or mark ambiguous.

- Hidden/background time is blocked; foreground return refreshes the activity window. This does not prove the learner engaged again.
- Initial history loading, save operations, identifiable microphone preparation/finalization and non-learning closure are blocked. Audio recording/playback and reading count only inside the activity window. Not every network/audio wait is separately identifiable.
- Previous-object inspection blocks the primary clock, so it undercounts voluntary learning time. Ordinary optional writing can remain in the parent visit; it cannot always be separated into exact time.
- Physical Paper writing and looking away for Screenless can exceed 60 seconds without interaction or happen with a hidden page. **Off-screen effort is undercounted.** Do not turn low measured Paper time into an efficiency claim or extend it by guessing.
- Navigation can restart visits; hard close/crash can lose the last unsaved segment. Checkpoints are asynchronous. The report cannot fully distinguish these losses from inactivity.
- Touching the page can count time without meaningful learning, while long reading/writing can be cut off. Unblocking a state refreshes the activity window. It is an approximation in both directions, not a universal lower bound on cognitive work.
- Concurrent windows can double-count engagement; identify known overlap and do not certify a time gate using ambiguous overlapping histories. No laboratory-grade correction is attempted.
- The recorder's historical `activeMs` can mean audible audio duration. Exclude all legacy `activeMs` from the learning-time total.

No exact subtask-modality timing, full clickstream, own-recording replay log, abandonment-reason field or new session-end event is required for this pilot.

## 7. Hybrid learning

Use actual recorded offers as denominators. Current Screenless/Paper eligibility is in `hybrid.ts`; session-based limits refer to internal batches, with a separate 20-hour offer cooldown. Paper is checked at the internal boundary and completion/deferral leads to automatic continuation; it is no longer intrinsically a voluntary end-of-learning activity.

Per offer, show offered, revealed, self-reported result, explicit skip/defer, and unresolved/censored status. Screenless generic `skip` must be linked to its offered occurrence; there is no dedicated screenless-skipped event. Reveal alone is not proof of attempting the activity. Paper groups remain groups. Individual paper-mode writing is a different activity and is tabulated separately.

Join hybrid item IDs to later naturally occurring app-checked attempts, preserving dimension, assistance, intervening exposure and elapsed time. A later independent attempt can provide separate retrieval evidence; it cannot independently verify the earlier group report or establish that Paper/Screenless caused retention. No extra probes or learner exercises are requested.

## 8. Practical pilot gate and small-count rules

The proposed **7 days + 5 sessions + 120 active minutes** is a practical opportunity gate, not statistical power, efficacy or dose validation. Use an explicitly recorded pilot start/cutoff, at least seven elapsed days (also list local calendar dates in Europe/Berlin), at least five confirmed operational learning bouts under §6, and at least 120 minutes of valid F-light foreground time. Do not satisfy it with internal batch count, pre-pilot history, legacy timers or duplicate overlapping windows. Timing uncertainty is stated; shortfall does not mean ineffective learning. Off-screen activity may make the measured-time gate conservative. Do not lengthen a session just to meet the gate.

Coverage is assessed separately for each dimension **and provenance**:

- **Sufficient for a descriptive delayed profile:** at least 10 primary eligible attempts at ≥24h, covering at least 5 distinct items and 3 confirmed bouts. Repeated rows from one typed event do not create additional independent trials. These are pragmatic reporting rules only.
- A **72h-scale description** additionally needs at least 5 such attempts at ≥72h, covering at least 3 items and 2 bouts. If absent, report “insufficient 72h evidence”; the 24h profile can still be described. Apply the same cell-display discipline to longer intervals.
- For any dimension × band × provenance cell: **0–4 attempts:** list cases and counts, label too little evidence for a rate; **5–9:** show outcome counts, item/bout coverage and label sparse, no percentage; **10+ with ≥5 items and ≥3 bouts:** counts/denominator and cautious descriptive proportions are permitted. Prefer counts throughout; never hide denominator, unknowns or coverage. Two writing attempts remain two cases, not a meaningful-looking success percentage.
- Assistance unknown, result unknown and excluded/missing-introduction records remain visible. They do not count toward the resolved evidence gate. Self-report cannot satisfy an objective-evidence gate. Confirmed short-delay data cannot satisfy the ≥24h gate.

Before looking at outcomes, track the planned supported families: listening comprehension, Hanzi recognition, written expression, independent digital writing, assessed tone notation, and tone perception where naturally delivered. Screenless and individual/group Paper self-report have separate coverage. Do not drop a thin dimension after seeing unfavorable data. Unsupported objective pronunciation is “not measured”, not a failed gate.

At review, report three statuses separately: opportunity gate met/not met/uncertain; coverage status for each dimension; and whether the intended question can be described at the observed delays. A complete multi-speed retention comparison requires adequate evidence in each measured profile being compared; objective speaking comparison remains unavailable. If writing or another important dimension is sparse, conduct a **partial review** and say so explicitly. Continue ordinary use if useful; no guaranteed deadline, forced sessions, new probes or manufactured trials. A week alone does not guarantee enough evidence.

## 9. Pre-specified end-of-pilot report

Use this fixed order; additional unexpected findings are labeled exploratory.

**A. Exposure.** Pilot start/cutoff and calendar span; baseline/change periods and unknown running versions; confirmed bouts and censored fragments; internal batches separately; active foreground minutes and timed coverage; unique first-recorded items and dimension/script introductions; repeated introductions; no fabricated first-ever exposure.

**B. Delayed retrieval.** Separate app-checked, self-report and unknown tables by dimension, script where applicable and exact-delay band. Show unaided success, assisted success, failed/unsure, direct reveal and unknown, submitted-attempt denominator, distinct items and bouts. Add offer/no-result counts, first-attempt selection, excluded-row counts, exact-delay range and intervening-exposure annotations. Include writing error/restart qualifiers. Provide traceable event IDs in the data appendix. Do not sum shared dimension rows.

**C. Dosage.** Daily/bout introduction–guided practice–retrieval mix; first recorded targets; time by primary task family including mixed/unknown; delayed assistance/failure patterns and exact return intervals. Show changing content composition. New items per measured hour only with valid coverage, without an optimality threshold. No historical due-backlog fiction.

**D. Flow.** Bout durations, unique items/occurrences, linked automatic continuation, explicit stops/re-entry, skips, unresolved tasks and recorded help/repeat behavior. Separate observed behavior from inferred friction. Include a few concrete timelines when they clarify ambiguity; no exhaustive clickstream or session quality score.

**E. Hybrid.** Offers, reported participation, reveal, defer/skip and unresolved offers; group versus individual paper; self-report visibly labeled. Later natural independent evidence, if any, remains an association.

**F. Data limitations and sufficiency.** Opportunity gate and each dimension's coverage; missing intervals/introductions/support, history/version ambiguity, tiny dependent sample, selection/difficulty differences, measurement errors, absent oral accuracy, incomplete/off-screen activity, data continuity and export coverage. “Unknown” and “too little evidence” are legitimate conclusions.

**G. Product observations.** Dated bugs/confusion/friction/enjoyment/ideas alongside the data, using Product Observation IDs and concrete context. Keep the reported experience, possible explanation and proposed response distinct. No daily 1–10 questionnaire or new subjective measure is needed. An optional explanation of an unusual recorded episode is qualitative context, not a new effectiveness score.

## 10. Gaps, necessity and causal limits

**Critical production measurement gaps: none identified within this protocol's bounded questions. No production instrumentation change is necessary before continuing.** Required analysis corrections are batch-to-bout reconstruction, primary-row selection, exact-delay rebanding, separate provenance, coverage reporting and intervening-exposure checks. Existing raw data permit these; the stock Markdown is a diagnostic starting point, not the final pilot evaluation.

Noncritical/nice-to-have gaps deliberately left unimplemented: verified oral/pronunciation scoring; individual Paper accuracy; complete eligibility-denominator logs; exact off-screen/inspection/subtask time; own-recording replay/retake-intent logs; reasons for abandonment; historical backlog/selection snapshots; exact running-build fingerprint on every event; automatically expanded component-introduction lineage; exhaustive outside-reference tracking. The matrix describes the available substitutes and limits. Do not build any of these for this pilot.

Small or absent naturally occurring delayed samples are an **evidence sufficiency limitation**, not automatically a missing-instrumentation defect. Discovering corrupt exports or a genuinely untraceable central outcome later would require a separate minimal-gap note and explicit implementation task; this audit does not authorize a fix.

One learner, observational allocation, repeated dependent items, changing difficulty and differing exposure histories cannot identify causal efficacy. A statement such as “recognition outcomes were less often unaided than meaning-from-audio responses among these recorded tasks” must include counts, task mix and uncertainty; it is not a general modality ranking. Do not say Paper caused retention, Screenless caused phrase recall, or the scheduler is optimal. No “app works” verdict, traffic light, mastery percentage or combined efficiency score.

## 11. Exact data handoff and local report workflow

1. After normal learning, use the app's existing **Für jetzt aufhören** when appropriate, then **Einstellungen & Sicherung → Lernstand sichern** in the actual browser/PWA and origin used for learning. Do not reset, reinstall, clear storage or import into production to obtain data.
2. Retain the downloaded `mandarin-YYYY-MM-DD.json` unchanged. It is backup version 2: exportedAt, events, relations, sessions, preferences and preserved legacy tables. The append-only event history is the primary source; latest relations/session plans are only snapshots. The backup can contain personal preference information and historical entered text; provide it privately, not in a public repository.
3. Supply Work with that raw JSON, intended pilot start/cutoff and timezone, which browser/device/origin(s) were used, any known resets/imports/overlapping windows/app updates, and relevant qualitative observations. Unknown context is acceptable. No audio upload is needed; recordings are not the outcome evidence and are not included as media in this export.
4. **One final export is sufficient if all use is in one intact local history.** A baseline export is not required because historical events are retained. Each independent browser/device/origin requires its own export; absent histories cannot be recovered from another browser. For overlapping/imported backups, deduplicate exact event IDs, verify duplicate payload equality, retain provenance and flag conflicts. Do not count copied records twice or merge device timing blindly.
5. Work preserves the raw file outside the public repository, records its checksum/export date, validates IDs/timestamps/coverage, and uses the audited analysis code/content snapshot. Generate the existing local report with Node 24.21.0 (the audited runtime):

   ```sh
   npm run learning-report -- /absolute/private/path/mandarin-YYYY-MM-DD.json --out /absolute/private/path/pilot-f-light
   ```

   Run from the audited repository root. The command reads events and writes `pilot-f-light.md` and `pilot-f-light.json`, locally, with source IDs and restricted file modes for newly created files. It does not alter the app/database or contact a server. The CLI checks event identity/basic structure, not the entire backup's semantic validity; inspect coverage separately. Use a new private output location rather than assuming overwriting changes old permissions.
6. Generate the base report from **full history**, then select primary outcome rows in the pilot window. Do not remove pre-pilot introduction/attempt anchors before derivation. Recompute pilot-only exposure/time/bouts rather than copying the full-history totals. At a boundary crossing within one timed visit, use available cumulative checkpoints or mark uncertain contribution; do not silently allocate the whole visit to the pilot.
7. Apply §§3–9 locally to the raw backup and report JSON. Stock output omits bout reconstruction, skips, many recording/repetition behaviors, new requested time bands and small-count guards. The full export is therefore required; a screenshot or Markdown report alone is insufficient. No production instrumentation or report-code change is needed to collect the data. Any future analysis script should remain local, documented and fixture-validated, with deviations from this protocol declared before interpreting outcomes.
8. Archive the report, raw-data checksum, protocol version, content/code commit used, analysis rules, source IDs and exclusions. Later production changes require a dated protocol amendment and period-specific interpretation; never rewrite historical unknown fields.

## 12. Validation performed — synthetic only

At the audited main snapshot, these existing targeted suites passed **24/24** under Node v24.21.0:

```sh
node --test tests/observability.test.mjs tests/assessment-intent.test.mjs tests/hybrid.test.mjs tests/continuous.test.mjs
```

They exercise bounded timing, visit maxima, provenance, writing mode, tone/lexical separation, source-linked intervals, reintroduction, unknown historical evidence, conversion exclusion, hybrid semantics, scheduler behavior and the local CLI's Markdown/JSON round trip. Historical Meaningful Stop tests still describe retained historical helpers; passing them does not mean the intervention is live.

Four additional in-memory synthetic checks confirmed interpretive limitations: (1) two linked batch IDs can represent one entry/bout; (2) an intervening other-dimensional attempt one hour earlier does not shorten a 49-hour F-light same-dimension interval; (3) help followed by skip adds no retrieval row; (4) a 24-hour previous-attempt interval can coexist with missing introduction evidence. These results validate caution, not learning efficacy. No learner export was inspected, no browser learner state was touched, and no production optimization followed.

### Implementation reference map

- [Event, session and export schemas](../src/core/progress/db.ts); [relation update semantics](../src/core/progress/model.ts).
- [F-light report](../src/core/observability/report.ts); [provenance/help mapping](../src/core/observability/evidence.ts); [bounded clock](../src/core/observability/activeTime.ts); [local CLI](../scripts/learning-report.mjs).
- [Runner lifecycle, timing and outcome emission](../src/app/LessonRunner.tsx); [Continuous Learning scheduler](../src/languages/mandarin/continuous.ts); [hybrid eligibility/evidence](../src/languages/mandarin/hybrid.ts).
- [Introduction prerequisites and presentation roles](../src/languages/mandarin/introduction.ts); [exercise runtime](../src/languages/mandarin/components/Exercise.tsx); [answer semantics](../src/languages/mandarin/answer.ts).
- [Writing events and feedback](../src/languages/mandarin/components/WritingExercise.tsx); [writing stages](../src/languages/mandarin/writing-targets.ts); [hybrid renderers](../src/languages/mandarin/components/HybridRecall.tsx).
- [Product observations](PRODUCT_OBSERVATIONS.md), especially assessment leakage, unresolved microphone level and former session fragmentation. These remain qualitative/technical evidence, separate from measured retention.
