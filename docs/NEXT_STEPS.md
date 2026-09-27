# NEXT STEPS — Ready to Build

**Status:** READY FOR REAL-DEVICE V0.1 BUILD

## At the Mac
1. Clone `https://github.com/jygc9nwmvj-debug/language-learning.git`.
2. Put the prepared project into the repo; GitHub becomes code/document SSOT.
3. Install current Node LTS if needed; run `npm install`, `npm run dev`.
4. Resolve package/build drift and commit the actual lockfile. Do not blindly trust scaffold version guesses made without a successful online npm install.
5. Implement in order:
   1. content schema + validator
   2. lesson runner
   3. local progress
   4. generic orthography preference (`hant`/`hans` supplied by Mandarin)
   5. static audio playback
   6. writing canvas + paper mode
   7. microphone capture
   8. generic pitch extraction
   9. Mandarin tone-lab interpretation with confidence/fallback
   10. adaptive replay/scaffolding
   11. PWA/offline
   12. worksheet generator
6. Connect `main` to HTTPS static deployment with automatic deploy and no analytics by default.
7. Test: iPad Safari/Pencil → iPhone Safari/finger → Android Chrome → desktop browsers.
8. Learn Lesson 1 for real; note clarity, duration, Pinyin dependence, tone-feedback credibility, writing friction, paper mode and next-day recall.
9. Fix architecture before implementing Lesson 2.

## Do NOT do next
No Lessons 4–12, accounts, backend sync, error-report backend, general speech recognition, handwriting OCR, runtime AI lessons, sophisticated SRS optimization, final branding, or Romanian.

## Decision hierarchy
1. learning correctness
2. clarity/ease
3. privacy/offline robustness
4. accessibility/cross-platform
5. maintainable language-agnostic architecture
6. visual elegance
7. novelty/features

## Authoritative docs
1. MANDARIN_APP_MASTER.md
2. PRE_BUILD_AUDIT_v0.1.md
3. V0_1_TECH_SPEC.md
4. CONTENT_SCHEMA.md
5. ADAPTIVE_ENGINE_v0.1.md
6. CONTENT_QA_SOURCE_POLICY_v0.1.md
7. DESIGN_SYSTEM_v0.1.md
8. LESSON_01_PRODUCTION_MAP_v0.2.md
9. LESSON_01_FLOW_v0.1.md
10. CORE_LANGUAGE_BOUNDARY_AUDIT_v0.1.md

Later/more-specific wins if an older doc conflicts, until Master is reconciled.

## First success milestone
One URL → complete Lesson 1 on a real device → close → reopen offline → receive a meaningfully adapted continuation/review → no account.
