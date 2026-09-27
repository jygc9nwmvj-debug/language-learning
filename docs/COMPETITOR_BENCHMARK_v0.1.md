# Competitor Benchmark v0.1 — Mandarin Learning Platform

**Date:** 2026-09-26  
**Purpose:** Identify proven product, didactic and technical patterns worth adapting — without copying proprietary content, UI, branding or protected datasets.

## Executive conclusion

No single reviewed product matches the intended combination: controlled evidence-based foundation curriculum; listening/speaking priority; integrated handwriting/reading; skill-specific adaptation; Traditional/Simplified; optional character history/literature; first-class paper mode; local-first PWA; no account; no gamification.

However, nearly every hard subproblem already has a strong reference implementation. The best strategy is therefore **integration, not invention**.

### Best reference by problem
- Complete beginner course / lesson pacing: **HelloChinese, SuperChinese, ChineseSkill**
- Context-first vocabulary and character origins: **Dong Chinese**
- Handwriting interaction: **Skritter, Zishu, Hanzi Writer**
- Character structure / genuine etymology: **Hack Chinese + Outlier** (method reference only; Outlier content is proprietary)
- Reading + progressive help: **Du Chinese**
- Local-first browser architecture: **Manda**
- Open PWA implementation: **Princeton 中文-Learn**
- Tone discrimination: **Dong Chinese**
- On-device tone/handwriting ambition: **Jiyi**
- Memory scheduling: **Skritter heuristics; later FSRS as optional scheduler**
- Open stroke infrastructure: **Hanzi Writer + Make Me a Hanzi**

---

# 1. HelloChinese

## What it proves
A beginner course can successfully integrate reading, writing, speaking, vocabulary, grammar, handwriting, speech recognition, native-speaker video and spaced repetition in bite-sized lessons.

## Worth adapting
- One coherent path rather than a toolbox of unrelated modes.
- New language is introduced in short, manageable lesson units.
- Handwriting and speaking appear inside the main course, not as specialist afterthoughts.
- Native-speaker variation is useful once the learner has a stable initial model.
- SRS should feel like part of the course rather than a separate flashcard hobby.

## Do not inherit
- Game-based framing, level-up motivation and reward mechanics.
- Any assumption that engagement requires gamification.
- Proprietary lesson text, media or UI.

## Our improvement
Keep the all-in-one integration, remove game mechanics, expose less navigation, and make adaptation skill-specific.

---

# 2. SuperChinese

## What it proves
Scenario-first course design can combine a structured curriculum with speaking from the first lesson. Current public material describes 8 levels, 200+ everyday topics, short lessons, character-level pronunciation feedback and role-play.

## Worth adapting
- Build units around practical situations rather than grammar chapter titles.
- Speaking starts immediately.
- Separate the authored curriculum from AI: native teachers author lessons; AI is used for feedback/practice.
- End a unit with a practical speaking/application task.
- Culture/stories can sit beside the main path rather than interrupting it.

## Caution
Its optional Pinyin course puts sound-system instruction before the first full sentence. Our approach intentionally differs: sound awareness is embedded immediately in meaningful language.

## Our improvement
Keep scenarios but order them around high-leverage generative structures, so the course does not become a phrasebook.

---

# 3. ChineseSkill

## What it proves
Integrated Chinese-specific teaching can support distinct Simplified/Mainland, Traditional/Taiwan and Cantonese paths; it also allows learners to hide translations, control transliteration and adjust audio behavior.

## Worth adapting
- Script/regional configuration should be a language-pack concern.
- Learner controls for Pinyin/translation can coexist with adaptive defaults.
- Pronunciation, grammar, sentence patterns and characters should not be separate silos.

## Do not inherit
- Game-based framing as the organizing principle.
- Excessive settings exposed before the learner has a reason to change them.

## Our improvement
Adaptive defaults first; manual overrides second.

---

# 4. Dong Chinese

## What it proves
This is one of the closest conceptual references:
- learn words in full sentences;
- choose sentences that fit learner level;
- handwriting;
- origins of frequent characters;
- comprehensible media;
- dictionary/stroke order/frequency;
- dedicated tone discrimination.

