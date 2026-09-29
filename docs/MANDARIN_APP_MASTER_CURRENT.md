# Language Learning Platform — MASTER v1.0

**Date:** 2026-09-26  
**Status:** Product foundations and historical checkpoints; current status in [Roadmap](ROADMAP.md)
**First language:** Mandarin Chinese  
**Stage:** Real multi-day pilot; production freeze except genuine bugs

> Current precedence: [Learning Architecture](LEARNING_ARCHITECTURE.md) for learning-design decisions; [Roadmap](ROADMAP.md) and verified remote main/served assets for current state; [Pilot Evaluation Protocol](PILOT_EVALUATION_PROTOCOL.md) for evaluation. The dated build-ready instructions and checkpoints below are historical. They do not restart implementation or override current corrections. Research and observations remain separate evidence sources.

## 1. Product thesis

A calm, adaptive adult language-learning environment optimized for **durable learning rather than app engagement**.

First product: Mandarin Foundation. Architecture: **small shared Learning Core + language-specific learning systems**. We do not assume in advance that one universal pedagogy/engine fits every language.

Core hypothesis: can one local-first environment integrate the strongest mechanisms now scattered across specialist tools, without requiring an app stack, gamification or an account?

## 2. Foundation 1 goal

Everyday/travel-ready Mandarin foundation, not fluency or Sinology.

Target capabilities:
- contact/politeness;
- communication repair;
- food/drink;
- shopping/prices/quantities;
- orientation/transport;
- accommodation;
- very simple social conversation;
- elementary problems/help;
- functional reading of signs, menus, prices, times, short messages;
- short digital messages;
- understanding Chinese writing as a system;
- limited useful handwriting.

CEFR/ACTFL can-do thinking is a reference, but Foundation 1 is not marketed as CEFR/ACTFL/HSK.

## 3. Skill priorities

1. listening/pronunciation
2. speaking/interaction
3. functional reading/character recognition
4. handwriting as learning tool + limited active writing

Skills are integrated in sessions but tracked separately:
`meaning · listening · speaking · reading · writing · usage`

## 4. Evidence-based learning framework

Use a small robust set:
- distributed/cumulative learning;
- retrieval with corrective feedback;
- short explicit instruction + immediate application;
- meaningful input/output + focused learning + fluency (Four Strands as audit, not rigid quota);
- pronunciation perception + production;
- integrated modalities with controlled cognitive load;
- structured character learning;
- no visual/auditory/kinesthetic “learning style” classification.

Adapt to observed performance, prior knowledge, scaffolding needs, error patterns and voluntary preferences/interests.




## 4A. Evidence discipline

**SET — applies to all didactic/product claims**

Every material learning-design decision should be distinguishable as one of:

### EVIDENCE
Relatively robust empirical/theoretical support directly relevant to the principle.

Examples:
- distributed practice generally improves delayed retention compared with massed practice;
- retrieval with feedback can strengthen durable learning;
- excessive guidance can become redundant as expertise grows.

Evidence claims should be sourceable and should not be overstated beyond population/task studied.

### DERIVED
A design rule reasonably inferred from evidence plus domain constraints, but not itself directly validated as our exact implementation.

Examples:
- after initial focused acquisition, increasingly interleave related material;
- progressively remove Pinyin/help as independent retrieval stabilizes;
- after an error, give corrective feedback and create some spacing before re-testing rather than mechanically repeating identical trials.

Derived rules must be presented internally as design reasoning, not as “research proves our UI should do X”.

### HYPOTHESIS
A concrete product/curriculum choice that requires testing.

Examples:
- 好 is the first active recall-writing character;
- Lesson 1 should take roughly 15–20 minutes;
- a particular Home screen is calmer with/without photography;
- exact review/new-content ratios;
- the precise Lesson-1 sequence.

Hypotheses should, where practical, include a falsifiable test/observation.

## Rule

Do not allow a plausible design choice to acquire the rhetorical status of scientific evidence merely because it was inspired by research.

When evidence is mixed, population-specific or task-specific, record the limitation.

When a hypothesis fails in real use, change the product rather than defending the original rationale.


## 5. Adaptive Learning Engine

Curriculum controls **what** is learned. Engine adapts **when/how/how much support**.

