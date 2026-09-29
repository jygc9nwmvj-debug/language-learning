# Product Observation Workflow

Date: 2026-09-28

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
- **Status:** Reproduced and fixed with focused Chrome/WebKit validation; production release authorized by the recording-reliability brief.
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

## 2. CLUSTERS

Group repeated or related observations around an underlying problem. Retain links to the original observations so that differing contexts or contradictory evidence remain visible. Do not create a separate cluster for every symptom, and do not treat a suspected common cause as established fact.

Cluster template:

- **ID / underlying problem or open question:**
- **Related Inbox IDs:**
- **Pattern and differing contexts:**
- **Hypotheses / uncertainties:**
- **Evidence to inspect:** Existing learning data, reproducibility or relevant research.

Recording reliability contains two distinct findings, OBS-2026-09-29-A and -B. A shared cause is not established; the replay repair does not resolve the level report.

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

**Selected and bounded:** OBS-2026-09-29-A replay lifecycle repair, explicitly authorized for production after verification. OBS-2026-09-29-B remains investigation only; no audio-level correction is selected without evidence. After this repair, freeze scope and return to ordinary pilot use.
