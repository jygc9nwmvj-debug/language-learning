# First active retrieval priority — 2026-10-01

Basis: `main` `40273a3`, deployed application `920c42b`. Before editing, the public service worker matched that deployment (`aa73726790b9b08d88d8cdbd202ebfcbf00c55cc19d2334ee68558a111536a53`). The planner is byte-identical between this basis and the original simulation basis `1fdf425`.

## Rule and boundary

A shared selection pass in `continuous.ts` promotes waiting first retrievals when their projected position reaches the seven-regular-task window. Older pending introductions rank first. This is a preference: existing selected failure/help repairs come first, prerequisites and assessment gates remain, and short item repetition is avoided. Insertion shifts subsequent encounters together before the existing seven-task truncation, preserving their prerequisite order. There is no open-item cap or fixed new/review ratio.

The rule derives pending status from existing events. Introduction is an encounter completion or explicit meaning introduction. Age counts subsequent completed or skipped regular tasks; the introducing task, closure, optional/inspection actions and transfer events do not count. Opening an unrevealed item does not introduce it. Neither audio replay nor repeated introduction resets the age.

An existing successful unassisted `attempt`/`screenless_recall` on a task with an assessment target ends this priority. Guided writing explicitly does not qualify, even for historical success events marked unassisted. As in the simulation, the current target-bearing reading/listening tasks qualify alongside production and free writing; this does not reclassify recognition as production mastery. Screenless success retains its existing self-report meaning, not verified spoken correctness.

Failed/helped objects remain with the existing repair selection rather than receiving additional repair slots from this rule. Guided practice is the exception to this exclusion because its assistance is not a failed active retrieval. Existing retry insertion is unchanged. Promotion requires two intervening regular tasks for the item. Existing saved batches/cursors remain resumable; subsequent composition reconstructs priority from history. No migration or second persisted state.

## Representative verification

Population: the changed continuous-planner selection and its direct evidence/spacing/persistence dependencies. Excludes browser rendering, content quality, audio/recording and wider product regression. This is representative behavioral coverage, not exhaustive learning-effect or state-space proof.

- Eight new focused cases cover aged/oldest-first preference; admission beyond the old three-review quota; failure and help precedence plus unchanged two-intervening-task retry; termination only on successful independent active evidence; guided-assistance eligibility; completed/skipped counting with excluded events; item spacing/prerequisite order; database close/reopen and retained saved cursor.
- 96 focused tests passed across `first-retrieval`, `continuous`, `learning`, `introduction`, `phrase`, `hybrid`, and `mini-transfer` suites. Existing all-36-objects advancement assertion retained; its deterministic successful scenario now runs 20 rather than 16 batches to allow the intentionally earlier retrieval allocation.
- Production build/typecheck, content validation, resolution contract and UI-text contract passed. The only UI inventory change is the reviewed source hash for `continuous.ts`: no added, removed or changed text candidates or display routes.

## Small post-simulation

Reproducible: `node scripts/first-retrieval-simulation.mjs`. Loads the real baseline planner from Git `40273a3` and the real current planner, with no simulated selection overlay. 50 paired seeds per profile per planner, 120 regular tasks each. The same profile-specific seed is used across variants. Probabilities and timing follow the previous simulation: safe 93/2/5%, mixed 50/25/25%, weak 5/20/75% independent-success/help/failure; one minute per task, 30 minutes between batches, one day after every fourth batch. Guided practice is assisted, and existing retry insertion and relation updates execute normally.

Each number below is the mean of the 50 run-level metrics at 120 tasks. Delay median/p90 include only objects actually reaching a first attempt. Within-seven uses all introduced objects, including recent not-yet-observed ones; it is not a censoring-adjusted probability. No empirical human-learning claim.

| Profile | First-attempt delay median, baseline → new | p90, baseline → new | Introduced objects attempted within seven | First-attempted objects | New objects | Same item within previous two tasks |
|---|---:|---:|---:|---:|---:|---:|
| Safe | 15.32 → 3.97 | 32.63 → 5.06 | 8.8% → 94.9% | 14.44 → 34.12 | 36.00 → 35.88 | 1.4% → 0.1% |
| Mixed | 11.16 → 5.87 | 34.28 → 9.15 | 12.3% → 70.1% | 8.78 → 20.86 | 25.22 → 21.84 | 1.3% → 0.5% |
| Weak | 8.75 → 11.31 | 42.05 → 16.53 | 15.5% → 21.9% | 5.52 → 13.70 | 19.34 → 14.88 | 0.9% → 0.8% |