Signals:
- correct/incorrect;
- independent vs assisted;
- delayed vs immediate retrieval;
- attempts across sessions;
- skill dimension;
- repeated error pattern.

V0.1 stability bands:
`NEW → FRAGILE → DEVELOPING → STABLE → DURABLE`

Error-specific remediation: practice the weak relation, not the whole item.

One error/weak modality does not freeze progression.

Repeated delayed success fast-tracks secure material out of the way.

FSRS may later be evaluated only as a scheduling layer, potentially per `(itemId × skillDimension)`, never as the Lesson Engine.



## 5A. From dense scaffolding to adaptive interleaving

**SET**

The earliest learning objects may receive unusually dense multimodal treatment because the learner is simultaneously learning:
- the language;
- the writing system;
- tone as a lexical feature;
- how to use the learning environment.

Example: an early item such as 好 may move through sound → meaning → production → recognition in 你好 → character structure → first guided/free writing.

This is **not** a permanent per-word ritual.

As competence grows, the engine shifts toward **networked adaptive interleaving**:
- a new word may be heard;
- an older phrase spoken;
- a new character recognized;
- a due character written;
- new and old material combined in dialogue;
- weak relations reappear later.

Not every item requires every modality. Skill targets depend on communicative value, orthographic value and current learner state.

**Rule:** connect modalities, do not mechanically tick them off.

If one relation is already secure, stop drilling it and revisit only the relation that still needs work.




## 5B. New-material gate

**DERIVED; exact thresholds HYPOTHESIS**

The engine does not ask whether an entire lesson is “mastered”. It asks whether the **specific prerequisites for the next learning act** are sufficiently available.

Three checks:
1. comprehension — is enough known to make the new input meaningful?
2. production load — would the learner need to actively juggle too many unstable elements at once?
3. prerequisite review backlog — is foundational material needed by the next task currently unavailable?

Weakness in a non-prerequisite modality does not block progress. Writing weakness, for example, does not block a listening task.

If a prerequisite is repeatedly unavailable, delay/simplify the **dependent task**, not the entire course.

V0.1 also tracks a simple **novelty budget** across meaning, sound, grammar, orthography, motor demand and interaction demand. Early tasks should usually avoid introducing many major new demands simultaneously.

Detailed spec: `docs/NEW_MATERIAL_GATE_v0.1.md`.




## 5C. Learning Engine — minimal decision model

**IMPLEMENTATION MODEL**

All adaptive-learning rules are compressed into five questions:

1. **What does the next curriculum step actually require?**  
   Reactivate only missing prerequisites.

2. **What is due or fragile right now?**  
   Select a small number of high-value weak relations, not everything imperfect.

3. **Can useful new material be added without overload?**  
   If yes, advance. If no, consolidate/transfer.

4. **What operation gives the best learning evidence now?**  
   NEW → scaffolded encounter; FRAGILE → supported retrieval; DEVELOPING → independent recall; STABLE → variation/transfer; DURABLE → natural reappearance.

5. **Is continuing still useful?**  
   If marginal learning value is low and meaningful closure exists, stop and recommend the next useful return.

Every attempt records:
`target relation + task + help level + result + timing + error type`

The engine then updates only the relevant relation conservatively.

This model intentionally excludes XP, fixed exercise quotas, global mastery scores, fixed session lengths, fixed review/new ratios and AI-generated curriculum.

Detailed implementation spec: `docs/LEARNING_ENGINE_DECISION_MODEL_v0.1.md`.


## 6. Session model

Normal path:

> **Continue learning**

The engine mixes new curriculum, due review and transfer/fluency across useful modalities. Users do not normally choose “vocabulary/listening/writing/grammar”.

Not every short session must contain every modality.

Optional specialist modes may later exist but remain secondary.



## 6A. Session orchestration

**SET concept; exact thresholds/order to test**

A session is a directed learning flow, not a random shuffle and not five separate modes.

Typical layers:
1. re-entry / delayed retrieval;
2. limited new learning;
3. integration / transfer;
4. closure / next-learning recommendation.

The engine may use short coherent focus blocks for a genuinely new motor/phonological pattern before interleaving it later.

A modality switch needs a learning reason:
- test another relation;
- create spacing;
- connect representations;
- reduce fatigue/interference;
- remove scaffolding;
- move into communication.

