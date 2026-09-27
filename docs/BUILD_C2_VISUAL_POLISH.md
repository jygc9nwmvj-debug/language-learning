# Build C2 — Visual polish / control reduction

2026-09-27. UI-only refinement on the already shipped Build D. The original C2 brief's pre-D assumption was stale: D content and continuous-learning behavior remain intact. Normal app version: **C2 · Inhalte D**.

## Changes

- One small geometric SVG transport vocabulary: play, pause, stop, replay, microphone and close. No icon dependency or mixed emoji.
- Reference playback is a 44px-minimum Play control; careful-slow is Play + “langsam”. Existing asset selection and playback behavior are unchanged.
- Recording uses microphone + short label; active capture uses a contrasting Stop control plus the existing explicit recording status.
- The recording blob still uses an HTML audio element, now hidden. The visible controls provide automatic playback, pause, replay from the beginning and retake. Retake is available after playback stops/pauses. Existing capture readiness, chunk handling, finalization and interaction locks are unchanged.
- Privacy/self-comparison explanation remains in an accessible “Zur Aufnahme” disclosure. Duplicate persistent tone-recording disclaimer removed; the disclosure still says no automatic assessment. Autoplay failures and capture errors remain visible.
- Quiet utilities, tinted recording/secondary actions, dark-green completed next action; disabled Weiter has no filled rectangle. Header end-session action is a quiet close + Pause control, with its full accessible name.
- Active non-writing learning surfaces lose their outer card border/background. Start card and writing surface retain their structure.
- Four tones share compact divider-separated rows with prominent Pinyin, Hanzi/meaning and individually named playback. Existing reveal gate is preserved. Full-contour/connected-speech explanation remains in a disclosure.
- Tone choices are lighter but retain comfortable targets. Selection has pressed state and a stronger border; outcome remains explicit text with restrained semantic color.
- Existing fonts and palette retained; spacing and heading prominence reduced. Language remains strongest. No content, audio bytes/pipeline, scheduler or writing-pedagogy changes.

## Verification

- `npm test`: 52/52 passed, run once.
- `npm run build`: successful; content/audio validator included (44 words, 36 items, 130 tasks, 76 production references).
- Focused Playwright checks in Chrome and WebKit: three scenarios per browser passed: recording autoplay/pause/replay/retake and next-step lock; tone comparison/selection/feedback and keyboard/touch controls; blocked autoplay followed by manual replay.
- Initial keyboard-focus assertion used programmatic focus after pointer input, so correctly did not trigger `:focus-visible`. Test corrected to enter keyboard modality first; no product workaround added. Only affected/new cases rerun.
- Visual inspection: home, 你好, recording playback, tone intro/quiz. Tone comparison checked at 390 and 320px; no horizontal overflow; transport/answer controls at least 44×44px. No nested scrolling added. Named controls, visible keyboard focus, text feedback and pressed selection avoid color-only state.
- 390px tone quiz capture reduced from approximately 1,294px to 870px tall. This is a representative snapshot, not a fixed layout requirement.

## Limits

Browser recording smoke tests use deterministic audio fixtures; they verify the changed controls and existing locks, not real microphone fidelity or physical iPhone behavior. No new listening study, handwriting matrix or broad regression suite was run. Human everyday use remains the visual acceptance test.

Deployment target: https://language-learning-abk.pages.dev/ . No separate learner harness.