Its tone trainer explicitly supports selecting troublesome tone pairs and distinguishes single-syllable from two-syllable difficulty.

## Worth adapting
### Context selection
A vocabulary item should reappear in sentences composed mostly of already-known material.

### Tone training
- train perception separately from production;
- let learners target confusable pairs;
- progress from isolated syllables to two-syllable words and natural phrases;
- use multiple voices later.

### Character discovery
Character origin/history can improve interest and memory when accurate and optional.

## Our improvement
Dong is feature-rich; our Foundation path should remain more guided and click-light. We should also make paper mode first-class.

---

# 5. Skritter

## What it proves
Skritter is the benchmark for Chinese handwriting practice:
- immediate stroke-level feedback;
- writing-form correction;
- stroke-order help;
- character decompositions;
- SRS;
- tone practice;
- browser handwriting.

Its SRS documentation contains an important product lesson: easy/new items are fast-tracked; small randomness prevents fixed review order; and Skritter explicitly warns against obsessing over mathematical precision.

## Worth adapting
### Handwriting UX
- give feedback at the stroke level;
- reveal hints only after misses;
- allow outline/scaffold removal;
- keep correction immediate and local to the stroke;
- separate practice/test behavior from long-term scheduling.

### Scheduling
- fast-track material that is repeatedly easy;
- avoid making the learner review known items merely because they are “in the deck”;
- small ordering variation is useful;
- do not expose complex SRS settings to ordinary learners.

## Do not inherit
- a writing/vocabulary-first product structure for our entire course.
- overly strict stroke grading; our goal is learning, not calligraphy.

## Technical opportunity
Rather than build stroke animation and quiz logic from scratch, evaluate **Hanzi Writer** as our Mandarin writing plugin.

---

# 6. Zishu

## What it proves
A beautiful Chinese-writing app can be:
- fully offline;
- no account;
- no analytics/tracking;
- export/import backup;
- spaced repetition;
- automatic stroke grading;
- radical meanings;
- adjustable iPad writing area.

It publicly states that it uses Make Me a Hanzi, CC-CEDICT and Unicode Unihan.

## Worth adapting
- privacy can be a product quality, not a limitation;
- backup/export should be simple and explicit;
- grading should be “fair” on placement/size but stricter on direction/hooks;
- writing area should adapt to device;
- struggle-based review is more useful than indiscriminate repetition.

## Our improvement
Embed writing into a full language curriculum and offer paper as an equal route.

---

# 7. Hanzi Writer + Make Me a Hanzi

## Why this matters technically
Hanzi Writer is an MIT-licensed JavaScript library for stroke-order animation and practice quizzes, supports Simplified and Traditional, and uses open stroke data derived from Make Me a Hanzi. It exposes callbacks for correct strokes, mistakes and completion, and can reveal hints after configurable misses.

Make Me a Hanzi provides graphical/stroke data for 9,000+ common Simplified and Traditional characters, with separate licensing for data sources.

## Recommendation
**Do not build V0.1 stroke matching from scratch. Prototype with Hanzi Writer.**

Wrap it behind a generic core writing contract:

`WritingExerciseAdapter`

Mandarin implementation:
`HanziWriterAdapter`

The core should receive generic events:
- strokeAccepted
- strokeRejected
- hintShown
- exerciseComplete

It should not know Hanzi.

## Offline requirement
Self-host the needed character data rather than depend on a CDN at runtime.

## Licensing
Review Hanzi Writer and its underlying data licenses carefully before public distribution; keep license notices in the source register.

---

# 8. Hack Chinese + Outlier

## What it proves
Deep character learning can be based on **functional components**, ancient forms, meaning trees, stroke order and active recall rather than folk etymology. Hack Chinese also offers reverse quizzing, precision word tracking, mastery states, printable worksheets and integrations with reading apps.

## Worth adapting
- character explanations should focus on functional sound/meaning components;
- distinguish recognition from production;
- “mastered” should emerge from delayed performance, not lesson completion;
- printable worksheets are useful;
- vocabulary should have one shared status across contexts.

