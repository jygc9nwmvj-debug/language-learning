# Mandarin pronunciation and tones

Reviewed: 2026-09-29. Research/R&D only; no scorer approved or implemented by this document.

## Phonetic perception is trainable; transfer needs separate evidence

**Evidence / confidence: HIGH for trained L2 perception; MODERATE for Mandarin-specific application and generalization.** Uchihara, Karas & Thomson's 79-study HVPT meta-analysis supports L2 perceptual gains, retention and some transfer to novel stimuli. It synthesizes multiple languages, not just Mandarin. It distinguishes perception from production; discussion of production evidence gives weaker support for retained/generalized production gains. More speakers is not automatically better for every beginner or task.

**Product interpretation.** Deliberate tone contrasts and later varied speakers/contexts are plausible. Practice hearing and producing tones separately; do not infer accurate speech from successful discrimination or typed notation.

**Limits.** Clear introductory exemplars and varied natural speech serve different purposes. The review does not validate our four synthesized ma tokens, F0 thresholds, exact training dose, or a required number of voices.

**Source.** Uchihara, Karas & Thomson (2025), *High variability phonetic training (HVPT): A meta-analysis of L2 perceptual training studies*, Studies in Second Language Acquisition, [DOI](https://doi.org/10.1017/S0272263125100879); abstract, results and limitations checked.

### Direct Mandarin evidence — MODERATE

Wang, Jongman & Sereno (2003) compared productions before/after perceptual tone training: eight trained American learners and eight controls with prior Mandarin study. Native listeners and acoustic analyses indicated production improvement. This provides direct evidence of possible perception-to-production transfer, but the small sample, isolated monosyllables and prior instruction limit application to spontaneous beginner phrases. Pitch height and contour did not improve identically; a single contour score would hide that distinction.

**Source (methods/abstract checked).** *Acoustic and perceptual evaluation of Mandarin tone productions before and after perceptual training*, Journal of the Acoustical Society of America 113, 1033–1043, [DOI](https://doi.org/10.1121/1.1531176), [author university full text](https://kuppl.ku.edu/sites/kuppl/files/documents/publications/Wang_Jongman_Sereno_training_production_JASA_2003.pdf).

## Canonical tone, surface pronunciation and notation are different

**Evidence / confidence: HIGH for the descriptive distinction.** MIT's Pinyin teaching materials distinguish citation tones, neutral tone and contextual changes: a third tone before another third changes, and a third before a non-third often lacks the full final rise. Context, grouping and prosody matter; a pedagogical full contour is not required in every natural phrase.

**Product interpretation — LOW / HYPOTHESIS for the exact instruction mechanism.** Tone marks merely visible in Pinyin are not counted as deliberate tone instruction. Before assessing an item's notation, focus its tones and the notation convention. This is an assessment-fairness/design rule supported indirectly by [explicit instruction research](learning-science.md), not a study proving that an acknowledgement click teaches a tone. Canonical metadata stay separate from currently assessable knowledge and expected surface realization. Missing tone marks cannot diagnose spoken-tone errors.

**Limits.** The introductory material is not a complete phonological account or a license to force dictionary contours onto connected speech. Knowledge of tone numbers, discrimination and intelligible production require distinct evidence.

**Source.** Jin Zhang / MIT, *Hanyu Pinyin for Mandarin Speakers: Tones* (undated teaching resource), [official material](https://web.mit.edu/jinzhang/www/pinyin/tones/), contextual examples checked. Its intended audience also limits direct transfer to L2 instructional sequencing.

## Open pronunciation-assessment R&D inventory

Confidence in pedagogical scoring for our learner: **LOW / HYPOTHESIS for every candidate**. Repository descriptions establish advertised capabilities, not independent validity. No code, model or corpus was downloaded into this project.

| Candidate | Verified source/status/license | Potential role and limits |
| --- | --- | --- |
| **OMPAL** | Hsieh et al. (2025), *OMPAL: Bridging Speech and Learning with an Open-Source Mandarin Pronunciation Assessment Corpus for Global Learners*, Interspeech, [DOI](https://doi.org/10.21437/Interspeech.2025-983); [corpus repository](https://github.com/phantomhsieh/OMPAL-corpus) states **CC BY 4.0**. README/annotation/license sections checked. | Human-annotated evaluation resource: 82 native and 1,768 French-L1 learner utterances, segment/tone and sentence ratings. Potential gold-standard comparison, not universal ground truth; restricted L1, recording conditions and tasks. Use speaker-disjoint evaluation; inspect rater agreement and fit to short beginner utterances before adoption. Attribution required. |
| **ToneForge** | Candidate identifier: [bellfireg/toneforge](https://github.com/bellfireg/toneforge). Repository and raw README/license could not be retrieved in this review (404/fetch failures); license and current availability **unverified**. | Requested lead for a local/open tone-scoring approach. Do not treat indexed descriptions as verified implementation, legal permission or validation. Re-establish the exact source before any spike. Do not confuse it with similarly named music/TTS products. |
| **Mandarin Tone Coach** | [sequoia-hope/mandarin-practice](https://github.com/sequoia-hope/mandarin-practice), README states **MIT**, local core evaluation, custom classifier, MMS/Whisper and sandhi handling. No independent benchmark checked. | Implementation reference only. Expected-text ASR bias can conceal mistakes, so recognition agreement is not independent pronunciation evidence. The [MMS model card](https://huggingface.co/facebook/mms-1b-all) carries **CC BY-NC 4.0**: repository MIT language does not make all model use commercially unrestricted. Recheck all weights/services separately. |
| **Charsiu / forced alignment** | [lingjzhu/charsiu](https://github.com/lingjzhu/charsiu), **MIT repository license**, Mandarin alignment resources documented. README calls the tool a phonetic aligner; its development wording is not proof of recent maintenance. | Possible time boundaries/phone alignment component. Forced alignment fits a supplied transcription and can align incorrect speech; it is not a correctness score. Check the selected checkpoint's language support and separate model/data terms. |
| **Azure Speech** | [Microsoft pronunciation-assessment documentation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment), proprietary hosted service; account, service terms, cost and audio transfer require a separate decision. | Comparison candidate only, not current architecture. Reference-based scores are not calibrated beginner Mandarin tone judgments. Documented **prosody assessment is en-US-only**; do not promise Mandarin prosody grading from this feature. No resource/access introduced. |

Any later spike must first specify the outcome: tone category, intelligibility, segment identity or whole-phrase quality. Compare against human annotation, report false rejection/acceptance and uncertainty, include sandhi and device variation, and allow abstention. Do not convert a technically plausible pitch contour into a production grade.

## Open questions

- Can a local method distinguish correct contextual third tones from actual errors reliably on this learner's device?
- Is OMPAL representative enough, and how should human disagreement be represented?
- Is ToneForge still accessible under a usable license?
- What feedback helps repair speech without teaching an exaggerated contour?
- When should varied voices be introduced without overwhelming an absolute beginner?
