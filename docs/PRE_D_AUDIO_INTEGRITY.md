# PRE-D — deterministic production audio audit

2026-09-27. No listening, synthesis, quality study, browser regression or Build D work.

## Finding

**Production is not Polly-only.** It contains 20 unique audio references: 16 natural/careful_slow item
variants across eight content items, plus four isolated ma tones. Fifteen are Polly (12 user_accepted,
three needs_human_review); five are documented pre-Polly/Qwen-Praat references still marked generated.
All 20 exist locally and online. All 20 local and live SHA-256 hashes match the recorded manifest;
all 12 accepted Polly files also match the original user-acceptance record. Zero hash mismatches.

Live origin: https://language-learning-abk.pages.dev/ . Retrieved service-worker inventory and deployed
JavaScript contain exactly these 20 audio paths, no unknown audio. Each was checked by HTTP status and
hash only. Full per-file results: PRE_D_AUDIO_INTEGRITY.json. Local production output also contains
exactly these 20 files. The existing build pruning already excluded unused public WAVs from deployment.

## Active legacy references — all five

| Item | Variant | Path |
| --- | --- | --- |
| 我 / wo | careful_slow | /audio/mandarin/wo-slow.wav |
| 你 / ni | careful_slow | /audio/mandarin/ni-slow.wav |
| 好 / hao | careful_slow | /audio/mandarin/hao-slow.wav |
| 再见 / zaijian | natural | /audio/mandarin/zaijian.wav |
| 再见 / zaijian | careful_slow | /audio/mandarin/zaijian-slow.wav |

These were explicitly retained in the prior A2 workflow/manifest. No corresponding Polly replacements
exist in the accepted set. Removing them would remove the available variant (and violate the current
content rule requiring distinct natural/slow assets); substituting another item or relabeling natural
as slow would be incorrect. Therefore none of these five active mappings was changed by this audit.
They are now exact, named legacy exceptions, not implicit approval or hidden provider fallbacks.
Eliminating them entirely requires a later replacement/removal decision outside this no-generation audit.
No Melo/CosyVoice or other bake-off samples are referenced by the production content/bundle.

## Safe isolation and validator

Moved 15 unused public WAVs byte-for-byte to tools/audio-archive with an explicit non-production README.
Updated the one unit-test fixture path. static-prototype and tools/audio-bakeoff remain outside the
Vite public/source build. Historical provenance/license pages mention Qwen/Praat/Wikimedia but do not
load those obsolete tone samples; retained to preserve provenance. No runtime fallback references found.

Manifest productionUse is separate from qualityState. Every item variant and every word-level audio
reference must match exactly one manifest entry by path, item and variant. Eligibility requires an
explicit Polly production designation and validated/review/accepted quality state, or one of the five
exact grandfathered legacy item/variant/path tuples with a reason. Unknown files, ordinary experimental
manifest entries, swapped styles/tones, generated-only Polly and newly invented legacy exceptions fail.
Existing file/container/hash checks remain in place. Build packaging shares the same reference enumeration,
so unused canonical word audio cannot bypass validation. No new audio-management pipeline.

## Validation

- Existing tests plus four narrowly scoped integrity tests, run once: **41/41 passed**.
- Production build, including the existing content validator, run once: **passed**.
- Build inventory: 20 audio files, no experimental extras. git diff --check passed.
- Live production audit: 20/20 fetched, expected hashes and precache references; no unknown bundle references.
- Audio bytes unchanged. No listening or browser regression performed.

Changes are local; no push/deployment requested or performed. The audited online Build C remains unchanged.
Build D has not started. Stop here.
