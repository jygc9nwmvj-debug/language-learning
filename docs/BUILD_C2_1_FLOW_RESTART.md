# C2.1 — fewer clicks and explicit learner restart

2026-09-27. Builds on C2 plus D; no curriculum/audio assets/planner/writing pedagogy changed.

- Each encounter's natural reference attempts playback once on mount. Successful playback reveals pronunciation/meaning through the existing reveal path. After playback, recording is visually primary; after own recording, Continue is primary. Microphone and next-object navigation remain learner actions.
- Reference autoplay does not retry on rerenders or tab visibility changes. Hidden documents do not autoplay. A blocked attempt leaves “Anhören” plus a short manual-play hint; successful manual playback follows the same reveal path. Slow audio, tone drills and retrieval prompts do not auto-start.
- Automatically started reference can be paused. Audio cleanup cancels pending work and stops playback on object/session exit. Existing capture/navigation guards remain unchanged.
- Home settings expose “Von vorne beginnen” with explanation, existing backup download, and explicit native confirmation. The action atomically clears all learner tables, including legacy records, preferences and research history. It leaves app/audio caches intact and returns to the initial 你好 plan. Cancel changes nothing. Users are instructed to close other app windows before resetting; this is not a multi-tab coordination feature.
- Existing backup import remains a merge of current-schema progress; old prototype legacy tables are exported for archival purposes, not imported as learning evidence.

Verification: 53/53 automated tests passed, including reset rollback and backup restore; validator and production build passed. Six focused scenarios each in Chrome/WebKit passed across the runs (12 browser cases): encounter autoplay/primary action/next audio/exit, blocked reference autoplay, reset cancellation/confirmation/backup, own autoplay/pause/replay/retake/next lock, compact tones, blocked own autoplay. The initial exit assertion ran before the asynchronous session save completed; corrected to wait for home and reran only that case. No broad regression or new listening study. Tests use isolated browser state and recording fixtures, not the learner's data or a physical iPhone.

Normal app: https://language-learning-abk.pages.dev/ — Testversion C2.1 · Inhalte D.