## Critical legal boundary
Outlier’s content is proprietary; its terms prohibit republishing/copying. Use Outlier as a **methodological reference and QA source**, not as a content database.

## Our implementation
Create our own short explanations from independently verified academic/institutional sources. Keep:
- structure;
- historical claim;
- mnemonic
as separate fields.

---

# 9. Du Chinese

## What it proves
Reading can be made accessible through:
- graded texts;
- synchronized native audio;
- tap dictionary;
- Pinyin/translation on demand;
- grammar notes;
- SRS from encountered vocabulary;
- Simplified/Traditional;
- stories that make repetition meaningful.

Its flashcards distinguish “forgot”, “almost”, and “got it”, including partial knowledge such as meaning known but Pinyin forgotten.

## Worth adapting
### Progressive disclosure
Do not show every aid permanently. Let the learner reveal Pinyin, translation and dictionary support.

### Context memory
When reviewing a word, preserve the sentence/context where it was learned.

### Partial knowledge
This strongly supports our skill-specific progress model: knowing meaning is not the same as knowing pronunciation, reading or writing.

### Literature
Graded stories can become an important later layer of Foundation rather than a separate reading product.

## Our improvement
Bring graded micro-reading much earlier and connect it to speaking/writing rather than making reading the primary mode.

---

# 10. Pleco

## What it proves
Chinese learners value a high-quality lexical infrastructure:
- licensed dictionaries;
- handwriting lookup;
- native audio;
- stroke order;
- flashcards;
- document reading;
- OCR.

## Worth adapting
- one canonical lexical object should power dictionary, lesson, review and writing views;
- native audio variants per lexical item are useful;
- a dictionary/lexicon can become a platform layer later.

## Do not build now
OCR, giant dictionary marketplace, document reader. These are mature-product features, not Foundation V0.1.

---

# 11. Manda

## What it proves technically
Manda is a strong validation of our local-first web direction:
- browser-based;
- no account required;
- IndexedDB;
- optional sync;
- export;
- SRS;
- graded content;
- modern browser access.

It explicitly requests persistent browser storage and falls back from IndexedDB to localStorage/memory when needed.

## Worth adapting
- IndexedDB as primary persistence;
- `navigator.storage.persist()` request where appropriate;
- explicit export/backup;
- graceful storage fallback;
- optional sync only if users later demand it.

## Recommendation
This should directly influence our storage architecture.

---

# 12. Princeton 中文-Learn (open source)

## What it proves technically
This 2026 PWA uses:
- React + Vite;
- client-side architecture;
- PWA/service worker;
- GitHub Pages + GitHub Actions;
- local progress;
- Hanzi Writer;
- CC-CEDICT;
- SRS;
- handwriting;
- optional Firebase sync.

This is extremely close to our intended deployment mechanics.

## Worth adapting
- Vite build + GitHub Actions → static deploy;
- PWA installability;
- Hanzi Writer integration pattern;
- content/deck import/export ideas;
- offline-first local persistence.

## What not to copy
- LocalStorage as the main long-term data store; IndexedDB is better for our richer state.
- Firebase/account path in V0.1.
- games/streaks/AI-tutor scope.
- SM-2 merely because it is already implemented.

## Recommendation
Use the repo as an implementation reference when Codex builds our PWA, especially for PWA plumbing and Hanzi Writer integration.

---

# 13. Jiyi

## What it proves
Jiyi combines two of our technically difficult ambitions:
- offline handwriting recognition/stroke-order scoring;
- on-device tone/word pronunciation feedback;
plus SRS, Traditional/Simplified and offline dictionary.

## Worth adapting conceptually
- feedback should be syllable/stroke-specific rather than a single global score;
- pronunciation can be locally processed;
- story generation from known vocabulary is a plausible later feature.

## Caution
Public marketing claims do not reveal enough about validation quality to treat its pronunciation score as a scientific reference.

## Our difference
No streak/heatmap/AI-feature pile in Foundation V0.1. Our tone feedback should explicitly express uncertainty when signal quality is weak.

---

# 14. MandoFlow / modern FSRS-style products