Recognition should progressively give way to recall and production where appropriate. Multiple choice is scaffolding/diagnosis, not primary mastery evidence.

After an error: correct → leave foreground → retrieve later, rather than immediately repeating the identical question.

Whenever possible, component practice culminates in a small communicative success.

**Prototype success question:** does the session feel like learning one language, rather than switching among unrelated mini-games?

Detailed spec: `docs/SESSION_ORCHESTRATION_v0.1.md`.




## 6B. Corrective feedback

**EVIDENCE:** corrective feedback supports L2 learning, but research does not establish one universally optimal feedback timing/type for every task.

**DERIVED:** separate two functions:
1. correct the current learning representation while the error is relevant;
2. schedule later retrieval of the weak relation.

For closed retrieval tasks:
`error → clear/minimal correction → record relation → move on → retrieve later`

Avoid identical immediate drill loops.

Motor writing errors may need immediate local correction; later memory recall remains spaced.

During communicative tasks, correct selectively: prioritize meaning-breaking errors and the current target; do not interrupt every successful utterance for unrelated imperfections.

Pronunciation feedback targets one actionable feature and must express uncertainty when analysis confidence is low.

Errors are classified by relation (meaning, orthography, pronunciation, construction, motor, UI misunderstanding), not as global failure.

Detailed policy: `docs/CORRECTIVE_FEEDBACK_POLICY_v0.1.md`.




## 6C. Example variation and transfer

**EVIDENCE-informed / DERIVED:** variation is useful for abstraction and transfer, but too much simultaneous variability can overload initial learning.

Principle:
**stability first, then productive variation.**

For new material:
- establish one clear canonical example;
- then vary one useful dimension at a time;
- later require transfer into new contexts.

Variation is controlled by a novelty budget. Do not change speaker, vocabulary, syntax, modality and task demand simultaneously for a fragile item.

V0.1 does **not** need runtime generative AI. Prefer authored/QA-approved example banks plus parameterized constructions/slots. The engine selects examples that fit the learner's known inventory.

Lesson replay varies only when variation changes the learning demand (less Pinyin, different slot/speaker/modality/context), not as cosmetic randomness.

Detailed policy: `docs/EXAMPLE_VARIATION_TRANSFER_v0.1.md`.




## 6D. Answer interpretation and tolerance

**SET principle; exact tolerance thresholds HYPOTHESIS**

Responses are evaluated against the **learning relation the task intends to measure**, not exact string equality.

Typed answers may provide separate evidence for:
- lexical/content recall;
- base Pinyin syllables;
- Pinyin orthography;
- tone notation;
- construction completeness;
- script production.

Example:
`wo jiao Wolfram` for target `wǒ jiào Wolfram`
can demonstrate correct content/construction while omitting tone notation.

Missing Pinyin tone marks must never be interpreted as evidence of incorrect **spoken** tones. Speech competence requires audio evidence.

V0.1 Answer Interpreter:
- normalize harmless formatting;
- parse tone marks/tone numbers/no-tone forms separately;
- use conservative typo/phonological matching;
- identify partial evidence;
- expose confidence;
- ask clarification rather than guess when ambiguous.

The Learning Engine receives structured evidence per skill, not one global `correct/wrong` boolean.

Tolerance becomes stricter only when the learning target itself becomes more precise (e.g. explicit Pinyin-tone notation practice).

Detailed spec: `docs/ANSWER_INTERPRETATION_POLICY_v0.1.md`.


## 7. Learning rhythm and stopping

The app may actively recommend stopping.

Principle: **regular/distributed beats rare/excessively long**. No universal “15 minutes daily” claim.

Recommendations derive from learning state and explain why when possible.

Example:
> **Good for today.**  
> Greeting and name introduction are fairly secure. Writing 好 needs another retrieval.  
> **Recommendation: about 5 minutes tomorrow.**

Continue remains possible but secondary.

After absence: no streak loss; diagnose what remains.

## 8. Playfulness, not gamification

Enjoyment comes from:
- genuine competence moments;
- occasional dry/cute/absurd useful examples;
- linguistic surprises;
- character discoveries;
- proverbs/Chengyu/literature/culture;
- varied retrieval;
- beautiful writing/typography/audio interaction;
- small authentic challenges without points.

