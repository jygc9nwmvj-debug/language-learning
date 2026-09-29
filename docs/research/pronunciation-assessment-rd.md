# Speaking v2 R&D — local Mandarin tone assessment

2026-09-29 · Isolated decision experiment · **NO-GO for product integration of the tested baseline.** No candidate in this pass justifies telling a beginner that a tone is correct or incorrect. This is not evidence that local tone assessment is impossible.

## Question and decision

Can a small local component provide ACCEPT / REJECT / UNCERTAIN without false confidence? We reproduced a transparent context-specific F0 baseline on OMPAL, using existing local MFA solely for syllable alignment. Its low coverage and frequent false rejections fail the intended feedback use. Stop this implementation here; do not tune it indefinitely or add it to the app.

**Consolidation provenance:** this report was untracked in the desktop checkout based on `acfa249`, not on a committed Speaking branch. Its saved summary and predictions were inspected during consolidation; the acoustic experiment was not rerun. The report is now canonical project knowledge. Reproduction scripts, threshold lock, split manifest and raw result files remain isolated locally at `/Users/wolframhuke/Desktop/language-learning/tools/pronunciation-assessment-rd/`, with a second working copy under the earlier Work output directory. They are not on remote main and must not be deleted as redundant branch work. See [inventory](../ROADMAP.md#branch-and-working-tree-inventory). No production tests, app changes, deployment or contacts were made by this experiment.

## OMPAL: verified data and important discrepancies

Pinned corpus: `phantomhsieh/OMPAL-corpus@c3aaa9e892e4b1c2a25b637401f52f6e35b53e74`. Local file audit: **1,850 WAVs, 16 kHz, 10,795.07 seconds**, 82 native recordings / 3 native speakers and 1,768 French-L1 learner recordings / 46 learner speakers. Learner annotations contain **19,775 character-level tone decisions: 17,208 correct, 2,567 incorrect**. They are correctness labels, not annotations of the tone actually produced. No syllable timestamps are provided.

The paper describes a panel of four teachers, **three raters per recording**, not four votes on every recording. Aggregate labels agree with majority vote wherever the detail IDs match: 12,361 aligned instances, of which 2,350 have rater disagreement. **656 aggregate recording IDs are absent from the detail file, and 656 detail IDs are absent from the aggregate file.** No speculative remapping was performed. The main benchmark uses the published aggregate labels, and does not claim unanimous expert gold.

All five actual train/test JSON pairs have no speaker overlap. README “combination 1” lists different speakers from `test_1_scores.json`; we use the actual file (also consistent with the paper's example table): native 01002 and learners **02007, 02021, 02031, 02036**. Other combinations were audited for overlap, not benchmarked. Exact IDs and hashes are saved.

Limitations: controlled read speech; familiar prescribed texts; French-L1 adults, not German-L1 beginners or spontaneous mobile recordings. The paper's annotation rules score the last repetition and can mark some omissions correct under specified circumstances. Consequently an expert tone label is not always proof of an audible, uniquely segmented syllable. MFA may align a different repetition; boundaries were not human-validated. Native files were audited but not used in the learner benchmark. [Corpus and license](https://github.com/phantomhsieh/OMPAL-corpus), [original paper](https://www.isca-archive.org/interspeech_2025/hsieh25b_interspeech.html).

## Candidates actually checked

| Candidate | Verified implementation/access | Decision for this product |
| --- | --- | --- |
| A: F0 + context templates | Implemented and run locally; details/results below | **NO-GO**: too many false rejections and too little coverage |
| B: OMPAL published baseline | Paper describes wav2vec2-large-960h + BLSTM sentence-score regression. Pinned corpus tree and author's public repositories contain no baseline training/inference code or checkpoint; no separate release was located | **NO-GO for reproduction/adoption in this pass**; not a syllable tone detector, and not reproduced or approximated under its name |
| C: ToneForge | Supplied GitHub repository and public API return 404; source, weights and license unverified | **NO-GO pending accessible reproducible release**; not a measured quality judgment |
| C: Mandarin Tone Coach | Pinned `f3da539876c47bcc60eacb1c77a0352868a34534`: classifier code and 9,305,265-byte checkpoint exist. Default YAML and encoder use MMS-300m; README describes MMS-1b-all. README declares MIT, but no standalone LICENSE appears in inspected tree. MMS weights are CC BY-NC 4.0 | **NO-GO for current adoption**: noncommercial model restriction, heavy stack and unresolved recipe/checkpoint provenance. Stopped before downloading/running weights; no independent OMPAL result claimed |
| D: MFA | Existing A2 installation reproduced alignment on all 267 selected recordings with pinned Mandarin model; not a correctness classifier | Useful research infrastructure; **NO-GO as tone assessor** |
| D: Charsiu | Public MIT code and documented Mandarin checkpoint exist; not run because available MFA already supplied the needed alignment | Not ranked as a scorer; alignment alone cannot justify feedback |

Tone Coach's own analysis reports serious T3/confidence problems on synthetic examples. That is an upstream diagnostic, **not** an independent learner benchmark and not proof that its present checkpoint has that exact error rate. No toy candidates or custom phoneme recognizer were added.

Sources: [Tone Coach code](https://github.com/sequoia-hope/mandarin-practice/tree/f3da539876c47bcc60eacb1c77a0352868a34534), [default configuration](https://github.com/sequoia-hope/mandarin-practice/blob/f3da539876c47bcc60eacb1c77a0352868a34534/configs/default.yaml), [upstream diagnostic](https://github.com/sequoia-hope/mandarin-practice/blob/f3da539876c47bcc60eacb1c77a0352868a34534/docs/tone_classification_analysis.md), [MMS-300m license](https://huggingface.co/facebook/mms-300m), [MMS-1b license](https://huggingface.co/facebook/mms-1b-all), [ToneForge access endpoint](https://api.github.com/repos/bellfireg/toneforge), [Charsiu](https://github.com/lingjzhu/charsiu), [MFA model limitations](https://huggingface.co/MontrealCorpusTools/mandarin_mfa).

## Protocol and acoustic baseline

Label-blind deterministic text selection: take texts occurring >=18 times, sort SHA256(text), select twelve, retain all their learner recordings. **267 recordings / 2,915 tone instances**. Train: 38 speakers, 223 recordings / 2,437 instances. Dev: four separate speakers (02001, 02006, 02035, 02046), 20 / 214. Test: four official heldout learner speakers, 24 / 264. Dev speakers were selected by hash from non-test speakers. Texts recur across splits intentionally: this tests **known-prompt, unseen-speaker** performance, not generalization to new text. No training performance is offered as evidence.

MFA 3.4.2 / Kalpy 0.10.5, Mandarin revision `85f9e701a29d9d80f582725c6c94bf8796520b9a`, Pinyin G2P, no speaker adaptation. Pinyin is generated in phrase context; token counts and aligned text must match. It provides approximate boundaries only. Tone-conditioned alignment remains a possible source of bias.

Praat/Parselmouth autocorrelation F0: 60–550 Hz, 10-ms step. Convert to semitones; subtract the **current utterance's** median and divide by its 10–90 percentile range (minimum 3 semitones). This normalizes relative to the current speaker without consulting other test recordings, though it is less stable than a genuine calibrated speaker profile. Nine interpolated points across each voiced syllable preserve relative height, slopes and curvature. Reject unusable extraction into UNCERTAIN: short/near-silent/clipped signals, insufficient voiced duration/proportion, >100-ms internal gaps or >8-semitone frame jumps. These are engineering guards, not validated perceptual cutoffs; creaky but valid T3 may be excluded.

For each exact sentence + character position, form a median contour from >=5 expert-correct training instances: **103 templates**. Compare RMS distance to the full nine-point contour. No raw-Hz decision, endpoint-only shortcut, duration classifier, ideal dictionary contour, or neural training. Template matching is context-specific and cannot grade a new phrase without data. Distance is **not a calibrated probability**.

Dev-only distance quantiles define three exploratory operating points: 10/90, 25/75, 40/60 percentiles for ACCEPT/REJECT; the middle interval abstains. Save threshold lock before test reporting. These demonstrate a trade-off, not optimized or scientifically established product thresholds. After heldout results, no parameters were tuned. Invalid/no-template cases remain in all coverage denominators. Only 136/264 test instances have a usable distance; 38 lack sufficient voicing, 55 have gaps, 27 pitch jumps, eight lack a training template.

## Heldout results: all 264 instances included

Gold: **19 incorrect, 245 correct**. Positive class = expert-incorrect. ACCEPT means system says acceptable; REJECT means system flags a tone problem.

| Operating point | ACCEPT: good / bad | REJECT: bad / good | UNCERTAIN | Coverage | Accuracy among judged | Error precision / recall |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Strict | 6 / 0 | 4 / 12 | 242 | 22/264 = 8.3% | 10/22 = 45.5% | 4/16 = 25.0% / 4/19 = 21.1% |
| Middle | 20 / 0 | 6 / 36 | 202 | 62/264 = 23.5% | 26/62 = 41.9% | 6/42 = 14.3% / 6/19 = 31.6% |
| Broad | 37 / 0 | 8 / 61 | 158 | 106/264 = 40.2% | 45/106 = 42.5% | 8/69 = 11.6% / 8/19 = 42.1% |

**False accept** = bad ACCEPT / all expert-bad: 0/19 at all three test points. **False reject** = good REJECT / all expert-good: 12/245 (4.9%), 36/245 (14.7%), 61/245 (24.9%). These denominators differ from accepted-error fraction and rejection precision. Abstention is neither correct nor incorrect and is not hidden as accuracy.

Zero test false accepts is not proof of safety: just six strict accepts and nineteen bad instances across four speakers. Even a naive independent-binomial 0/19 one-sided 95% upper bound is about 14.6%; speaker clustering makes that independence assumption unsuitable for a reliability claim. **Dev already contains false confidence**: strict accepts one incorrect out of eleven accepted (1/40 of all expert-bad); middle 2/27 accepted, broad 3/43. Increasing coverage adds many false alarms. An always-ACCEPT rule would have 92.8% overall test accuracy while accepting all 19 mistakes—illustrating why accuracy alone is misleading.

### Tone strata and confusion

Lexical tone below is **derived by Pypinyin**, not expert surface-tone annotation; polyphony and neutral-tone conventions were not manually audited. Do not interpret these as a produced-tone confusion matrix.

| Derived lexical tone | N / expert-bad | Strict correct error detections | Strict false rejections | Judged |
| --- | ---: | ---: | ---: | ---: |
| 1 | 54 / 4 | 1 | 2 | 5 |
| 2 | 40 / 4 | 0 | 3 | 4 |
| 3 | 52 / 5 | 2 | 2 | 6 |
| 4 | 88 / 5 | 1 | 5 | 7 |
| neutral | 30 / 1 | 0 | 0 | 0 |

The dominant confusion is **acceptable speech flagged as a problem**, not established T2↔T3 substitutions. No tone-class winner is supported by these tiny counts. No neutral-tone feedback is supported.

## Robustness and practical size

Strict fixed-boundary stress tests over the same 264 test instances: -20 dB gain changes no decisions; -60 dB, pure silence and 80-ms truncation cause 264/264 UNCERTAIN. One second of silence at both ends changes one decision; synthetic white noise at 20-dB utterance-RMS SNR changes four. Boundaries are held fixed (shifted for padding), so these **do not validate end-to-end alignment**. They are synthetic sensitivity checks, not real microphones/noisy learner recordings.

Pitch strata: 132 instances with utterance median 150–220 Hz, 132 above 220 Hz; none below 150 Hz. These are measured pitch ranges, not inferred genders. Sex-specific robustness, low male registers, child voices, hardware/microphone effects and spontaneous recording failures remain untested. F0 failures lead to abstention; they do not establish incorrect tone.

Measured Apple M1 Max / 32 GiB RAM, CPU only, Python 3.12.14. MFA reports **54.96 s for 267 recordings** after cached model setup; this is batch throughput, not interactive cold-start latency. F0/features total 3.38 s, median 11.6 ms / p95 20.7 ms per recording. Feature-process peak RSS ~130.5 MiB including stress checks; separate MFA peak RAM was not instrumented. Praat extension ~30 MiB; JSON templates ~38 KiB. Existing MFA environment ~1.5 GiB; downloaded model files ~184 MB logical size including both dialect resources. No API charge; downloads and local compute only.

The feature/classification algorithm is small, but the actual prototype needs Python/Praat plus a native Kaldi/OpenFst/MFA stack. **Not a browser/offline-web implementation**; desktop offline works once dependencies/models are cached. A browser port is neither built nor justified by current reliability. Tone Coach's 300M/1B encoders are proportionally much heavier (~1.2/~4 GB float32 parameter arithmetic, not measured runtime); no misleading inference-time estimate is supplied. OMPAL/Charsiu unrun scorers have no measured runtime here.

Licenses: OMPAL CC BY 4.0 with attribution; MFA model card CC BY 4.0, but its listed training corpora have mixed licenses including NC/ND restrictions, so redistribution/commercial clearance is not established merely by the card. MFA software MIT; Pypinyin MIT; NumPy/SoundFile BSD-family; **Praat/Parselmouth GPLv3** requires separate review before bundling into a differently licensed product. MMS CC BY-NC 4.0 is not cleared for future commercial use. No weights or audio are committed.

## Sandhi, feedback and next decision

Exact-context templates can reflect the observed surface contours without forcing lexical T3 to dip everywhere. They **do not implement or validate** T3 sandhi, 不/一 changes, neutral-tone context, phrase-final variants or prosodic boundaries. Missing contexts, new combinations and isolated syllables cannot be transferred from this benchmark. Disable feedback there; more generally, do not deploy any feedback from this baseline.

“Der Ton passt” is not justified by six test accepts plus observed dev false accepts. “Der Ton klingt noch nicht eindeutig wie Ton 3” is not justified by a distance-based outlier detector that never identifies the produced tone. “Das kann ich nicht zuverlässig beurteilen – hör noch einmal die Referenz” fits abstention but must not imply that the current detector reliably assesses its other cases. No numerical score or UI is implemented.

**Recommendation: stop this candidate, retain the reproducible negative result.** No current candidate earns GO or PROMISING BUT NOT READY on demonstrated performance. The next useful experiment, if later authorized, is a small **boundary/label validity study**, not app integration or a larger model: manually verify alignment and audible final attempts for a prespecified mix of training/dev items, especially false-rejection-like outliers; keep current test untouched for tuning and reserve a new speaker holdout for any changed method. This would determine whether segmentation/labels or contour discrimination are the main bottleneck.

A German-L1/native-review stage is **conditional**, not presently recommended for execution: if a later candidate clears the technical stage, collect a small balanced set from multiple German-L1 learners plus a native reference, include natural attempts and deliberate contrasts, blind/shuffle annotation by qualified Mandarin reviewers, record correct/incorrect/uncertain and reviewer disagreement independently of model results, separate calibration/test speakers, and pre-register false-accept, false-reject and coverage reporting. Use new prompts/context strata, real device variation, and no transcript-biased ASR as gold. A single current learner can supply usability examples but not establish population validity. No contact or recordings were requested here.

## Verification and freeze

One actual heldout benchmark plus fixed perturbations; focused experiment checks passed for split isolation, count consistency and fail-safe silence/short audio. No broad regression, production build or production tests were run. Existing unrelated personal-name work was preserved. Only this report, KB cross-references and isolated experiment scripts/results were added. Stop: no integration, no deployment, no new production build.

## Retained reproduction instructions

The following instructions were preserved from the isolated experiment README; they document reproduction, not an instruction to restart the experiment. The `scripts/` and result files remain in the local location above.


No app imports or production tasks. Scripts/results only; no corpus, weights or licensed PDF in Git.

Run with Python 3.12 and a separate MFA 3.4.2 / Kalpy 0.10.5 environment (conda-forge). Existing A2 environment was reused. Install `requirements.txt` in a separate Python environment. The full observed Python freeze is in results; unrelated A2 packages are **not** required.

Choose an external working directory, copy `scripts/` into it, then run from that directory:

```sh
curl -fL https://codeload.github.com/phantomhsieh/OMPAL-corpus/tar.gz/c3aaa9e892e4b1c2a25b637401f52f6e35b53e74 -o ompal.tar.gz
tar -xzf ompal.tar.gz
mkdir -p results
python scripts/audit.py
python scripts/prepare.py
# Activate the isolated MFA environment first, including its bin directory in PATH.
# Set MFA_ROOT_DIR to a fresh directory under this experiment, not the app.
mfa align_hf "$PWD/corpus" MontrealCorpusTools/mandarin_mfa@85f9e701a29d9d80f582725c6c94bf8796520b9a "$PWD/aligned" --dialect mandarin_china_mfa --use_g2p --language unknown --single_speaker --num_jobs 1 --no_use_mp --output_format json
# Return to the Python environment containing requirements.txt.
python scripts/benchmark.py
python scripts/check_results.py
```

`--single_speaker` disables adaptation; real speaker identities remain in the manifest. No global training/adaptation across test speakers. Alignment is automatic and unverified by humans. The test is conditional on these boundaries; fixed-boundary perturbations do not validate end-to-end alignment robustness.

Selection: 12 texts with >=18 recordings, sorted by SHA256(text); all learner recordings of those texts. Official test split 1 **file**, not inconsistent README list. Four other speakers selected by SHA256(speaker name) for dev; all remaining for train. Native recordings audited but excluded from this learner-only benchmark. Exact test speakers are never used in templates or thresholds. Texts deliberately recur across splits: known-prompt evaluation, not unseen-text generalization.

The contour extractor uses Praat autocorrelation 60–550 Hz / 10 ms; logs Hz into semitones and normalizes each utterance by its own median and robust pitch range. This is current-speaker/current-utterance normalization, not a cross-recording voice profile. For each aligned syllable it interpolates nine points over the voiced region; long gaps, jumps, insufficient voicing and bad audio abstain. The median of >=5 expert-correct training examples forms each text-position template. RMS contour distance is not a calibrated probability. Dev distance quantiles define three **exploratory** threshold pairs (10/90,25/75,40/60 percentiles). No product acceptance threshold is asserted. Threshold lock is saved before heldout metrics. No later tuning after test inspection.

Results: `summary.json`, raw `predictions.json`, `templates.json`, data/split `manifest.json`, `corpus-audit.json`, `threshold-lock.json`. The report explains limitations; do not use these files to grade app learners. `corpus-audit.json` includes missing detailed-annotation IDs for traceability, not inferred mappings.

Attribution: OMPAL by Hsieh, Chi, Wang, Yeh, Liu & Chiang, Interspeech 2025, DOI 10.21437/Interspeech.2025-983; corpus CC BY 4.0, https://github.com/phantomhsieh/OMPAL-corpus. Derived labels/texts in results retain this attribution. MFA Mandarin model by Michael McAuliffe, model card CC BY 4.0, https://huggingface.co/MontrealCorpusTools/mandarin_mfa. Praat/Parselmouth GPLv3; do not assume this Python prototype can be bundled into proprietary browser code without license review. No paid APIs. Model card training-data licenses also require review before distribution.

### Saved artifact fingerprints at consolidation

| Isolated file | SHA-256 |
| --- | --- |
| `README.md` | `3e2da1cfb4807152e1feaed03217da1745796501ec0f6765891a4940730a8c2e` |
| `requirements.txt` | `4a3224fce1b887c402b6ddfc7c666ca0add7775fcd3b4038e6587d2d4b2e5c2f` |
| `scripts/audit.py` | `42998a54ca671c5e50b598f69ec85ef4e4d0f67b1e6972f1864371f097669e80` |
| `scripts/prepare.py` | `42297614ed87efcbabb693696bdd35e6c5f96d1194be0e1f278a40cf57b05667` |
| `scripts/benchmark.py` | `53de851c9e227c78aabedc4a25c4f90f88e30f29d9efb9ae8b3dbf148c2f9ccd` |
| `scripts/check_results.py` | `ab7688b45f15fbf7f6e2223d43d25484667df272ba60b2d3f0aaa1c5f6505891` |
| `results/summary.json` | `d72e36af4bb078d8eb6587764bea6c5b96ce1e100debd692aa037e2624b82dbf` |
| `results/predictions.json` | `43730a6569f6fc4411c4162446f5b8532032e9c6350ea7c9954504cf42fbab42` |
| `results/manifest.json` | `743571fdaeb05c633065ec7dbf25d5b63e876aad30339dde7530f5a93787229d` |
| `results/threshold-lock.json` | `1616127b7fd7ca04edc1d08ca182fc593ac1715c1f00e109ee506b2066966c7d` |