## What it proves
MandoFlow combines comprehensible input, known-word tracking, personalized recommendations and FSRS; it supports Traditional/Simplified and is web-based.

## Worth adapting later
Once our review logs are rich enough, FSRS is a serious candidate for the **timing layer** of memory review.

## Important boundary
FSRS schedules memory items. It does not solve our multimodal pedagogy:
- listening vs speaking vs writing;
- scaffolding;
- sentence/context selection;
- tone remediation.

Therefore:
**FSRS may later schedule skill-specific review objects; it should not become the Lesson Engine.**

---

# 15. Scheduling decision after benchmark

## V0.1
Keep our transparent stability bands and simple intervals.

## Later
Evaluate `ts-fsrs` for the temporal scheduling subproblem after we have real review data.

Potential mapping:
- each `(itemId, skillDimension)` can own a scheduler state;
- session composer then combines due FSRS items with curriculum/new/transfer material.

Do not use one card state for the whole word if skills differ.

---

# 16. Concrete changes to our build plan

## Adopt now

### A. Hanzi Writer prototype
Use it for:
- stroke-order animation;
- guided quiz;
- hints after mistakes;
- Traditional/Simplified character data.

Do not build custom stroke recognition in V0.1 unless Hanzi Writer fails our UX.

### B. Manda-style storage hardening
Use:
- IndexedDB;
- persistent-storage request;
- export/import;
- fallback behavior.

### C. Dong-style tone progression
Tone training path:
1. isolated contrast;
2. selected confusing pairs;
3. two-syllable combinations;
4. phrase-level natural speech;
5. production feedback.

### D. Du Chinese-style progressive help
Pinyin/translation/grammar support:
- available;
- not permanently visible;
- remembered per learner where useful.

### E. Skritter-style easy-item fast track
If repeated delayed independent retrieval succeeds, get the item out of the way.

### F. Hack/Outlier methodological separation
Character note fields:
- functional structure;
- historical evidence;
- mnemonic.

### G. SuperChinese lesson close
End meaningful units with a small practical interaction/application, not a quiz score.

---

# 17. Adopt later

- FSRS timing engine after real logs;
- graded micro-stories/reading library;
- multiple native speakers per item;
- comprehensible media recommendations;
- optional dictionary/browse layer;
- photo worksheet analysis/OCR;
- optional local AI sentence variation constrained to known vocabulary.

---

# 18. Explicitly reject for our product

- streak pressure;
- XP/coins/hearts;
- game map as curriculum;
- AI-generated core curriculum;
- opaque pronunciation percentage as authority;
- one global “word mastered” state;
- mandatory accounts;
- feature-dashboard home screen;
- permanent Pinyin;
- folk etymology presented as fact;
- copying commercial lesson text, UI, audio or proprietary character explanations.

---

# 19. Our actual differentiation after benchmarking

Our defensible distinction is not a unique feature. It is the **system design**:

1. evidence-based controlled Foundation curriculum;
2. skill-specific adaptation;
3. listening/speaking priority without sacrificing literacy;
4. accurate character structure/history used sparingly;
5. digital handwriting **and paper** as equal learning paths;
6. optional literature/proverbs/culture from the beginning;
7. calm editorial UX without gamification;
8. local-first, no-account PWA;
9. transparent uncertainty in pronunciation feedback;
10. language-agnostic platform core.

The market has strong pieces of all ten. The reviewed set did not reveal one product that combines them coherently.

---

# 20. Technical shortlist for implementation

**Strongly evaluate**
- Hanzi Writer — writing/stroke interaction
- Make Me a Hanzi / Hanzi Writer data — stroke assets (license review required)
- IndexedDB/Dexie — local state
- `navigator.storage.persist()` — storage durability
- `ts-fsrs` — later scheduler candidate
- CC-CEDICT / Unihan — lexical cross-check/data, subject to licensing policy

**Reference implementations**
- Princeton 中文-Learn — PWA/deploy/Hanzi Writer integration
- Manda — local-first persistence/export architecture

**Method references, not reusable content**
- Outlier
- Hack Chinese
- Dong Chinese
- HelloChinese
- SuperChinese
- Skritter
- Du Chinese
- Jiyi