No XP, coins, hearts, streak pressure, game maps or reward loops.

## 9. Progressive Chinese Interface — UI as input

The interface gradually becomes Mandarin input based on actual competence.

Semantic IDs such as `action.listen_again` allow stages:
1. base language;
2. Chinese + base language;
3. Chinese alone;
4. Chinese + help on demand.

Essential navigation never becomes an incomprehensible test. Adaptation is reversible.


## 10. Mandarin writing systems

Learner chooses primary orthography:
- Traditional `hant`
- Simplified `hans`

Not dual learning targets by default. Switching remains possible.

Meaning/listening/speaking progress can remain shared where appropriate; reading/writing states can differ.

Core knows generic orthography IDs only. Primary personal test mode: Traditional.

## 11. Pronunciation and tones

Tones are core language.

Progression:
1. isolated tone awareness;
2. targeted confusable pairs;
3. two-syllable combinations;
4. natural phrases;
5. production + feedback.

Core extracts generic acoustic/pitch evidence; Mandarin interprets tones/sandhi.

Feedback is confidence-aware. Never pseudo-precise percentages. If uncertain, say so and fall back to listen/compare.

## 12. Handwriting — screen and paper

Paper and screen are equal learning paths.

### Screen
Evaluate **Hanzi Writer** first for Mandarin V0.1:
- stroke-order animation;
- guided writing;
- stroke-level hints/correction;
- no beauty/calligraphy score.

Generic Core writing contract; Hanzi Writer is Mandarin adapter.

### Paper
A4 writing sessions, not one sheet per character:
inspect → trace → reduced scaffold → free writing → recall → optional audio link/QR.

Older due characters may return. V0.1 paper self-check: `secure / unsure / retry`. Photo/OCR later.



## 12A. Handwriting pedagogy — refined after benchmark

**SET for prototype, subject to real-device testing**

Active handwriting is introduced early but selectively. A new active writing target should normally satisfy several criteria:
- communicatively useful / frequent;
- already known in sound and meaning;
- reasonable motor complexity for current level;
- useful for introducing a reusable stroke/component principle.

Do **not** select writing targets by stroke count alone.

### Writing progression

1. know/hear/use the word first;
2. recognize the character;
3. notice useful structure/components;
4. introduce one relevant reusable stroke-order principle when appropriate;
5. watch stroke order once;
6. guided trace / visible outline;
7. reduced scaffold;
8. blank field: recall from memory;
9. delayed recall later;
10. reuse in meaningful context.

Do not require repeated immediate copying as the main learning mechanism.

### Help policy

Use **attempt → diagnostic error → minimal hint → retry**.

Hints should be progressive:
- outline/reference available initially where needed;
- next-stroke hint after repeated misses;
- full animation only on request or persistent difficulty;
- scaffolds disappear as competence increases.

### Structural assembly

Occasionally use component-building tasks:
- identify/select components;
- place them in the correct structural template;
- optionally include plausible distractors once the learner has enough component knowledge.

These are orthographic-analysis tasks, not decorative puzzles.

### Stroke principles

Teach reusable stroke-order principles **just in time**, not as a long prerequisite lecture.

Examples:
- top before bottom;
- left before right;
- relevant crossing/enclosure rules.

Early active writing targets may be chosen partly because they introduce a useful new motor/orthographic principle.

### Assessment dimensions

Writing evidence can distinguish:
- character recognition;
- component/structure understanding;
- stroke-order support needed;
- guided writing success;
- free recall writing;
- delayed free recall.

Do not collapse these into one opaque `writing score`.

### Benchmark evidence policy

Competitor methods are tagged conceptually as:
- **A — directly inspectable:** public interactive demo and/or open-source implementation;
- **B — detailed documentation:** method can be reconstructed from official documentation/videos;
- **C — provider claim:** marketing/app-store description only.

Important V0.1 decisions should prefer A/B evidence and, where possible, independent learning research.

For handwriting:
- Skritter: A/B (public interactive demo + detailed docs);
- Hanzi Writer: A (interactive open documentation/code);
- structural component-building tasks: independent experimental research;
- other commercial app claims are not treated as equivalent evidence unless independently inspectable.


