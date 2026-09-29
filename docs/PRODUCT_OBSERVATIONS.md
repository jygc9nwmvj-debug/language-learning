# Product Observation Workflow

Updated: 2026-09-29 · current priorities: [Roadmap](ROADMAP.md)

Real-use observations are evidence to examine, not automatic patch requests. The normal cycle is:

**LEARN → CAPTURE → CLUSTER → MEASURE → RESEARCH → PRIORITIZE → BUILD → FREEZE → LEARN**

Capture during normal learning; review related observations together. Use existing learning data and relevant research where useful. Do not add measurement exercises merely to populate this document. After a focused build, freeze its scope and return to normal use before drawing conclusions.

Immediate interruption is reserved for:

- incorrect language/content;
- incorrect grading;
- data loss/corruption;
- blocked learning flow;
- security/privacy issue;
- severe production bug.

Everything else normally waits for review. One build should normally address one coherent problem cluster. A possible solution in the Inbox is not authorization to implement it.

[LEARNING_ARCHITECTURE.md](LEARNING_ARCHITECTURE.md) remains authoritative for learning-design principles unless explicitly revised. This workflow does not revise those principles or authorize application changes.

## 1. INBOX

Raw observations from normal learning. Preserve what was actually observed, including uncertainty. Keep interpretation and proposed changes separate; neither is required to capture an observation.

Categories: **Learning/Didactics · Content/Language · Audio/Speaking · Writing/Hanzi · Flow/UI · Scheduler · Bug · Infrastructure**

Entry template:

- **ID / date:**
- **OBSERVATION:** What happened or was experienced, without assuming a cause.
- **Context, if known:** Item/task, situation, app version or device where relevant. Unknown is acceptable.
- **Category:** One or more of the categories above.
- **HYPOTHESIS (optional):** Possible explanation; explicitly unconfirmed.
- **POSSIBLE SOLUTION (optional):** An idea to consider, not an implementation instruction.
- **Related observation / cluster (if any):**

### OBS-2026-09-29-A — replay remains active after audible end

- **OBSERVATION:** Repeated real use: own recording finalizes and replays audibly to the end, but playback UI and Continue remain blocked. Manual Pause clears the state.
- **Context:** Safari on MacBook Pro; current F-light pilot. User report, independently reproduced with real MediaRecorder output in automated WebKit against the production baseline.
- **Category:** Audio/Speaking · Bug · Flow/UI.
- **Status:** **DONE / RESOLVED**, deployed in `183c342` and present in verified production baseline `b229877`. Focused Chrome/WebKit validation; microphone-level issue B is separate.
- **Established cause:** WebKit replay can report `ended=true` without dispatching ended/pause and retain `paused=false`; event-only completion leaves the app lock held. Completion now also observes actual ended state on timeupdate, with current-source guards. No duration timeout.
- **Details:** [Recording reliability report](RECORDING_RELIABILITY.md).

### OBS-2026-09-29-B — intermittently very quiet microphone recordings

- **OBSERVATION:** Repeated app recordings through the built-in MacBook Pro microphone can be extremely quiet despite healthy macOS input indication; not identical on every take.
- **Context:** Safari; actual hardware settings and a representative quiet take remain unmeasured.
- **Category:** Audio/Speaking · Bug.
- **Status:** **WATCH / active bug investigation — unresolved.**
- **HYPOTHESIS:** Browser/device processing may differ from the macOS meter. This is not an established cause. Production requests echo cancellation, noise suppression and AGC off; actual hardware settings must be measured.
- **Evidence:** App pipeline has no gain/conversion/normalization stage and uses the same original blob for auto playback/replay. Controlled synthetic measurements test the pipeline and diagnostic only, not physical microphone behavior.
- **Next evidence:** Local input → blob → output diagnostic during a representative affected Safari take. No speculative level change, gain or AGC is shipped.
- **Details:** [Recording reliability report](RECORDING_RELIABILITY.md) and [local diagnostic](../tools/recording-diagnostic/README.md).

### OBS-2026-09-29-C — assessment intent / answer leakage

