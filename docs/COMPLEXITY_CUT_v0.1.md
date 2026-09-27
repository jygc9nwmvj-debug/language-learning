# V0.1 Complexity Cut — implementation boundary

Consolidated from the later decisions in “Kostenlose Chinesisch Apps” (2026-09-26).
This narrows the older Master/Handoff implementation detail; it does not broaden curriculum.

## Build now

One Lesson 1. Authored content, static audio with replay and a separately synthesized slow variant,
retrieval, simple spacing, Pinyin help, specific feedback, minimal per-relation state, Hanzi Writer
for 好, a small tone-awareness exercise, IndexedDB, local research export, paper and offline PWA.
Private test interface: German, with semantic UI keys and separately localized content fields.

## Keep in reserve

Novelty budgets, complex session orchestration, feedback ladders, component graphs/exercises,
progressively Chinese UI, multiple speakers, complex transfer assessment, personalization and
full learning-object taxonomy. Do not build these until a concrete observed problem needs them.

## Later

FSRS, accounts/sync, elaborate automatic tone scoring, OCR, generated curriculum, other languages,
dictionary and community. No Lesson 2 before the first loop and delayed recall are evaluated.

## Development rule

Observe a problem → improve the simple existing solution → inspect existing solutions → simplify
where possible → only then add a new mechanism.

The first learner tests usability and learning behavior, not population-level effectiveness.