## 13. Character structure / etymology / mnemonics

Strictly separate:
1. functional/visible structure;
2. supported historical/etymological claim;
3. explicitly labeled mnemonic.

Never teach folk etymology as fact.

## 14. Literature / proverbs / cultural depth

May appear surprisingly early as optional enrichment when they illuminate language, reinforce material or create curiosity.

Not automatically separate culture lessons; not assessed unless relevant.

## 15. Content and language QA

Lifecycle:
`draft → source_checked → language_reviewed → audio_reviewed → published`

AI drafts/cross-checks but is not final public authority.

Before public release: qualified native/teacher review, final audio review, source/license register.

## 16. Audio

Final lesson audio is static/offline:
text checked → generated/recorded → pronunciation QA → normalization → committed → cached.

Runtime cloud TTS not required. AI TTS acceptable after provider terms and pronunciation quality review.



## 16A. Audio presentation rules

**SET**

For Mandarin learning content, audio is a primary learning channel rather than an optional pronunciation accessory.

Rules:
- new words/phrases normally have natural audio available immediately and may be introduced audio-first;
- learner can replay learning audio at any time;
- offer a slower version where useful;
- prefer a separately produced naturally slower recording over mechanically time-stretching the normal recording;
- allow word/syllable-level playback when pedagogically useful;
- later exercises deliberately remove text and use audio-only comprehension/recall;
- add multiple native-speaker voices over time to prevent overfitting to one voice;
- all released core audio is cached for offline use.

Do **not** automatically read every interface string aloud. UI speech is used only where the Chinese UI itself is meaningful learning input or when explicitly requested.

Audio variants may therefore include:
`natural`, `careful_slow`, and where needed `isolated`.

The slow/careful version must preserve natural Mandarin tone realization and rhythm rather than sounding like distorted slowed playback.


## 17. User error reports

**Later, not V0.1.**

Stable `itemId` + `contentVersion` prepare for future reports. Reports never auto-correct content.


## 18. Product architecture

Responsive Web/PWA, not native-iOS-first.

Targets: iPad, iPhone, Android, macOS, Windows, modern desktop browsers.

### Small shared Learning Core
Only capabilities we have good reason to treat as reusable:
- persistence / evidence history;
- retrieval and scheduling primitives;
- scaffolding primitives;
- session infrastructure;
- audio capture/playback;
- research log;
- offline/PWA;
- accessibility/localization;
- generic content/exercise plumbing.

### Mandarin-specific learning system
Owns not only Mandarin content, but also Mandarin-specific pedagogy and exercise logic where needed:
- curriculum/progression;
- lexicon and constructions;
- Pinyin;
- `hant/hans`;
- tone perception/production and sandhi;
- Hanzi recognition;
- components and handwriting;
- Mandarin-specific feedback;
- grammar/usage/regional notes;
- discoveries;
- Mandarin worksheet logic.

### Abstraction rule
Do **not** pre-design a universal engine for all languages.

When a second language is added:
1. research that language independently;
2. design its learning progression and language-specific mechanisms from its actual demands;
3. reuse the small Core where it genuinely fits;
4. only move a mechanism into the shared Core after multiple concrete language implementations demonstrate that the abstraction is real.

Core must not assume Hanzi, tones, Pinyin, Traditional/Simplified — nor should Mandarin be forced into abstractions invented for hypothetical future languages.



## 18A. Abstraction policy — concrete languages first

**SET**

The project explicitly rejects the assumption that languages are interchangeable content packs on top of one universal pedagogical engine.

Architecture:

> **small shared Learning Core + language-specific learning systems**

For every new language, begin again with:
- communicative goals;
- linguistic structure;
- pronunciation challenges;
- orthography;
- morphology/grammar;
- relevant cognitive load;
- appropriate exercise types;
- evidence for teaching that specific language.

Example:
Mandarin needs tone, Pinyin, Hanzi, components, handwriting and sandhi mechanisms.
Romanian would likely need a different emphasis on phoneme-grapheme mapping, morphology, gender/articles, conjugation and syntactic production.

Do not build Romanian now and do not generalize from Mandarin prematurely.

**Rule:** abstract after repeated concrete implementations, not before.

