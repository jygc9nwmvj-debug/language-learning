# Adaptive Learning Engine v0.1

**Status:** BUILD SPEC / HYPOTHESIS WHERE MARKED  
**Goal:** Controlled curriculum, individualized pace.

The engine does not invent what a learner should learn. The curriculum defines objectives and prerequisites. The adaptive engine decides **when, how, and with how much support** known material should reappear.

---

## 1. Evidence constraints

### Spacing
Use distributed review. Longer spacing generally improves delayed retention, but no single expanding-interval schedule is universally optimal.

**Consequence:** Schedule future retrieval; do not hard-code a fashionable interval sequence as scientific truth.

### Retrieval + feedback
Successful unaided retrieval is a strong learning signal. Retrieval should normally receive corrective feedback.

**Consequence:** An unassisted correct response counts more than recognition or assisted success.

### Delayed performance matters more than immediate repetition
Three correct answers in one sitting are weaker evidence of durable learning than a correct answer after a delay.

**Consequence:** Evidence is weighted by elapsed time and session separation.

### Difficulty should be diagnostic, not punitive
One error is noisy evidence.

**Consequence:** A single mistake does not reset mastery or block progression.

---

## 2. Unit of adaptation

Progress is not stored only per lesson or word.

For each learning item, track relevant dimensions separately:

- meaning
- listening
- speaking
- reading
- writing
- usage

Example:

`好`
- meaning: strong
- listening: strong
- speaking/tone: shaky
- reading: strong
- writing: developing

The engine therefore reviews **the weak relation**, not necessarily the whole item.

---

## 3. Observable evidence

V0.1 uses only a small set of signals:

### Required
- correct / incorrect
- assistance level
- session/date
- number of attempts
- skill dimension
- exercise direction

### Optional but useful
- response time, only as weak secondary evidence
- pronunciation diagnostic (e.g. tone contour mismatch)
- writing diagnostic (guided vs free; coarse stroke issue)

Do not collect biometric or behavioral data that is not needed for learning.

---

## 4. Assistance levels

Every attempt is classified:

0. **Independent recall** — no answer-bearing help
1. **Light cue** — e.g. Hanzi shown but Pinyin hidden, or first structural cue
2. **Strong cue** — Pinyin / partial answer / guided stroke scaffold
3. **Reveal / imitation** — answer visible or learner repeats/copies

Success at level 0 is strongest evidence.
Success at level 3 means exposure/practice, not mastery.

---

## 5. Mastery representation

V0.1 should avoid fake precision.

Internally use two related values per item-skill:

### A. Stability band
- NEW
- FRAGILE
- DEVELOPING
- STABLE
- DURABLE

### B. Due state
- not_due
- due_soon
- due
- overdue

The UI need not expose these labels.

### Transition intuition

**NEW → FRAGILE**
after first meaningful successful interaction.

**FRAGILE → DEVELOPING**
after at least one independent success, ideally separated from initial exposure.

**DEVELOPING → STABLE**
after repeated independent success across sessions / meaningful delays.

**STABLE → DURABLE**
after successful delayed retrieval over longer intervals and/or successful use in varied contexts.

A failed attempt usually lowers confidence within/between adjacent bands, not back to NEW.

---

## 6. Evidence weighting

Conceptual weights for V0.1:

- immediate copied success: very weak
- recognition success: weak
- independent recall in same session: medium
- independent recall in later session: strong
- successful production in a new context: strong
- successful delayed production: very strong

Incorrect responses:
- first error: diagnostic
- repeated independent errors across sessions: strong evidence that review is needed

**HYPOTHESIS:** Exact numeric weights should be tuned from usage; do not pretend they are established scientific constants.

---

## 7. Review scheduling

Initial transparent heuristic:

### NEW / FRAGILE
Review:
- later in the same session once
- next session / roughly next day

### DEVELOPING
Review:
- after a few days
- then roughly one week if independently successful

### STABLE
Review:
- after one to several weeks

### DURABLE
Review:
- infrequently
- preferentially embedded in natural new contexts instead of isolated drilling

Intervals stretch after delayed independent success and shrink after repeated failure.

**Important:** Review opportunities embedded in new lessons count as review.

---

## 8. Session composition

A session has three pools:

1. **Due review**
2. **Current curriculum**
3. **Fluency / transfer**

Default target for a normally progressing learner:

- 25–35% due/recent review
- 50–60% current/new material
- 10–20% fluency/transfer

These are **product starting values, not scientific constants**.

### If learner is struggling
Do not simply stop all new content.

Possible session:
- 50–60% targeted review
- 25–35% new material
- 10–20% transfer

### If learner is moving quickly
Possible session:
- 15–25% review
- 60–70% new material
- 10–20% transfer

