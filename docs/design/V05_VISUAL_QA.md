# v0.5 visual QA — 2026-09-29

Base: remote `main` at `09a24596abba11f4aa86bc30f4c1fbe3b60d0fda`.
Working branch: `v05-visual-redesign`. Local preview: <http://127.0.0.1:4285/>.
No push or deployment. The original Desktop checkout and its unrelated uncommitted work were left untouched.

## Protected behavior

The only production-file diffs are `app.css`, the displayed version in `LessonRunner`, presentation data attributes in `AudioButton` and `PhraseForm`, and palette resolution in `WritingExercise`. Content, media files, dependencies, scheduling, mastery, assessment, assistance/event handlers, recorder implementation, writing geometry and progression are unchanged. Writer alpha values and timing are retained.

The production build includes content validation and TypeScript checking. Existing unit tests were run unchanged. The existing browser suite was started unchanged and stopped on the user’s explicit instruction to end broad regression/audio QA; the existing harness had already finished. Completed results and failures are reported below rather than silently weakening assertions or changing learning behavior to match old fixtures. A separate untouched checkout of the pinned main was used for comparison.

## Visual/state coverage

- Home at 320/390/768/1280px; settings, script selection, reset disclosure and native file input at 320px. Fixed one actual narrow-screen overflow in the file-input/settings intrinsic sizing.
- Introduction audio/tone/Hanzi/connection, authored phrase expansion and collapse, long multi-chunk phrase, both scripts, existing previous-item inspection.
- Recall input, hidden/revealed assistance, resolved answer and feedback; screenless recall and paper recall.
- Tone comparison and choices; recording, replay, pause, retake, disabled next action, autoplay rejection and reference availability on the next object.
- Writing at 320px: wrong shape, visible outline help, accepted real path geometry, six-stroke completion and unchanged assistance/error evidence. Existing writing progression and touch tests are included in the broader suites.
- Keyboard focus and semantic button names; 44px targets in the tested learning surfaces; Reduced Motion disables presentation transitions and reveal animations. Existing instructional stroke demonstrations are intentionally retained.
- Print-only worksheet visibility and A4-sized viewport; fixed worksheet content/layout retained. No physical print test.
- Token text colors on paper and primary-button text meet 4.5:1. Disabled controls and writing scaffold/grid colors are not body-text contrast assertions.

Screenshots are retained in the ignored `work/` directory (prefixes `v05-`, `ui1-`, `attention-`, `c23-`, `e-`). They were visually inspected across all five archetypes. Automated contexts use isolated test state; microphone fixtures are synthetic, not recordings of the user.

## Real-device / learner acceptance still needed

Comfort of spacing and scrolling during a longer learning session, first-use discoverability of quieter controls, real iPhone/Safari software-keyboard behavior, finger/stylus writing and the physical microphone/permission experience cannot be certified from desktop automation. The existing text and guidance density is preserved; assessing its learning value is not part of this visual-only change.

## Results and final proportionality correction

- Existing unit suite: **84 passed**.
- Final production build, content validator and TypeScript: **passed**.
- Earlier broad browser run: **80 passed, 66 failed, 1 interrupted, 2 not run**. It was stopped on the user’s explicit request; it is not reported as a completed or green suite.
- All **140 completed existing browser cases** have the same pass/fail outcome on the unchanged pinned main; the additional six focused visual/writing checks passed. The untouched baseline had 74 passes and 69 failures overall. Equal outcomes do not prove that existing behavior is bug-free.
- Existing harness (already finished before the stop instruction): **7 passed, 6 failed, 1 skipped**. All six writing failures also occur on untouched main after successful stroke/fading checks, waiting for the obsolete automatic `finished` event. The skipped case requires Chromium CDP touch injection and is explicitly skipped in WebKit by the existing test.
- No further audio-reliability, recorder or broad regression run was started after the user’s correction.

Old failures include introduction/DOM assumptions, former round-completion screens, name/recorder fixtures and legacy hosting expectations. `flow-lite` stops earlier on the redesign at its old solid-green recording-button assertion; the transparent treatment is intentional, and the same case already fails on main at a later immediate-Hanzi assertion. Neither learning behavior nor old assertions were changed to force these tests green.

The final visual sharpening happened after the broad run: a desktop editorial spread, larger Hanzi/prompt typography, terracotta learning-state labels, blue Pinyin/audio affordances, and a text/arrow continuation control. It received only a build and focused visual checks of the affected surfaces, not another broad regression. The arrow is a decorative CSS shape, so it does not change the button’s accessible name.

Logs and completed-case comparison are retained in ignored `work/qa/`. Earlier diagnostic/partial runs are not counted as additional successful tests.

Final focused visual pass: **6/6 passed** (Chrome and WebKit). Covers home/settings at 320/390/768/1280px, script selection, reset disclosure, print, focus/target sizes/contrast, Reduced Motion, phrase expansion/collapse, recall/feedback, writing controls and long phrases at narrow widths. No capture/reliability test was included. Final whitespace check passed.