A feature belongs in the shared Core only when multiple real language systems demonstrate that the same abstraction is genuinely useful.


## 19. V0.1 technical direction

Starting stack:
React · TypeScript · Vite · Zod · Dexie/IndexedDB · Web Audio/AudioWorklet · Pointer Events/Canvas · Service Worker/PWA · Hanzi Writer evaluation.

Real package versions resolved on Mac with successful install/build + lockfile.

Storage:
- IndexedDB primary;
- persistent-storage request where supported;
- full-state export/import;
- graceful fallback where practical.

No account/cloud sync V0.1.

## 20. Privacy / local-first

No account, advertising, analytics/tracking SDK, runtime cloud AI, audio upload or handwriting upload.

Learner state local. Core lesson works offline after initial download.

Do not overclaim hosting privacy regarding ordinary server/IP logs.



## 20A. Local research log / development observability

**SET for V0.1 development mode**

`Build while learning` uses two separate local data layers:

1. **Learner State** — compact current state needed for adaptation.
2. **Research Log** — append-only event history used to evaluate whether the engine and UX make good decisions.

Useful logged events include:
- task/result/skill relation;
- help or Pinyin reveal;
- audio replay / careful-slow request;
- writing hint/attempt;
- pronunciation-analysis confidence;
- skips;
- session duration;
- voluntary continue/stop;
- explicit post-session feedback.

Avoid surveillance-style data such as heatmaps, continuous screen recording, location/device profiling or unnecessary retention of raw audio/handwriting.

Development mode offers an explicit **Research Export** (structured JSON, optionally a readable summary). Nothing is automatically uploaded.

A very small optional session reflection may ask:
`too easy · about right · too much`
plus optional free text.

Longitudinal delayed-recall data is more valuable than immediate completion scores.

**Privacy rule:** local by default, explicit export by choice.

Detailed spec: `docs/LOCAL_RESEARCH_LOG_v0.1.md`.


## 21. Cross-device progress

Same-device automatic.

Later without account:
1. full backup/export-import;
2. optional coarse checkpoint code.

Checkpoint never pretends to preserve full adaptive history.

## 22. Content architecture

Content is data, not hard-coded screens.

Canonical items have stable IDs and are referenced across lessons/exercises.

Build validation checks references, metadata, QA state and assets.



## 22A. Learning Object Model

**SET**

The engine does not treat every learnable thing as a vocabulary card.

Core object classes:
- lexical item;
- communicative phrase;
- construction / grammatical pattern;
- pronunciation pattern;
- orthographic form / grapheme;
- orthographic / motor principle;
- character component;
- cultural / discovery item.

Each object declares only relevant mastery targets.

Progress evidence belongs to `(objectId, target)`, e.g.:
- `(好 lexical item, listening)`
- `(好 grapheme:hant, writing)`
- `(tone 3, perception)`
- `(我叫 + Name, production)`
- `(left-before-right, application)`

Objects can reference one another. A phrase may contain lexical items and instantiate pronunciation patterns; a grapheme may reference components and motor principles.

**Rule:** sessions are composed from needed learning relations, not from a queue of “words”.

Detailed build spec: `docs/LEARNING_OBJECT_MODEL_v0.1.md`.


## 23. Lesson architecture

A lesson defines objectives, new items, review pools, exercise constraints, optional discoveries and exit checks.

Not a fixed slideshow. Replay can remove explanations/Pinyin, change order/context/speaker and emphasize weak skills.


## 24. Foundation progression — current hypothesis

Spiral:
1. contact + sound system
2. communication repair + questions
3. numbers/things/quantities
4. time + actions
5. location + movement
6. food/drink
7. shopping/payment
8. transport
9. accommodation
10. problems/health
11. social contact
12. integrated travel-day transfer

This is a hypothesis, not twelve immutable lesson files.

## 25. Lesson 1 — frozen prototype scope

**你好 — First contact**

Core:
- 你好
- 我叫 [Name]
- 你叫什麼名字？ / 你叫什么名字？
- 謝謝 / 谢谢
- 再見 / 再见

Tone discovery only:
mā 媽/妈 · má 麻 · mǎ 馬/马 · mà 罵/骂

Writing:
- 好 = first recall-writing target;
- 我 / 你 = guided initially.

