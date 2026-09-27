# V0.1 Technical Specification

## 1. Product boundary

V0.1 is a **language-agnostic, local-first Progressive Web App** with one complete Mandarin lesson as a vertical slice.

The goal is not to build the whole course. The goal is to prove that the platform can deliver one evidence-based lesson across modern browsers with:

- offline use after initial load
- no account
- no backend dependency
- local learning progress
- audio playback and microphone capture
- local pitch analysis
- handwriting by pen or finger
- first-class paper/worksheet mode
- Traditional / Simplified display
- adaptive replay of the lesson

## 2. Architecture rule

**Core is language-agnostic. Language packs provide language-specific knowledge.**

The core must never contain assumptions such as:
- words have tones
- writing uses Hanzi
- a language has Traditional/Simplified variants
- writing is stroke-based
- pronunciation uses Pinyin

Those belong to `languages/mandarin`.

## 3. Layers

### Core
Responsible for:
- lesson/session orchestration
- exercise registry
- skill-state model
- review scheduling
- local persistence
- offline asset handling
- microphone capture
- generic audio playback
- generic drawing input
- paper-mode workflow
- responsive UI shell

### Language Pack
Mandarin provides:
- lexicon
- sentences
- character forms
- Pinyin
- lexical tones
- tone-specific exercises
- Hanzi component metadata
- stroke-order assets/data
- Traditional/Simplified variants
- Mandarin pronunciation rules
- Mandarin worksheet rendering additions

### Content
Content is data, not UI code.

A lesson references content IDs and exercise types. It does not hard-code screens.

## 4. V0.1 stack

- React
- TypeScript
- Vite
- Zod for runtime content validation
- IndexedDB via Dexie for local progress
- Canvas + Pointer Events for writing
- Web Audio API / AudioWorklet for pitch extraction
- Service Worker + Web App Manifest for PWA/offline

No server framework. No user database. No analytics SDK.

## 5. Browser strategy

### Must work
Current versions of:
- Safari on iPadOS / iOS
- Chrome on Android
- Chrome / Edge desktop
- Safari desktop
- Firefox desktop

### Progressive enhancement
The lesson must remain completable when an optional capability is absent.

Examples:
- no pen: finger writing or paper mode
- no pressure data: ignore pressure
- pitch analysis unavailable: record/replay remains available and exercise can fall back to self-comparison
- print unavailable: browser print stylesheet / downloadable worksheet view

The lowest common denominator must not dictate the whole experience.

## 6. Persistence

### Same device
Automatically persist to IndexedDB:
- curriculum position
- item/skill state
- review due dates
- lesson/session state
- user preferences
- script choice
- optional display name

### Cross-device without account
Two layers:

1. **Checkpoint code**
   - short anonymous code
   - reconstructs coarse curriculum position/settings only
   - does not claim to reproduce full adaptive history

2. **Full backup**
   - export/import a compact local file
   - later optionally QR for small states
   - contains full skill state and review data

No backend is required for either V0.1 mechanism.

## 7. Skill model

Core skill dimensions are generic:

- meaning
- listening
- speaking
- reading
- writing
- usage

Each content item can opt into only the dimensions that make sense.

State:
- unseen
- introduced
- assisted_success
- unassisted_success
- shaky
- due_for_review

Do not expose this complexity directly in the main UI.

## 8. Lesson engine

A lesson declares:
- learning objectives
- new content IDs
- review pools
- exercise sequence constraints
- optional discoveries
- exit checks

The engine chooses concrete prompts based on progress.

**Lesson != immutable slideshow.**

The same lesson can be replayed with:
- different prompt order
- different retrieval direction
- less scaffolding
- more review of weak items
- different speaker audio when available

## 9. Exercise registry

V0.1 generic exercise types:

- listen_reveal
- listen_choose
- listen_recall
- speak_repeat
- speak_recall
- read_recognize
- write_guided
- write_recall
- dialogue_turn
- explanation
- discovery
- recall_check
- paper_write

Mandarin-specific:
- tone_discrimination
- tone_production
- hanzi_component_discovery

The core renders registered exercise contracts; language modules may register extensions.

## 10. Audio architecture

Audio for released lessons is stored as static assets.

Pipeline:
1. text/source checked
2. audio generated or recorded
3. pronunciation QA
4. file normalized
5. committed to content pack
6. served and cached offline

Runtime TTS is not required for V0.1.

Microphone input is processed locally.

## 11. Pitch analysis V0.1

V0.1 should prove:
- voiced-region detection
- F0 extraction
- normalized pitch contour
- basic comparison against expected contour / reference
- visual feedback

It must **not** pretend to provide a general pronunciation score.

Prefer feedback such as:
- rising contour too flat
- fall began late
- pitch contour resembles another target more closely

Whole-sentence tone assessment remains out of scope until validated.

## 12. Writing V0.1

### On-screen
Capture:
- pointer type
- x/y
- timestamps
- pressure when available
- stroke segmentation

Evaluate only what can be done robustly:
- stroke count
- rough stroke order
- coarse geometry / bounding relations

Avoid beauty scores.

### Paper mode
Every writing task can switch to:
- show/print worksheet
- write physically
- reveal stroke order/reference
- self-rate: secure / unsure / retry

Photo analysis is out of scope.

## 13. Worksheets

Worksheets are generated from the same content model.

A generic worksheet template receives:
- target glyph
- pronunciation
- meaning
- stroke-order asset
- trace boxes
- free-writing boxes
- recall prompts
- optional QR/link to audio

No separately maintained PDF curriculum.

## 14. Offline

After first successful lesson download:
- app shell cached
- Lesson 1 content cached
- Lesson 1 audio cached
- worksheet rendering available
- progress local

Acceptance test:
**airplane mode -> reopen -> complete Lesson 1.**

## 15. Privacy

V0.1:
- no account
- no advertising
- no analytics
- no tracking cookies
- no server-side learner data
- no audio upload
- no handwriting upload

Any future sync must be optional.

## 16. Accessibility

- semantic HTML
- keyboard navigation for non-writing controls
- usable without audio-only cues where inappropriate
- text scaling
- sufficient target sizes
- reduced-motion respect
- paper mode as alternative motor path
- no learning-essential distinction based only on color

## 17. Content QA

Content lifecycle:
`draft -> source_checked -> language_reviewed -> audio_reviewed -> published`

The app may ship prototype material at `source_checked` internally, but public release should require human language/audio review.

## 18. V0.1 acceptance criteria

A single deployed URL must allow a first-time learner to:

1. choose Traditional or Simplified
2. start Lesson 1
3. hear static Mandarin audio
4. grant microphone permission and record
5. see a local pitch contour
6. complete a basic tone exercise
7. write 我 / 你 / 好 by touch/pen or choose paper mode
8. complete the name mini-dialogue
9. finish an unassisted recall section
10. close/reopen and retain progress
11. replay Lesson 1 with changed scaffolding/order
12. complete the lesson offline after initial caching

## 19. Explicit non-goals

Not V0.1:
- accounts
- cloud sync
- general speech recognition
- generative AI at runtime
- handwriting OCR
- photo worksheet analysis
- HSK integration
- multiple languages in UI
- automatic free conversation
- production-grade SRS optimization

## 20. Architectural future-proofing

The platform may later host other languages.

A new language should primarily add:
- language metadata
- lexicon/curriculum
- audio
- language-specific exercise plugins only where necessary

Romanian, for example, should reuse the same lesson/progress/audio/review core but provide morphology, stress and alphabetic pronunciation modules instead of Mandarin tones/Hanzi.
