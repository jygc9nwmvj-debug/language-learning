# Build C — Interaction & Flow

2026-09-27. Normal app: https://language-learning-abk.pages.dev/ · Testversion C.
Scope: existing Mandarin content only, following the user's Build C brief and atomic-transition follow-up.

## 1. Audit findings

Encounter presented equally prominent reference/record/continue controls and a separate reveal click.
Reading left a completed form as the main surface. Recording required Stop then a separate Play.
Large spacing/control sizes made short mobile tasks unnecessarily tall. Navigation exposed internal
Lesson/test terminology. Offline readiness meant an active service worker existed, not that its current
code/audio cache was complete; a failed preparation had no clear retry.

The reported disabled-audio transition had two concrete causes: Next was available during capture and
finalization; AudioButton sampled the global capture flag before subscribing, so old-recorder cleanup
could release it in the gap and leave a newly mounted button permanently blocked.

## 2. Existing patterns consulted

- [Busuu speaking practice](https://help.busuu.com/hc/en-us/articles/19367617005970-Mastering-language-skills-through-speaking-practice): reference → own recording → comparison/retry. Reused that compact structure, not its scoring or attempt limits.
- [Duolingo speaking practice](https://blog.duolingo.com/covering-all-the-bases-duolingos-approach-to-speaking-skills/): short speaking opportunities within a learning flow. No gamification or speech recognition copied.
- [MDN play()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play): handle rejected autoplay explicitly; a request to play is not proof it played.
- [MDN serviceWorker.ready](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready): active registration is not asset-cache verification and the promise can wait indefinitely.

## 3. Two progressive sequence types

**Encounter:** Hanzi → reference playback also reveals pronunciation/meaning → speaking condenses the
reference in place → finalized own recording plays once → replay, retake or Continue. Manual reveal
remains available; microphone use is optional. Names remain editable before recording.

**Read a character:** submit the existing meaning answer → retain the exact learner response in a small
summary with feedback → reveal pronunciation/reference and optional recording in the same object.
No recording is recorded as pronunciation success. Explicit Continue preserves time to read feedback.
The same component handles the existing items, not a single hard-coded 好 example.

## 4. Reusable primitives and atomic transitions

`SpeakingPractice` composes reference, compact audio, recorder and final decision. `InteractionScope`
is a small synchronous ownership guard, not a curriculum engine. Recording acquires a lock before
requesting microphone permission; it spans preparation, final chunks, decoding and automatic own
playback. Pause/end/error/autoplay rejection release it; unmount cancels late work. Continue and Skip
cannot mutate the session while locked. Conversely, the existing synchronous DB mutation lock prevents
new capture during save/advance. Saving the next session remains one DB transaction before rendering it.

`useSyncExternalStore` replaces the capture flag's render/effect subscription gap. New reference buttons
resynchronize at mount, including when prior-recorder cleanup releases capture. Keyed exercise instances
reset local state on object change. Pause remains an intentional exit and releases media resources.
Reference replay itself may be interrupted by navigation; its audio is stopped on unmount. Own playback
can be paused or replaced with reference playback, after which Continue becomes available.

## 5. Click economy

Removed the extra meaning-reveal click after reference playback and the extra Play after recording Stop.
After a reading answer, reference/speaking appears directly rather than requiring another page/action.
Prüfen disappears after save; the user's actual answer remains. Submit, retry and final Continue remain
where they represent a decision. Build B's automatic scaffold progression was preserved.

## 6–10. Visual and audio interaction decisions

- Primary: record/check/continue learning. Secondary: retry/final Continue before a recording. Utility: compact reference playback, slower playback and reveal. No equal-weight wall of large buttons.
- Own recording has an explicit “Deine Aufnahme” label, native replay and retake. Exactly one automatic play attempt per new finalized blob; browser rejection leaves manual playback and permits continuing. A hidden page does not start automatic playback. No time-stretching, new audio or scoring.
- Semantic ink/surface pairs: success `#285c40/#eef5ee`, error `#963e30/#fff1ed`, attention `#79521c/#fff6e7`. Meaning remains written in feedback, never color alone. Missing tone notation receives attention, not a claim about spoken tones.
- Existing system UI and Chinese fonts retained; handwriting reference untouched. Hanzi, Pinyin, German meaning and instruction have distinct size/color/spacing. Completed reference condenses while context stays visible.
- Smaller mobile padding and utilities, no nested scrolling. Representative widths 390 and 320 px; short reading/speaking state fits naturally at 390×844. Longer material may scroll.
- Only a 140 ms content fade and preparation activity indicator; reduced-motion disables them.

## 11. Offline behavior

Ready now requires a reply from the active worker confirming every expected build asset exists in its
cache. Preparation includes code, reference audio, fonts/character data and other shipped files. A
failed install deletes its incomplete cache. Failure/timeouts show an explicit retry; retry asks the
worker to fetch the expected assets again and recheck. No fake percentage. Existing old-tab retention
and IndexedDB learner storage are preserved. Ready describes current cache availability, not a promise
that the operating system will never evict browser data.

## 12. Navigation

Start uses Weiterlernen. Normal navigation no longer says Lesson 1 or “vollständig erneut testen”.
Voluntary Weiterüben/Bisherige Inhalte wiederholen remains an honest repeat of existing content with
history retained. This is not an adaptive or continuous-learning engine. Developer harness is unchanged.

## 13–16. Verification, delivery and limits

The existing domain suite was run once: **37/37 passed**. Production compilation/content validation passed.
A1's exhaustive browser acceptance, A2 audio-quality hearing/pitch tests and B's handwriting matrix were
deliberately not repeated. No content, audio assets, handwriting engine, sync or research system changed.

Normal app: https://language-learning-abk.pages.dev/ . Next evaluation is ordinary learning, without
another large acceptance checklist. Human use should judge pacing, compactness, visual hierarchy and
whether immediate own-playback feels helpful. Browser automation checks transition correctness with
controlled capture fixtures; it does not prove microphone fidelity or every physical iPhone's autoplay policy.

### Focused results

- Chrome + WebKit: four flow cases each, all passing after correcting test synchronization/labels: synchronous advance/capture races in both directions; locks through finalization and own playback; rejected autoplay; late permission after exit; compact reading → next object.
- Chrome + WebKit: three offline cases each passed: Cloudflare-style root redirect/offline reopen, old-worker update with two tabs and IndexedDB preservation, deliberately missing audio cache entry and successful retry.
- Existing final-chunk/stream-release test passed in both browsers; recorded bytes match the fixture. Total: **16 focused browser cases passing across the runs**. The initial test failures were wrong selectors and releasing a mocked permission before the asynchronous exit had actually completed; corrected without weakening assertions.
- Viewed the 390×844 reading/speaking screenshot; no horizontal overflow at 390 or 320 px. Contrast ratios: success 7.02:1, error 6.29:1, attention 6.45:1; utility/Pinyin/muted text ≥5.98:1 on the light surface. No full visual regression suite.
- `git diff --check` passed. Accepted audio bytes verified by the existing domain test; no audio production/quality work performed. Older smoke-test selectors were aligned with renamed UI and condensed answers without rerunning their exhaustive suites.

Deployment authorization: the user's Build C brief, section 19, explicitly requests deployment into the NORMAL app after proportional internal testing.
