# v0.5 visual redesign — working preview

Base: remote main `09a24596abba11f4aa86bc30f4c1fbe3b60d0fda`.
Scope: existing production surfaces only. No deployment; no new content or learning mechanics.

## System

Existing brand green **#294b3c** retained. Warm paper **#f7f5ef**, ink **#202d27**, muted ink **#59665f**, blue **#285e80**, terracotta **#a84437**. Blue carries confirmations and active listening; green is brand/action, not a universal correctness signal. Existing system and Songti font stacks retained. Central spacing, typography, motion, control, semantic color and handwriting tokens in `app.css`.

Home becomes a two-column editorial spread from 960px, with a large green Hanzi anchor and a separate reading/action column; mobile keeps a single reading order. Settings are open editorial surfaces; primary learning action stays explicit. Script selection uses an underline rather than pills; reset is separated and terracotta. Continuous learning remains the existing single surface, including previous-item inspection, loading and failed transitions. Version label identifies the local v0.5 build.

Introductions keep hear → tone → Hanzi → connection and all pre-existing prerequisite decisions. Authored phrases begin tightly grouped; selecting an existing chunk increases spacing and shows its existing detail region. Escape/outside/close return to the whole. No new click, segmentation, gloss or audio content.

Hanzi typography reaches 96px in phrases and 176px in focused character views; the desktop greeting can reach 208px. Terracotta marks the learning-state caption, blue carries phonetic notation and audio controls, and dark ink anchors meaning. Recall retains the existing input, help and answer summary, now with common open feedback. Tone comparison retains the deliberately denser four-row comparison. Reference controls are normal-sized touch targets; slow audio is secondary by color, not smaller geometry. Speaking keeps its reference/recording separation; continuation is a quiet text-and-arrow control with the same phase-dependent availability. Recording states use existing state attributes; no media handlers changed.

Writing retains 320px maximum geometry, padding, pointer processing, outline opacity levels, timing, hinting, progression and raw learner paths. The JS color bridge reads central CSS palette tokens because Hanzi Writer requires concrete color values; learner SVG uses variables. Paper modes and the fixed A4 worksheet keep their established content and print-specific layout.

## Explicit boundaries

- No new first-stage whole-phrase reveal: it would add a learning action and change established introduction/help semantics. The whole/chunk distinction is visual within current authored units.
- No new icon-only controls for ambiguous actions. First recording and writing hints retain understandable labels.
- No motion added between tasks or any new automatic transition. UI reveal/unfold motion obeys Reduced Motion; existing pedagogical stroke animation is retained as required, rather than silently removing the writing demonstration.
- Existing fixed worksheet stays fixed. No cultural/poetic, conversation or English-UI feature added.
- Development harness remains functional, inherits shared styling, and retains its technical layout.

## Verification

See the accompanying QA record for actual test outcomes and limits. Protected content, scheduler, mastery, assessment, recorder handlers, event callbacks and introduction sequence are unchanged against the pinned base. Changes are CSS, two presentation-only data attributes, palette resolution in the writer, and the visible version label. No dependency added.
