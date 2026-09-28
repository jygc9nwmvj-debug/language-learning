# C2.2 — Visual Hierarchy & Attention pilot

2026-09-28. Built on deployed C2.1 and D. D's 28 added objects, canonical language data, audio files, continuous scheduler and writing system are unchanged.

## Exact scope and sequence

The progressive introduction is configured only for **你好 (recognition)** and **好 (existing writing target)**. It occupies one existing learning surface, not a sequence of pages.

1. Hear: natural reference attempts playback once. Hanzi, Pinyin, translation and recording are not yet shown. On audio end, tone focus appears. Manual Play remains after an autoplay failure; “Schrift ohne Warten ansehen” permits immediate progress without a forced delay.
2. Tone focus: enlarged Pinyin, accented/underlined marked vowels and explicit numbered tone labels. A short note distinguishes lexical notation from connected pronunciation for 你好 and the full isolated third-tone contour from contextual realization for 好. “Schriftbild ansehen” acknowledges this introduction.
3. Hanzi focus: isolated large Hanzi; Pinyin, translation and audio controls recede. Reference playback stops on entering this stage. A small note distinguishes recognition from the existing writing target. “Bedeutung dazunehmen” acknowledges viewing the form.
4. Connection: Hanzi, supporting Pinyin and meaning join the same surface. Existing optional record → Stop → automatic own playback → replay/retake/Continue behavior is reused unchanged.

With successful autoplay, the two focus acknowledgements plus the existing final Continue require **three taps**. Recording adds Record and Stop, not another playback tap. There are no mandatory animations, dwell timers, automatic microphone starts or automatic next-item navigation. Manual autoplay fallback or skipping the audio adds an optional tap.

## Evidence and fairness

`tone_attention_confirmed` is saved only after the explicit tone-focus acknowledgement succeeds. It records item identity, exact canonical tone numbers and attention version; the pilot also records script, form, role and whether reference playback began. This is evidence of a teaching opportunity plus learner acknowledgement, **not proof of attention, comprehension or correct speech**.

`item_attention_completed` additionally records the acknowledged script/form. Re-entering an acknowledged item uses the existing compact encounter; read/recall tasks otherwise retain their normal shape. A pilot reading task without the introduction uses the same teaching surface rather than immediately grading unseen form.

In normal production recall, tone notation is assessed only if declared by the task, the number-notation introduction has occurred and matching item-specific tone attention is recorded. Old `pinyin_reveal`, generic completion or ordinary audio events are insufficient. Without evidence, the expression is assessed and the UI explicitly says tone notation is not yet graded. Speech remains unknown. Existing isolated tone-recall tasks without item evidence become an ungraded tone introduction instead of a quiz. The developer interpreter harness keeps its direct declared-assessment behavior for diagnostics.

Before the pilot's connection stage, playback logs use attention-specific event names, so D does not mistake hearing alone for an introduced word/meaning. At connection the existing reveal event is recorded. **No scheduler change.** Save failure keeps the current focus available for retry, without optimistic acknowledgement.

## Existing C2 presentation retained

Compact transport icons, custom own-recording controls, disclosure privacy note and open learning surfaces remain. Tone Lab keeps compact rows. The currently played row gains restrained emphasis; all four examples must have been played before the first quiz is exposed. Previously completed Tone Lab does not require that initial pass again. Tone-number introduction gets an explicit event after the correct practical entry.

No phrase-wide Hanzi/Pinyin alignment, tappable Hanzi, glosses, previous-item navigation, post-success writing repetition, new content or broad redesign was implemented.

## Verification

- Existing automated suite plus two focused attention tests: **55/55 passed**, run once.
- Production validator/build successful (44 words, 36 items, 130 tasks, 76 production references). Rebuilt after final presentation/event changes.
- **10 distinct focused browser cases** across Chrome and WebKit passed: both pilot introductions/compact resume; actual runtime grading gate; blocked reference audio plus rejected save/retry; Tone Lab focus/introduction gate. Only affected pilot cases repeated after small final changes. Pilot recording uses a deterministic fixture and verifies automatic own playback and the Continue lock.
- Viewed representative 320px tone/Hanzi screenshots and 390px connection screenshot; no horizontal overflow in checked states. Touch controls remain at least 44px; accessible labels preserved.
- Recent C2.1 smoke helpers aligned with the new prerequisite without running a broad regression suite. No A1 language matrix, audio listening, handwriting matrix or broad C/D browser round.
- Diff contains no D content, continuous-scheduler, writing-target or production-audio changes.

## What normal learning must decide

Whether two deliberate focus actions make tone marks and Hanzi more noticeable and memorable without feeling repetitive. The neutral distinction between teaching evidence and mastery must remain. Real iPhone autoplay and real microphone quality are not certified by desktop WebKit/fixture tests. Existing provisional audio statuses are unchanged.

Pronunciation note source: [Open University, third-tone changes in connected speech](https://www.open.edu/openlearn/mod/oucontent/view.php?id=108700&section=2.1). Full isolated versus contextual third-tone distinction follows the existing Tone Lab explanation; no new audio was generated.

Normal app: https://language-learning-abk.pages.dev/ — **Testversion C2.2 · Inhalte D**.
