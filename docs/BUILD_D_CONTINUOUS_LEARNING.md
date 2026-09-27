# Build D — Continuous Learning + content buffer

2026-09-27. Normal app: https://language-learning-abk.pages.dev/ · Testversion D.

## Delivered scope

28 new learning objects: five conversation-repair expressions, five social expressions, eight personal-information objects and ten numbers. Existing 再见 returns as recall. The pool has 36 total items and 130 authored/derived task definitions; a learner never receives that entire pool at once. Two optional small discoveries only. No identity, sync, account, exam mode, dashboard or efficiency score.

### Small explicit scheduler

Initially at most seven tasks plus a natural stopping point. Existing bounded, spaced retries may add practice after errors. Normally up to three unseen objects; two or more errors/assisted responses among the last six attempts reduce that to one. Up to three useful recalls (four when recent work is fragile) are mixed with the new material. Due recall, errors and oldest practice order the candidates. Recent consolidation has a tunable 20-minute separation; existing relation intervals retain actual elapsed days. These are starting hypotheses, not optimal scientific intervals.

Prerequisites precede new objects. Future graded recall is only selected from objects actually revealed, played, completed or answered; task_presented alone does not unlock knowledge. Merely clicking Continue does not create a successful relation. Text-recall tasks for D assess expression content, not untaught sandhi/neutral notation. Old tone assessment remains gated on the actual tone introduction.

A short pause resumes the same session cursor. After four hours, at a stopping point or for an old pre-D plan, a new small plan is composed from durable history. No forced old-lesson completion. No daily lockout: when nothing is due or new, a voluntary continuation uses least-recent practice. Phrase objects primarily use listening and expression production; numbers and selected nouns use reading/listening plus reconstruction. Review modalities alternate where supported; no full Cartesian product is shown.

One selective writing slot at most. 人、一、二、三、十 reuse the Build-B engine through writing-targets.ts with demonstration + two productions (guided, memory). Existing 好/你/我 configurations unchanged. Delayed blank writing requires prior writing evidence and at least 20 elapsed hours. Numbers additionally use three short ordering/reconstruction tasks after exposure.

### Measurement-ready events

Existing append-only events retain ID, timestamp, session and task. Presentation adds item, modality, new/recall and elapsed time since prior exposure. Completion/attempt/pause include foreground active milliseconds; hidden-tab time is excluded. activeMs is a cumulative per-task snapshot, not a field to sum blindly across events. Existing writing logs retain scaffold, hints/errors and self-report status. No dashboard or efficiency claim.

### Canonical content and review

44 canonical lexical records, 36 items, 130 task definitions. Pinyin derives from tone numbers; apostrophes before syllables starting a/e/o are handled. Script-pair checks, syllable inventory, prerequisites/order, surface syllable correspondence, writing eligibility and assessment declarations extend the existing small validator. German aliases include numeric digits and common short alternatives. No freeform semantic AI grading added.

BUILD_D_CONTENT_REVIEW.md is a reviewable source/pragmatics report, the allowed fallback instead of new independent-AI API infrastructure. It does not claim an independent native-language review. No copyrighted lesson/dialogue was copied; short standard expressions and our own explanations form the content.

### Audio

All **76 production files are now Amazon Polly**: 12 accepted A2 files unchanged, three prior provisional A2 files unchanged, and 61 newly generated provisional files (56 new-item variants + five legacy replacements). Every natural/slow pair is separately synthesized; each slow file is distinct and longer. No stretching or listening study. All new files are needs_human_review after technical validation, not user_accepted.

The existing A2 measurement code checked decoding, duration, silence/clipping, levels and warning-only pace/isolated pitch. **42/61 new variants have tempo warnings** under the deliberately conservative A2 corridors; these remain explicit in the review report. No ASR was run and no phonetic correctness is inferred. This is a provisionally usable prototype library, not expert-approved Mandarin audio. The lexical bù correction and wǎn'ān display correction changed metadata only after SSML identity checks; waveform hashes did not change.

The five WAVs moved unchanged into tools/audio-archive. production-audio.mjs no longer has legacy exceptions. Production validates provider, eligibility, unique item/variant/path, file/container/hash and canonical Hanzi/tone metadata (punctuation normalized). Build output prunes unreferenced audio. Archives/research remain isolated.

## Reproducible generator

Run `npm run generate-audio -- --dry-run` to list missing/changed requests without AWS calls.
Run `npm run generate-audio` with an authenticated standard AWS profile (`AWS_PROFILE`, default mandarin-a2)
and `AUDIO_QA_PYTHON` pointing to a local Python environment containing the existing numpy/soundfile/praat-parselmouth dependencies. Uses AWS CLI; no runtime/cloud credentials and no console copy/paste flow.

The tool derives SSML from canonical items with authored surface-tone overrides. [AWS documents x-amazon-pinyin tone numbers and syllable boundaries](https://docs.aws.amazon.com/polly/latest/dg/ph-table-mandarin.html); [Neural prosody rate support](https://docs.aws.amazon.com/polly/latest/dg/prosody-tag.html) provides separate 85% natural / 75% careful_slow rates for new requests. Voice Zhiyu, neural, cmn-CN, eu-central-1, 24kHz MP3. Existing accepted A2 rates are preserved.

Input fingerprints and file hashes skip unchanged requests; corrupt/missing existing Polly bytes fail instead of silently replacing them. Changed accepted assets require explicit review. Each successful file gets reproducible SSML, input fingerprint, canonical/surface metadata, technical results, timestamp and hash; manifest writes are atomic. Technical hard failures stop generation. `npm run review-content` regenerates the canonical review table and technical warning list (source decisions remain separately in BUILD_D_LANGUAGE_DECISIONS.md).

## Character data

Five new pinned hanzi-writer-data@2.0.1 JSON files: 人、一、二、三、十. Loaded locally, no learner CDN dependency. [Upstream data provenance/license](https://github.com/chanind/hanzi-writer-data/blob/master/README.md): Make Me A Hanzi/Arphic; the existing ARPHICPL.txt is retained. No custom stroke engine.

## Validation

- Existing automated suite run once with then-current focused additions: **50/50 passed**.
- Later two new exposure/assessment-boundary tests and targeted follow-ups passed; the full A1 suite was not rerun.
- Focused scheduler simulations: successful learner, several errors, short stop, next day, several days; all 28 new objects eventually reached while old recall remains mixed in. Additional checks prevent unintroduced retrieval and verify generic writing configuration.
- Generator dry-run after synthesis: **0 requests**, demonstrating idempotence and preservation of accepted audio.
- Chrome + WebKit: **6/6 focused smoke cases passed** (migration/pause/day return; new repair phrase/reference; generic new writing + numeric reconstruction). Initial Chrome fixture reads raced DB commits; tests now await visible committed transitions.
- Production build/validator passed, with rebuilds only after actual follow-up changes. No exhaustive A1 browser, A2 hearing, B handwriting matrix or C visual regression.

Human evaluation is normal learning. Pool size is not a promise that every learner will consume it in exactly three days. Observe pacing, repetition, useful phrases and provisional audio naturally. No additional technical acceptance checklist.
