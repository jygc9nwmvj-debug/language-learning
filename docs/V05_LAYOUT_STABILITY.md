# v0.5 — bounded layout stability correction

Base: main db551bd. Before edits, the rebuilt service worker matched production byte-for-byte (mandarin-v01-eac5c8c4dfd6669e).

- Opening a phrase chunk no longer changes Hanzi/Pinyin size, spacing, wrapping or selected-button geometry. Character details also retain their parent title size.
- Text-response prompts share the existing 34rem answer width and a smaller local gap. Other learning surfaces retain their spacing.
- Correction keeps learner answer, existing feedback, target phrase and reference audio together. Optional chunk details appear below the correction reference instead of pushing its audio away.
- Completion condensation, hidden completed Skip, Continue, single selected detail, existing content, callbacks and audio assets are unchanged. No recording changes.

Validation: production build (including existing content validation and TypeScript), eight existing audio-availability UI tests, three new geometry checks at 320/390/1280px, and three existing targeted recall/stimulus/disclosure UI checks passed in Chromium. Screenshots inspected at 320 and 390px. A remaining 320px expanded-spacing override was caught by the new test and removed before the final pass. No broad regression or recording QA; no Safari app access.

These checks establish layout/interaction behavior, not measured learning benefit.
