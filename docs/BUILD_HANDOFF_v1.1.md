# BUILD HANDOFF v1.1

**Status:** CURRENT — use this at the Mac  
**Scope:** First real-device Mandarin Lesson-1 vertical slice

## 1. Architecture correction

Do NOT implement a universal language-learning engine.

Build:

> **small shared Learning Core + Mandarin-specific learning system**

### Shared Core
Only clearly reusable infrastructure:
- persistence/evidence history;
- retrieval/scheduling primitives;
- scaffolding primitives;
- session infrastructure;
- audio capture/playback;
- local research log;
- offline/PWA;
- accessibility/localization;
- generic content/exercise plumbing.

### Mandarin system
Owns Mandarin pedagogy as well as content:
- Foundation curriculum/progression;
- Pinyin;
- Traditional/Simplified (`hant`/`hans`);
- tone perception/production and sandhi;
- Hanzi recognition/components/handwriting;
- Mandarin feedback rules;
- Mandarin-specific exercise logic;
- grammar/usage/regional notes;
- discoveries;
- worksheet logic.

Do not abstract hypothetical future languages prematurely.

---

## 2. V0.1 learning model

Implement learning evidence per `(objectId, target)`, not one global word score.

Learning object classes:
- lexical item;
- communicative phrase;
- construction/pattern;
- pronunciation pattern;
- grapheme/orthographic form;
- motor/orthographic principle;
- component;
- discovery item.

Targets may include:
meaning, listening, speaking, reading, writing, usage, perception, production, structure, application.

Not every object gets every target.

---

## 3. Minimal adaptive loop

Engine asks:

1. What does the next curriculum step require?
2. What high-value relation is due/fragile?
3. Can useful new material be added without overload?
4. Which learning operation gives the best evidence now?
5. Is continuing still useful?

States:
`NEW → FRAGILE → DEVELOPING → STABLE → DURABLE`

V0.1 parameters are hypotheses, not scientific constants.

---

## 4. Session orchestration

A session is a directed learning flow, not random exercise shuffle.

Typical:
- re-entry/retrieval;
- limited new learning;
- integration/transfer;
- closure.

Use short focus blocks where needed, then spacing/interleaving.

Modality changes require a learning reason.

Recognition should increasingly give way to recall/production.

After ordinary memory error:
`minimal correction → move on → retrieve later`

Do not immediately repeat identical questions.

---

## 5. Answer Interpreter

Do not grade free input by exact string equality.

Interpret evidence separately:
- lexical/content recall;
- base Pinyin syllables;
- Pinyin orthography;
- tone notation;
- construction completeness;
- script production.

Example:
`wo jiao Wolfram`
for `wǒ jiào Wolfram`
= content/construction/base syllables correct; tone notation omitted; spoken tone ability unknown.

Missing tone marks never imply bad spoken tones.

V0.1:
- deterministic normalization;
- Pinyin parsing;
- conservative typo matching;
- confidence;
- clarification when ambiguous.

---

## 6. Mandarin audio

Audio is a primary learning channel.

Variants:
- `natural`
- `careful_slow`
- `isolated` where needed

Prefer genuinely careful/slow recordings over mechanically slowed natural audio.

Later tasks use audio-only prompts.

Core released audio is static/offline.

---

## 7. Mandarin tone progression

Longer progression:
1. isolated awareness;
2. confusable pairs;
3. two-syllable combinations;
4. natural phrases;
5. production/feedback.

Lesson 1 proves only the beginning.

Core extracts generic acoustic evidence; Mandarin interprets tone/sandhi.

Always support `uncertain` feedback.

---

## 8. Writing

Active writing starts early but selectively.

Choose targets using:
- communicative usefulness/frequency;
- sound/meaning already known;
- motor complexity;
- reusable orthographic value.

Progression:
word known → character recognized → structure/components → relevant stroke principle → observe → guided → reduced scaffold → blank recall → delayed recall → contextual reuse.