The engine adjusts within bounded ranges. It never turns a lesson into endless remediation.

---

## 9. New-content gate

New material is normally allowed when:
- prerequisites are at least DEVELOPING in the skill dimensions required by the new task,
- there is no severe backlog of overdue foundational material,
- the learner has not shown repeated failure on a prerequisite relation.

But:
- one bad attempt never blocks progression,
- writing weakness does not block a listening objective unless writing is genuinely prerequisite,
- tone weakness may trigger extra tone practice without blocking unrelated reading progress.

This prevents a single weak modality from freezing the whole course.

---

## 10. Scaffolding adaptation

The engine adjusts not only *what* appears but *how*.

### FRAGILE
- audio replay easy to access
- Pinyin/translation available
- guided writing
- shorter prompts

### DEVELOPING
- hide answer-bearing help initially
- allow optional reveal
- more audio-first / meaning-first retrieval

### STABLE
- default to independent recall
- less Pinyin
- varied speaker/context
- combine with newer material

### DURABLE
- mostly natural reappearance in new sentences/dialogues
- isolated drills only when due or after error

---

## 11. Error-specific remediation

### Listening weak, reading strong
Use audio-first prompts; do not re-teach the written form.

### Speaking/tone weak, meaning strong
Use discrimination + production + contour feedback; do not repeat vocabulary definition.

### Reading weak, speaking strong
Use Hanzi recognition in meaningful phrases.

### Writing weak, reading strong
Use paper/screen recall writing; no need to re-run listening introduction.

### Usage weak
Put known items into new sentence/dialogue frames.

The engine reviews the **connection that failed**.

---

## 12. Interleaving

Do not mass 12 identical trials unless introducing a motor pattern briefly.

After initial explanation, mix:
- old/new items
- different retrieval directions
- related but distinguishable tone/word contrasts

Avoid random mixing that exceeds the learner's current knowledge.

---

## 13. Lesson replay

A lesson is a goal/content envelope, not a fixed slideshow.

### First pass
- introduction
- explanation
- scaffolded practice
- initial retrieval
- exit check

### Replay
Engine may:
- skip mastered explanations
- change exercise order
- remove Pinyin
- use different speaker audio
- emphasize weak skill dimensions
- embed targets in different sentences
- shorten already-secure sections

Thus Lesson 6 can be meaningfully replayed without being identical.

---

## 14. Continue button

Normal user flow:

`Continue learning — about 15 min`

The learner should not need to choose:
- review deck
- lesson
- SRS mode
- weak words

The engine composes the session.

Secondary navigation may allow:
- repeat a lesson
- practice writing
- review pronunciation
- browse learned material

But these are optional.

---

## 15. Delayed check

After first learning, schedule a small delayed retrieval set.

For prototype testing:
- same-session exit check
- next-day / next-session check

A lesson should not be judged successful only by immediate completion.

---

## 16. Progress shown to learner

Avoid:
- XP
- opaque global score
- false percentage mastery

Prefer concrete statements:
- `You can greet someone and say your name.`
- `好: reading secure; writing needs another pass.`
- `3 items are ready for a quick review.`

A more detailed progress view can exist, but is not the primary experience.

---

## 17. Cross-device checkpoint

The short checkpoint code represents:
- curriculum frontier
- language/script choice
- coarse competency bands if they can fit safely

It does **not** pretend to preserve full review history.

Full state requires export/import backup.

---

## 18. V0.1 algorithm sketch

For each candidate exercise:

1. collect prerequisite/item skill states
2. identify overdue/weak relations
3. identify current curriculum targets
4. choose session mix within bounded ranges
5. choose exercise direction that targets the needed relation
6. choose scaffold level from current stability
7. after response, record evidence
8. update stability band conservatively
9. schedule next review
10. continue while preserving some new content and transfer

No LLM required.

---

## 19. Later improvement path

Only after real learner data:
- calibrate review intervals
- compare difficulty thresholds
- test whether response time adds useful signal
- potentially adopt a modern retrievability/stability model such as FSRS-inspired scheduling

Do not implement mathematical sophistication before V0.1 tells us what signals are reliable in this multimodal language context.

---

## 20. Individual differences policy

The engine must not infer or assign fixed “learning styles” such as visual, auditory or kinesthetic learner.

Adaptation may use:

- observed performance by skill dimension;
- prior knowledge demonstrated through successful retrieval;
- required scaffolding;
- repeated error patterns;
- learner-selected preferences;
- learner-selected interests for example/context variation.

A preference is not treated as evidence that the learner can only learn effectively through that modality.

The engine should expose learners to multiple relevant representations when the learning objective benefits from them, while removing redundant support as competence increases.

**Rule:** Adapt to demonstrated learning needs, not personality-style labels.
