# Language Learning Platform — MASTER v1.0

**Date:** 2026-09-26  
**Status:** CURRENT / normative Single Source of Truth  
**First language:** Mandarin Chinese  
**Stage:** Ready for first real-device vertical slice

> If an older planning document conflicts with this Master, this Master wins unless a later explicitly approved decision supersedes it.

## 1. Product thesis

A calm, adaptive adult language-learning environment optimized for **durable learning rather than app engagement**.

First product: Mandarin Foundation. Architecture: language-agnostic Core + language packs.

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

## 6. Session model

Normal path:

> **Continue learning**

The engine mixes new curriculum, due review and transfer/fluency across useful modalities. Users do not normally choose “vocabulary/listening/writing/grammar”.

Not every short session must contain every modality.

Optional specialist modes may later exist but remain secondary.

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

## 17. User error reports

**Later, not V0.1.**

Stable `itemId` + `contentVersion` prepare for future reports. Reports never auto-correct content.


## 18. Product architecture

Responsive Web/PWA, not native-iOS-first.

Targets: iPad, iPhone, Android, macOS, Windows, modern desktop browsers.

### Language-agnostic Core
lesson/session orchestration; exercise registry; generic skills; progress/review; scaffolding; storage; audio capture/playback; generic pitch extraction; drawing input; worksheet primitives; PWA/offline; accessibility/localization.

### Mandarin Language Pack
curriculum; lexicon; Pinyin; `hant/hans`; tone/sandhi interpretation; Hanzi/components/stroke content; grammar/usage/regional notes; discoveries; Mandarin worksheet choices.

Core must not assume Hanzi, tones, Pinyin or Traditional/Simplified.

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