Optional:
- 馬/马 pictorial history;
- 好 components + labeled mnemonic;
- verified Laozi line.

Deferred: 是, 嗎/吗, numbers, nationalities, 您, full Pinyin inventory, full sandhi theory, radical lists, HSK.

Lesson 1 is the main technical/didactic experiment.

## 26. Design direction

**High-quality modern digital product + editorial/book character.**

Functional, minimal without minimalism for its own sake, friendly, click-light, self-explanatory, calm, warm, typographically strong.

Chinese itself is a primary visual element.

Avoid pseudo-Asian decoration, sterile SaaS aesthetics and gamified dashboards.

## 27. Images / illustration

**A/B test, not fixed.**

Legitimate roles:
1. functional learning material;
2. editorial/cultural context;
3. rare atmosphere.

Guideline: images should teach or tell something; pure decoration is exceptional.

Prototype Home:
A typographic vs identical layout + editorial photo.

Illustration targeted at character history/mnemonics/visual explanation.

## 28. UI model

Home primary action: **Continue learning**.

Secondary: Lessons · Progress · Settings.

During learning navigation recedes.

Pinyin/translation/explanation progressively disclosed.

No fixed step counter when adaptive session length changes; test approximate time, subtle progress or none.

## 29. Worksheets

First-class design surface. A4, low ink, B/W usable, generous grids, same visual identity as web.

Grouped writing sessions with recall, not per-character pages.


## 30. Competitive benchmark — adopted lessons

Strong references:
- HelloChinese / ChineseSkill: integrated course feasibility; reject gamification.
- SuperChinese: scenario application + speaking early + authored curriculum.
- Dong Chinese: context selection, tone progression, character history.
- Skritter: stroke feedback + pragmatic SRS/easy-item fast track.
- Zishu: offline/no-account writing product.
- Du Chinese: progressive help + contextual review + partial knowledge.
- Hack Chinese / Outlier: functional character analysis; proprietary content not copied.
- Manda: local-first browser storage/export.
- Princeton 中文-Learn: React/Vite/PWA/GitHub deployment/Hanzi Writer implementation reference.
- Jiyi: local pronunciation/handwriting as feasibility signal, not validation.

Immediate consequences:
- evaluate Hanzi Writer before custom stroke recognition;
- IndexedDB/Dexie + persistence request + export/import;
- tone progression isolated → contrast → two-syllable → phrase → production;
- progressive Pinyin/help;
- easy-item fast track;
- FSRS only later as scheduler;
- controlled authored curriculum; AI later only within constrained roles.

USP is **integration**, not a unique feature:
evidence-based Foundation curriculum + skill-specific adaptation + speaking/listening priority + literacy + digital/paper handwriting + cultural depth + calm non-gamified UI + local-first/no-account + transparent pronunciation uncertainty + language-agnostic Core.

Internal positioning:
> We optimize not for how long you stay in the app, but for how much language stays with you.

## 31. Build while learning

**SET**

The first course grows just ahead of the first real learner.

Loop:
`build → learn → wait → delayed recall → observe → improve → build next material`

The first learner is a longitudinal product test, not scientific efficacy evidence. Later test with diverse beginners.

Do not produce large curriculum volumes before underlying mechanics hold.

## 32. Build status / next action

**READY FOR MAC BUILD.**

At Mac:
1. clone `https://github.com/jygc9nwmvj-debug/language-learning.git`;
2. bring prepared project into repo;
3. real `npm install`, resolve compatible current versions, commit lockfile;
4. make scaffold build;
5. implement schema/validator → lesson runner → progress/storage → orthography → static audio → Hanzi Writer + paper → microphone → generic pitch → Mandarin tone interpretation → adaptive replay/help → PWA/offline → worksheet generator;
6. connect GitHub to Cloudflare Pages (preferred) for HTTPS auto-deploy;
7. test real devices, especially iPad Safari + Apple Pencil;
8. learn Lesson 1 for real;
9. test delayed recall;
10. fix architecture before implementing Lesson 2.

Explicitly out of V0.1:
accounts/cloud sync; error-report backend; general speech recognition; handwriting OCR/photo analysis; runtime generative curriculum; sophisticated FSRS tuning; Lessons 4–12; other languages; final branding; HSK; social/community.

