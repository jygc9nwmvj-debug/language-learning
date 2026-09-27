# V0.1 FINAL BUILD PLAN

**Status:** FROZEN FOR FIRST REAL-DEVICE BUILD  
**Date:** 2026-09-26

## Goal

Prove one complete adaptive Mandarin learning loop on real devices before scaling curriculum.

Success means:

> One URL → no account → Lesson 1 → audio + speaking + tone awareness + handwriting/paper → local progress → close → reopen offline → adapted review.

---

## 1. Architecture

### Core — language agnostic
- session/lesson orchestration
- generic exercise registry
- skill-specific progress evidence
- review scheduling
- scaffolding
- IndexedDB persistence
- backup/export
- audio playback/capture
- generic pitch extraction
- generic drawing input
- worksheet primitives
- PWA/offline
- accessibility/localization

### Mandarin pack
- curriculum/content
- Pinyin
- `hant` / `hans` orthographies
- lexical/surface tone data
- Mandarin tone interpretation
- Hanzi/component data
- stroke-order integration
- grammar/usage/regional notes
- Mandarin discoveries
- Mandarin worksheet content

Core must not contain Mandarin concepts.

---

## 2. Technical stack

Starting point:
- React
- TypeScript
- Vite
- Zod
- Dexie / IndexedDB
- Web Audio API / AudioWorklet
- Pointer Events / Canvas
- Service Worker / Web App Manifest

### New benchmark decision
**Evaluate Hanzi Writer first** for Mandarin stroke-order animation and guided writing.

Do not implement custom Hanzi stroke recognition in V0.1 unless Hanzi Writer proves unsuitable.

Self-host required character data for offline use.

### Later, not V0.1
Evaluate `ts-fsrs` only as the timing/scheduling layer after real learning logs exist.

---

## 3. Storage

Primary:
- IndexedDB via Dexie

Add:
- request persistent storage where supported;
- explicit full-state export/import;
- graceful handling when persistent storage is unavailable.

Same-device automatic persistence comes first.

Do not build account/cloud sync.

Do not prioritize short checkpoint code before the state model is stable.

---

## 4. Lesson 1 scope

Core language:
- 你好
- 我叫 [Name]
- 你叫什麼名字？ / 你叫什么名字？
- 謝謝 / 谢谢
- 再見 / 再见

Tone discovery:
- mā / má / mǎ / mà
- conceptual/perceptual introduction only

Writing:
- 好 = active recall target
- 我 / 你 = guided exposure initially

Optional:
- 馬/马 pictorial-history discovery
- 好 component/mnemonic discovery
- verified Laozi line

No numbers, 是, 嗎/吗, HSK framing or full Pinyin system.

---

## 5. Tone-training architecture

Lesson 1 tests only the first layer.

Longer progression:
1. isolated tone awareness
2. targeted confusable tone pairs
3. two-syllable combinations
4. natural phrases
5. own production + feedback

Pitch engine:
- generic F0 contour extraction in Core
- Mandarin interpretation in language pack
- confidence-aware feedback
- explicit `uncertain` fallback

Never output pseudo-precise pronunciation percentages.

---

## 6. Writing architecture

Two equal paths:

### Screen
Mandarin adapter using Hanzi Writer if suitable:
- stroke animation
- guided quiz
- mistake/hint events
- no calligraphy score

### Paper
Generated A4 writing sessions:
- grouped characters, not one page each
- trace → reduced scaffold → free writing → recall
- older due characters may return
- optional audio link/QR

Paper is not a fallback feature.

---

## 7. Adaptive engine

Track separately:
- meaning
- listening
- speaking
- reading
- writing
- usage

Use:
- assistance level
- independent vs assisted success
- elapsed/session-separated retrieval
- repeated error patterns

V0.1:
- simple stability bands
- simple due dates
- bounded mix of review/new/transfer
- easy-item fast track
- progressive help

Do not optimize mathematical intervals yet.

Later:
FSRS may schedule `(itemId × skillDimension)` states.

---

## 8. Progressive help

Pinyin, translation, grammar/explanation and stroke hints:
- available;
- not permanently visible;
- hidden when they reveal a recall answer;
- help usage stored as evidence.

Default behavior becomes less scaffolded as competence stabilizes.

---

## 9. UI

Direction:
**high-quality modern digital product + editorial/book character**

Home:
- Continue learning
- quiet context/review note
- secondary navigation only

A/B:
- typographic Home
- identical Home + editorial image

No:
- XP
- streaks
- coins
- game map
- feature dashboard
- fixed step counter if session length is adaptive

---

## 10. Privacy / offline

V0.1:
- no account
- no analytics
- no tracking SDK
- no runtime cloud AI
- no audio upload
- no handwriting upload
- static instructional audio
- local learning state
- lesson works after initial cache in airplane mode

Hosting infrastructure may still have normal access logs; do not make stronger privacy claims than technically true.

---

## 11. Content QA

Lifecycle:
`draft → source_checked → language_reviewed → audio_reviewed → published`

Before public release:
- native/qualified Mandarin language review
- final instructional audio review
- license/source register

Prototype may use clearly marked non-authoritative placeholder audio.

---

## 12. Implementation order at Mac

1. clone GitHub repo
2. copy consolidated project
3. real `npm install`; resolve current compatible package versions; commit lockfile
4. make current scaffold build
5. implement content schema + validator
6. lesson runner
7. Dexie progress + persistence/export
8. generic orthography preference
9. static audio
10. Hanzi Writer spike + paper mode
11. microphone capture
12. generic pitch extraction
13. Mandarin Tone Lab + uncertainty handling
14. adaptive replay/progressive help
15. PWA/offline
16. worksheet generator
17. automatic HTTPS deployment
18. real-device test

---

## 13. Test priority

1. iPad Safari + Apple Pencil
2. iPhone Safari + finger
3. Android Chrome
4. desktop Chrome/Edge
5. desktop Safari
6. desktop Firefox

Real airplane mode, not only developer simulation.

---

## 14. Stop before Lesson 2 implementation

Lesson 1 must prove:
- clear UX
- audio works
- microphone works
- pitch visualization useful enough or graceful fallback
- writing path works
- paper path is credible
- progress survives reopen
- offline works
- replay differs meaningfully
- Core remains language-agnostic
- next-day recall is measurable

Only then scale curriculum.

---

## 15. Explicitly out of scope

- accounts/cloud sync
- error-report backend
- general speech recognition
- handwriting OCR/photo analysis
- runtime generative curriculum
- sophisticated FSRS optimization
- Lessons 4–12
- Romanian/other language packs
- final brand/name
- HSK
- giant dictionary
- social/community features

---

## 16. Product hypothesis being tested

Not:
> Can we build another Mandarin app?

But:
> Can one calm, adaptive, local-first learning environment integrate the strongest mechanisms now scattered across specialist tools so that an adult learner learns more efficiently without needing an app stack or gamification?

V0.1 exists to test this hypothesis, not to prove it by assertion.