- **OBSERVATION:** In “Töne mit der Tastatur”, the learner entered `ma4` for “Tippe má mit einer Tonzahl” and received “Tippe ma und direkt dahinter die Zahl 2.” The learner could not tell whether tone knowledge or notation conversion was requested.
- **Category:** Learning/Didactics · Flow/UI · Bug.
- **Established intent:** This step teaches notation conversion; its visible mark is legitimate source information. Conversion previously emitted practice/introduction events, not lexical-tone attempts. The wording and enclosing recall label obscured that distinction.
- **Related clear findings:** Three audio-perception prompts used memory wording; guided-writing/completion presentation roles were mislabeled recall. Paper recall of 好 exposed 好 in its footer and did not classify an opened answer-bearing worksheet as help.
- **Status:** **DONE / RESOLVED**, deployed in `bc0e5c6` and present in verified baseline `b229877`. No historical evidence rewritten; option-ordering editorial review remains open.
- **Principle:** Learner-facing instruction, cognitive task, validator and learning evidence must refer to the same skill. Retrieval withholds its target; a transformation may show its required source.
- **Audit:** [All 131 definitions, classifications, corrections and limits](ASSESSMENT_INTENT_AUDIT.md). Three number-ordering tasks remain editorial REVIEW because predictable option placement may permit a shortcut; no speculative redesign.

### OBS-2026-09-29-D — artificial boundaries fragment motivated learning

- **OBSERVATION:** Repeated real use: proactive stopping feels too early, after only a few interactions. “Runde abgeschlossen” appears when the learner feels they have just started. “Weiterlernen” and “Weiter” make continuation confusing.
- **Category:** Flow/UI · Scheduler.
- **Cluster:** CONTINUOUS LEARNING / SESSION FRAGMENTATION.
- **Decision:** Remove proactive stop and batch-completion interruption during the pilot. Motivated longer sessions continue through the existing scheduler; short sessions remain possible through voluntary exit. The stop heuristic was an unvalidated product hypothesis, not an established optimal duration.
- **Future question — OPEN:** Can a useful stopping opportunity avoid interrupting motivated flow, arbitrary session lengths and claims about an individual's optimal duration? Observe natural use before revisiting; no replacement heuristic now.
- **Status:** **DONE / RESOLVED**, removal deployed in `b229877`; no replacement stop recommendation is implemented.
- **Implementation/verification:** [Continuous-flow correction](CONTINUOUS_FLOW_CORRECTION.md).

### OBS-2026-09-29-E — Natural / careful_slow distinction

- **OBSERVATION:** The learner sometimes perceives Natural and `careful_slow` as barely distinguishable.
- **Category:** Audio/Speaking.
- **Status:** **WATCH**; reported experience, no new acoustic or native assessment.
- **Future QA question:** Evaluate pairs for functional differentiation as well as linguistic correctness: does `careful_slow` offer a genuinely useful listening aid relative to Natural?
- **Possible response:** Human pairwise review and native review; not an instruction to regenerate audio. Existing provisional/human-review flags remain open.

### OBS-2026-09-29-F — Paper Writing physical scaffold

- **OBSERVATION:** Initial physical use favors ~21 mm cells over 28 mm and slightly more immediate production. Earlier delayed-recall prompts lacked confirmed prior Writing introduction. For 好, the transition from visible copying to free recall may be too abrupt.
- **Category:** Writing/Hanzi · Learning/Didactics.
- **Status:** **PHYSICAL VALIDATION / WATCH**; qualitative physical-use report, not measured retention evidence.
- **Prerequisite:** Delayed Writing recall requires prior Writing introduction; recognition or target-list membership is insufficient. Latest isolated sheet omits unqualified recall.
- **HYPOTHESIS:** Earlier Look → Cover → Write → Check cycles may help more than simply adding visible copying. No optimum repetition count or benefit has been established.
- **Scope:** [Paper research](research/paper-writing-v2.md); artifacts remain isolated. No Paper Writing v3 or production integration. Physical practice during the pilot is additional exposure to disclose.

### Continuing editorial / content WATCH