## 33. V0.1 success criterion

One URL → no account → complete Lesson 1 on a real device → audio/speaking/tone awareness + handwriting or paper → progress stored → close → reopen offline → meaningfully adapted review.

Only after this works do we scale content.

---

# Reference documents

Detailed supporting specs remain authoritative where they do not conflict with this Master:

- `V0_1_FINAL_BUILD_PLAN.md`
- `PRE_BUILD_AUDIT_v0.1.md`
- `V0_1_TECH_SPEC.md`
- `CONTENT_SCHEMA.md`
- `ADAPTIVE_ENGINE_v0.1.md`
- `CONTENT_QA_SOURCE_POLICY_v0.1.md`
- `DESIGN_SYSTEM_v0.1.md`
- `LESSON_01_PRODUCTION_MAP_v0.2.md`
- `LESSON_01_FLOW_v0.1.md`
- `CORE_LANGUAGE_BOUNDARY_AUDIT_v0.1.md`
- `COMPETITOR_BENCHMARK_v0.1.md`
- `NEXT_STEPS.md`

The chronological pre-v1 Master is archived for provenance only and is **not normative**.

## 34. Build handoff and first-test protocol

**Status: CONSOLIDATED — no further pre-build expansion**

All post-v1 decisions have been consolidated into:
- `docs/BUILD_HANDOFF_v1.1.md`
- `docs/LESSON_01_TEST_PROTOCOL_v0.1.md`

The handoff supersedes older build-order documents where implementation details conflict.

The first prototype test evaluates:
- clarity/flow;
- cognitive load;
- scaffolding/Pinyin;
- audio/tone;
- writing/paper;
- corrective feedback;
- enjoyment;
- delayed retention;
- whether the engine's stopping/adaptation decisions are useful.

**Decision:** no more pedagogical feature expansion before the real prototype. Next step is implementation at the Mac.

## 35. Mac implementation checkpoint — 2026-09-27

The later **Complexity Cut** is now recorded in `COMPLEXITY_CUT_v0.1.md` and narrows the breadth
of the earlier theoretical specifications. German is the private test UI; English is a later
localization for any learner comfortable using it, not solely native English speakers.

The local React build now implements the minimal Lesson-1 loop. See
`IMPLEMENTATION_STATUS_v0.1.md` for tested behavior and the remaining real-device/audio gates.
This replaces “READY FOR MAC BUILD” as the technical status; it does **not** assert that the
real-device learning-success criterion has been established. No Lesson 2 before that evaluation.


## 36. Build B checkpoint — 2026-09-27

The user-authorized Writing Foundation narrows this build to the existing 好 / 你 / 我 targets.
See `BUILD_B_WRITING_FOUNDATION.md`: fixed gradual guidance, real learner SVG strokes without snapping,
Hanzi Writer recognition and animation, immediate feedback, and the unchanged paper worksheet.
Four/three immediate productions are a test hypothesis. No new vocabulary, adaptive engine,
Continuous Learning, Identity/Sync or Research Mode was added. Lesson 2 remains on hold.


## 37. Build C checkpoint — 2026-09-27

The explicitly authorized Interaction & Flow build improves two existing sequence types: encounter
and reading → speaking. Small shared interaction locks protect recording/finalization/playback and
DB transitions; no new scheduler. Existing audio and Build-B writing remain unchanged. Offline ready
now verifies the active worker's actual asset cache and offers retry. See
`BUILD_C_INTERACTION_FLOW.md`. The learner-facing entry is Weiterlernen; existing content remains
bounded and non-adaptive. No Lesson 2, Continuous Learning, Identity/Sync or Research Mode.


## 38. Build D checkpoint — 2026-09-27

The explicit Build D instruction supersedes the earlier hold on content expansion. A small continuous
Weiterlernen planner mixes bounded recall/consolidation/new exposure with 28 new communicative/number
objects. No learner-facing lesson numbering or long-term adaptive claim. Five additional writing
targets reuse B's engine; C's progressive surface remains. All production audio is Polly-only; accepted
A2 files unchanged, new audio provisional. See BUILD_D_CONTINUOUS_LEARNING.md and the review report.
No Identity/Sync, Research Mode, accounts, exam system or efficiency dashboard.