Evaluate Hanzi Writer first.

Do not over-penalize stroke order; distinguish recognizable/free-form production from stroke-order competence.

Paper is equal:
A4 grouped writing sessions, not per-character sheets.

---

## 9. Progressive help

Pinyin/translation/explanation/stroke hints are available but fade.

Help usage itself is evidence.

UI strings use semantic IDs so known high-frequency interface language can gradually become Chinese.

---

## 10. Variation

Stability first, then productive variation.

V0.1 uses authored/QA-approved examples + parameterized slots, not runtime AI curriculum generation.

Vary one useful dimension at a time for fragile material.

Lesson replay changes cognitive demand, not merely cosmetics.

---

## 11. Local observability

Two local layers:

### Learner State
Current compact adaptive state.

### Research Log
Append-only development events:
- target/task/result;
- scaffold/help;
- Pinyin reveal;
- audio replay/slow request;
- writing hint;
- pronunciation confidence;
- skip;
- session duration;
- continue/stop;
- optional reflection.

No automatic upload.

Provide `Export research data`.

Avoid heatmaps, screen recording, location/device profiling, unnecessary raw audio/handwriting retention.

---

## 12. Lesson 1 content

Core:
- 你好
- 我叫 [Name]
- 你叫什麼名字？ / 你叫什么名字？
- 謝謝 / 谢谢
- 再見 / 再见

Tone discovery:
mā 媽/妈 · má 麻 · mǎ 馬/马 · mà 罵/骂

Writing:
- 好 = first recall-writing target (HYPOTHESIS)
- 我 / 你 = recognition + guided exposure initially

Optional discovery:
- 馬/马 history
- 好 components + labeled mnemonic
- verified Laozi line

No numbers, 是, 嗎/吗, HSK, full Pinyin system or full sandhi theory.

---

## 13. UX/design

High-quality modern digital product + editorial/book character.

Home primary:
**Continue learning**

No XP/streaks/coins/game map.

Playfulness comes from competence, language, surprise, culture and craft.

Home photo vs no-photo remains an A/B prototype question.

Session may end:
**Good for today.**
with a reason and next recommended return.

---

## 14. Technical starting direction

- React
- TypeScript
- Vite
- Zod
- Dexie/IndexedDB
- Web Audio / AudioWorklet
- Hanzi Writer evaluation
- Service Worker / PWA

Resolve actual current package versions on Mac with real install/build. Commit lockfile.

GitHub = source/version control.  
Cloudflare Pages = preferred HTTPS auto-deploy/preview.

---

## 15. Build order

1. clone repo
2. import project/docs
3. real npm install/build
4. content schema + validator
5. learning object/evidence model
6. lesson runner/session composer
7. Answer Interpreter
8. Dexie Learner State + Research Log + export
9. script preference
10. static audio playback
11. Hanzi Writer spike + paper mode
12. microphone capture
13. pitch extraction
14. Mandarin tone interpretation
15. adaptive replay/help
16. PWA/offline
17. worksheet generator
18. Cloudflare deployment
19. real-device Lesson-1 test

Do not implement Lesson 2 before the first loop is evaluated.

---

## 16. Evidence discipline

Tag important design decisions internally:

- **EVIDENCE** — directly supported broader principle
- **DERIVED** — design rule inferred from evidence/domain
- **HYPOTHESIS** — concrete implementation to test

Never let a plausible product choice silently become “science says”.

---

## 17. Out of scope

- accounts/cloud sync
- error-report backend
- general speech recognition
- handwriting OCR/photo analysis
- runtime generative curriculum
- sophisticated FSRS tuning
- Lessons 4–12
- other languages
- final branding
- HSK
- community/social

---

## 18. First milestone

One URL → no account → Lesson 1 → audio/speaking/tone awareness + handwriting/paper → local state → close → reopen offline → adapted review → research export.

If this fails, fix architecture before scaling content.