Beginner explanation clarity, digital writing-grid/stroke-number legibility, provisional audio/native review and [C2.3's 15 unsegmented expressions](BUILD_C2_3_PHRASE_COMPREHENSION.md) remain open. These are distinct review questions, not measured learner deficits or automatically selected tasks. Preserve the assessment audit's three number-ordering editorial REVIEW cases.

## 2. CLUSTERS

Group repeated or related observations around an underlying problem. Retain links to the original observations so that differing contexts or contradictory evidence remain visible. Do not create a separate cluster for every symptom, and do not treat a suspected common cause as established fact.

Cluster template:

- **ID / underlying problem or open question:**
- **Related Inbox IDs:**
- **Pattern and differing contexts:**
- **Hypotheses / uncertainties:**
- **Evidence to inspect:** Existing learning data, reproducibility or relevant research.

Recording reliability contains two distinct findings, OBS-2026-09-29-A and -B. A shared cause is not established; the replay repair does not resolve the level report.

**ASSESSMENT INTENT / ANSWER LEAKAGE:** OBS-2026-09-29-C. Align instructional wording and supplied cues with the actual assessed skill and evidence; preserve teaching and distinguish requested assistance.

**CONTINUOUS LEARNING / SESSION FRAGMENTATION:** OBS-2026-09-29-D. Small internal batches and proactive stop suggestions interrupt motivated flow. Current pilot decision removes the intervention; the future usefulness of non-intrusive stopping opportunities remains OPEN.

## 3. VALIDATED PROBLEMS

Move a cluster here only when supported by one or more of:

- repeated real-use observation;
- learning/evaluation data;
- a clear reproducible bug;
- strong external evidence/research.

Record the supporting evidence and its limits. A real usability problem can be validated without proving its cause. A single learner's observational data does not establish a causal learning effect; external research does not automatically validate a specific proposed UI solution.

Validated-problem template:

- **ID / problem statement:**
- **Source cluster / observation IDs:**
- **Supporting evidence:** Dates, reproducible steps, local report/event references or research sources as appropriate.
- **What is established:**
- **What remains uncertain or contradictory:**
- **Priority / reason:** Include whether an immediate-interruption criterion applies.

**OBS-2026-09-29-A:** Reproducible blocked-learning-flow defect, eligible for immediate interruption. WebKit media state/event trace establishes the missing completion signal and retained lock. Focused regression covers real encoded playback and state safety; the exact user's Safari session was not instrumented.

**OBS-2026-09-29-B:** Repeated real-use low-level problem is retained as valid observational evidence. Source of level loss is unvalidated; keep WATCH pending a representative hardware measurement.

**OBS-2026-09-29-C:** Real-use ambiguity plus inspected/reproducible instruction, visible-answer and presentation-provenance mismatches. Conversion itself was not falsely scored as lexical recall. The bounded fix preserves existing assessment gates and progression.

**OBS-2026-09-29-D:** Repeated learner reports establish subjective fragmentation; inspected production code exposes the batch closure and Build E stop heuristic as learner-facing screens. This supports removing the present interruption, not a universal claim about session duration or learning outcomes.

## 4. BUILD CANDIDATES

Only validated problems warranting high priority become possible builds. Validation alone does not require immediate implementation. Compare impact, reach and cost before choosing work; a candidate remains a proposal until explicitly selected.

Candidate template:

- **ID / linked validated problem:**
- **Problem being solved:**
- **Evidence:**
- **Expected learning/product impact:** State expectations as hypotheses where appropriate.
- **Scope/reach:** Affected learners, content or interactions; explicit boundaries.
- **Implementation risk/cost:**
- **Success criterion:** Observable outcome and how it can be judged, preferably through normal use and existing evidence.

One build should normally address one coherent problem cluster. Once completed, freeze the scope, return to learning and capture new observations rather than extending the build opportunistically.

**Completed, no longer a build candidate:** OBS-2026-09-29-A replay lifecycle repair is deployed. OBS-2026-09-29-B remains investigation only; no audio-level correction is selected without evidence. After this repair, freeze scope and return to ordinary pilot use.

**Completed, no longer a build candidate:** OBS-2026-09-29-C assessment-intent and paper-answer leakage fix is deployed, as is D’s continuous-flow correction. Production is frozen except genuine bugs. Sequence-layout questions remain review only. See [roadmap](ROADMAP.md) for WIP limits; no new implementation is selected here.