The seven-task effect is present for safe/mixed profiles, without increased short repetition. It is not a seven-task guarantee: weak learners remain dominated by failure/help, and their observed median is worse even though far more objects receive a first attempt and the long tail is much shorter. This is not an exact numerical reproduction of the earlier window overlay (which stopped promotion after the first attempt and used different selection mechanics). It is the outcome of the production rule with its safeguards. No cap or ratio was added to force agreement.

Unchanged: content, UI, audio, accepted answers, assessment/mastery semantics, interval calculation, transfer evidence, `DOSING`, retry insertion/distance, database and logging. Only planner selection and its tests/documentation changed.

## Bounded weak-profile comparability audit — 2026-10-01

No application/code change or deployment. Re-examined the original simulation and repeated only the existing 50 weak-profile seeds, with three planners: baseline `40273a3`, that baseline plus the original `windowPlan(...,7,...)` overlay, and deployed selection `a72797e`. Baseline planner source is unchanged from the original `1fdf425`. Temporary diagnostic artifacts used for this bounded comparison were not retained; repository simulation source remained unchanged.

Definitions match: first target-bearing attempt per introduced item, excluding guided writing, regardless of that attempt's success or assistance. This statistic is NOT first successful independent retrieval. Production priority termination is separately based on successful independent evidence. Both reported medians were means of run-level medians, not pooled medians. Original run count was 1,000 with variant-dependent seed offsets; implementation follow-up used 50 paired seeds. In this bounded comparison all three use the exact same 50 seeds. The original overlay's 5.76 is reproduced as 5.82, so sampling is not the main explanation.

Conditions match: 5% independent success, 20% help, 75% failure; 120 regular tasks; one minute/task; 30 minutes between batches, one day after every fourth; identical relation updates and `withSpacedRetry`. Same RNG stream by attempt ordinal, not a guaranteed same outcome for each item after schedules diverge. Retry *function* is identical, but actual insertions and resulting batch lengths differ with the chosen plan. No optional/transfer actions are simulated.

| All observed first attempts, 50 runs | Baseline | Original 7-overlay | Production |
|---|---:|---:|---:|
| Introduced seed-item pairs | 967 | 855 | 744 |
| Reached first attempts | 276 | 308 | 685 |
| Mean per-run count | 5.52 | 6.16 | 13.70 |
| Mean run median | 8.75 | 5.82 | 11.31 |
| Pooled median | 7 | 6 | 11 |

The common introduced population across all three contains 744 seed-item pairs. Of those, 276 / 299 / 685 respectively reach a first attempt; missing outcomes are censored at task 120, not treated as zero or silently timed. Hence the original summary columns compare different observed cohorts.

For exactly the same 237 seed-item pairs reaching a first attempt in **all three**:

| Pooled observed delay | Baseline | Original 7-overlay | Production |
|---|---:|---:|---:|
| P50 | 7 | 6 | 7 |
| P90 | 26 | 10 | 15 |
| Actual maximum | 103 | 87 | 15 |

Additional pairwise check, without the third-arm restriction: all 276 baseline-observed pairs are also observed in production. P50 7 → 7, P90 68 → 15, maximum 106 → 17. Production is faster for 92, equal for 184, slower for zero. The additional 409 production first attempts lift its own-cohort median; they were missing from baseline's delay distribution. This establishes the cohort explanation for the rise relative to baseline, not a general proof for censored or unseen objects.

There is ALSO a real behavioral difference versus the original overlay. On their 292 jointly observed pairs, overlay → production is P50 6 → 7, P90 10 → 15, max 87 → 20 (11 faster, 158 equal, 123 slower). The overlay protects only the leading contiguous repair block; later interleaved repairs can be overtaken. Production puts all already-selected, spacing-eligible repairs before pending first retrievals. The overlay can only replace an eligible encounter when inserting an absent first retrieval; production can admit multiple waiting candidates and shifts/truncates the remaining encounter queue. Production also enforces cross-batch spacing and existing task eligibility/rotation instead of selecting the first unfiltered modality. Its pending state closes on success; the overlay stops special promotion after any first attempt. These are genuinely different selection policies, not equivalent implementations measured differently.

Concrete paired trace, seed 776: `wojiao` introduced at task 8. Overlay first retrieval at 15 (lag 7); production at 20 (lag 12). In that batch production moves the already-selected `read-wo` repair to task 15 ahead of `recall-wojiao`; unchanged retry insertion then places intervening repairs at 17–19. The overlay leaves `read-wo` until 21. The different repair precedence is already visible before the paths diverge further.

Conclusion: the baseline median increase is explained by broader retrieval coverage; the earlier claimed reproduction of the original weak-profile seven-window behavior is too strong. Production materially differs from that overlay, particularly in repair precedence and admission of waiting objects. This is consistent with prioritizing repairs, but is not merely a metric artifact. No repair, tuning, new rule or deployment resulted from this audit.
