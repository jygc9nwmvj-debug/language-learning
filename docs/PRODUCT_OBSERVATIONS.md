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

No observations have been entered yet. Do not reinterpret earlier resolved work as a new open problem without checking its current status.

## 2. CLUSTERS

Group repeated or related observations around an underlying problem. Retain links to the original observations so that differing contexts or contradictory evidence remain visible. Do not create a separate cluster for every symptom, and do not treat a suspected common cause as established fact.

Cluster template:

- **ID / underlying problem or open question:**
- **Related Inbox IDs:**
- **Pattern and differing contexts:**
- **Hypotheses / uncertainties:**
- **Evidence to inspect:** Existing learning data, reproducibility or relevant research.

No clusters yet.

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

No validated problems recorded yet.

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

No build candidates yet.
