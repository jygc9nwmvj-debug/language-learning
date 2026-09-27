# Pre-Build Audit v0.1

**Date:** 2026-09-26  
**Verdict:** Ready to build the V0.1 vertical slice. No conceptual blocker remains. A small number of implementation decisions must be resolved during the prototype rather than before it.

---

# 1. What is genuinely SET

These decisions are coherent across the current documents:

- Web/PWA-first, not native-first.
- One codebase across modern mobile/tablet/desktop browsers.
- No user account and no required backend.
- Local-first progress and offline lesson use.
- Core engine is language-agnostic.
- Mandarin is the first language pack.
- Traditional/Simplified are selectable presentation/writing systems.
- Listening/speaking are prioritized; reading is functional; handwriting is selective and supports learning.
- Screen writing and paper writing are equal legitimate modes.
- Curriculum is controlled; pace/scaffolding/review are adaptive.
- No learning-style typologies.
- No gamification as primary motivation.
- Humor/lightness is tone/content, not reward mechanics.
- Content QA separates facts, pragmatics, etymology and mnemonic.
- Public instructional language/audio eventually receives qualified human review.

No contradiction was found among these core principles.

---

# 2. Blockers before public release — NOT blockers before prototype

None of these should delay the technical prototype.

## A. Final instructional audio
Current placeholder audio must not be treated as authoritative Mandarin instruction.

Before public release:
- choose/generate/record final audio;
- verify phrase-level pronunciation;
- native/qualified review;
- normalize and freeze static assets.

## B. Native language review
Lesson 1 should receive human review before public teaching release, especially:
- naturalness/pragmatics;
- name question;
- Taiwan/Mainland notes if relevant;
- humor;
- tone explanations.

## C. Licensing/source register
Before public release, keep a machine-readable register of:
- datasets used;
- licenses;
- attribution obligations;
- generated assets and provider terms.

---

# 3. Technical questions V0.1 must answer experimentally

These are the real architecture risks.

## A. Pitch extraction reliability
Question:
Can mobile Safari/Chrome produce stable enough F0 contours from ordinary learner speech?

Test:
- isolated syllables;
- short phrase 你好;
- quiet vs mildly noisy environment;
- male/female/high/low voices where possible.

Success criterion:
Useful contour visualization and broad diagnostic categories, not phonetic perfection.

Fallback:
record/replay + reference contour/self-comparison.

## B. Tone feedback validity
Question:
Can simple signal processing provide feedback that is more helpful than misleading?

Rule:
If confidence is low, do not issue a confident correction.

V0.1 should support:
- “clear rising/falling/level tendency”
- “uncertain”
rather than forcing a tone label.

## C. Writing input across devices
Test:
- Apple Pencil / iPad Safari
- finger / iPhone Safari
- Android touch/stylus Chrome
- mouse/trackpad desktop

Success:
stroke capture is responsive and does not fight page scrolling.

Fallback:
paper mode always available.

## D. Local persistence
Test:
- reload
- browser restart
- PWA/home-screen launch
- offline reopen
- storage persistence request where supported

Do not promise indefinite browser storage without backup.

## E. Offline caching
Test real airplane-mode reopen, not merely DevTools “offline”.

---

# 4. Scope corrections before coding further

## A. Do NOT implement sophisticated SRS/FSRS now
The adaptive-engine principles are useful; exact weights/intervals are hypotheses.

V0.1 needs:
- conservative stability bands;
- due dates;
- same-session + next-session review;
- bounded new/review mix.

No optimization until real behavior exists.

## B. Do NOT build a generic plugin marketplace architecture
“Language packs” should be a clean code/content boundary, not a large framework.

Mandarin should prove the interface first.

## C. Do NOT build full handwriting recognition
V0.1:
- capture strokes;
- guided tracing;
- stroke count/order where data supports it;
- self-check / paper mode.

Automatic “this Hanzi is correct” can come later.

## D. Do NOT build general speech recognition
Tone/pitch experiment first.

## E. Do NOT build checkpoint-code sophistication yet
Same-device persistence first.
A simple curriculum checkpoint can be added after the state model stabilizes.
Full backup/export is more important than a clever short code.

---

# 5. Content/lesson inconsistencies to resolve in the prototype

## A. Lesson length
15–20 minutes is a hypothesis, not a requirement.

Measure:
- first-pass duration;
- cognitive fatigue;
- next-day recall.

## B. Active handwriting load
Current direction:
- 好 active recall writing;
- 我 / 你 guided initially.

This should be tested, not frozen.

## C. 謝謝 / 再見
Keep as light spoken/recognition material for a complete encounter.
Do not spend disproportionate retrieval time on them in Lesson 1.

## D. Tone Lab
Goal is conceptual/perceptual introduction, not “master all four tones”.

Do not allow the Tone Lab to dominate Lesson 1.

## E. Literature / discovery
馬 history and Laozi line are optional enrichment.
They must be skippable and must not add assessment load.

---

# 6. Architecture consistency check

## Core may know
- item
- skill dimension
- exercise
- lesson/session
- scaffold
- progress
- audio asset
- drawing/stroke input
- worksheet
- review scheduling

## Core must NOT know
- Hanzi
- Pinyin
- lexical tone
- Traditional/Simplified semantics
- radicals/components
- Mandarin sandhi

Those belong to Mandarin modules/data.

### One nuance
Core may support generic “writing systems/variants”.
Mandarin configures these as Traditional/Simplified.
This avoids baking Chinese terminology into platform code.

---

# 7. Privacy audit

V0.1 can satisfy the intended privacy model if:

- no third-party analytics scripts are loaded;
- no runtime TTS/API calls are required;
- microphone buffers remain in-browser;
- handwriting remains local;
- content assets are static;
- external fonts/CDNs are avoided or self-hosted;
- service worker does not contact third-party services;
- crash reporting is absent unless explicitly added later.

Important:
Hosting logs may still exist at infrastructure level. “No tracking” should not be phrased as “no server ever sees an IP address” unless hosting configuration actually guarantees that.

---

# 8. Browser-support principle

Do not promise “all browsers”.

Promise:
**modern standards-based browsers with graceful fallback.**

Baseline experience:
- lesson content
- static audio
- local progress where supported
- paper writing mode

Enhanced experience:
- microphone
- pitch analysis
- touch/stylus writing
- installable PWA/offline

A capability check at startup should select the appropriate path.

---

# 9. Adaptive-engine audit

The conceptual model is coherent.

Keep:
- skill-specific state;
- delayed recall weighted more strongly;
- assistance level matters;
- errors are diagnostic, not punitive;
- new content is not completely blocked by one weak skill;
- old content is embedded in new contexts.

Treat as HYPOTHESIS:
- exact percentages of new/review/transfer;
- exact intervals;
- exact mastery thresholds;
- response-time use.

Do not expose an opaque global mastery percentage.

---

# 10. Minimum V0.1 implementation order

1. Content schema + validator
2. Lesson runner with static content
3. Local progress
4. Script preference
5. Static audio playback
6. Writing canvas + paper fallback
7. Microphone capture
8. Pitch contour experiment
9. Tone Lab feedback with uncertainty
10. Replay/adaptive scaffolding
11. Offline/PWA
12. Real-device test matrix

This order isolates risk. If pitch feedback fails, the rest of the platform remains viable.

---

# 11. Stop conditions

Before adding Lesson 2 implementation, Lesson 1 should prove:

- learner always knows what to do;
- writing works on at least iPad Safari + one Android browser or paper fallback is clean;
- microphone capture works on target mobile browsers;
- pitch display is stable enough to be informative;
- progress survives realistic reopen;
- airplane-mode lesson works;
- replay is meaningfully different;
- no core module contains Mandarin-specific assumptions.

If these fail, fix architecture before scaling content.

---

# 12. Bottom line

**Build now.**

The remaining uncertainties are empirical, not conceptual. More pre-build theory is unlikely to reduce them.

The next high-value evidence comes from:
1. deploying the vertical slice;
2. using it on real devices;
3. learning Lesson 1;
4. testing recall later;
5. adjusting the engine from observed behavior.
