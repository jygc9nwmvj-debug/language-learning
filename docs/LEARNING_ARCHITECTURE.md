# Learning Architecture v0.1

**Date:** 2026-09-28  
**Status:** Authoritative learning-design contract for future Work builds unless explicitly revised.

This contract consolidates the project's evidence-informed direction. Where older design guidance conflicts, this document governs future work. It is not a claim that every principle is fully implemented, nor authorization for an unrequested implementation build. Build D is already deployed with 28 additional learning objects; preserve its content and Continuous Learning system.

## Learning states

**ENCODING / INTRODUCTION → GUIDED PRODUCTION → RETRIEVAL → SPACED RETRIEVAL → TRANSFER**

These are conceptual learning states, not necessarily separate screens or a compulsory identical route for every item. The app may move backward temporarily:

**failed retrieval → appropriate scaffold → retry → later retrieval again.**

Support should enable a subsequent independent attempt; assisted success is not equivalent to independent recall.

## Introduction and attention

**New ≠ test.** Deliberately introduce new knowledge before assessing it. Mere appearance somewhere on screen is insufficient. If assessment requires a tone, Hanzi, pronunciation convention, grammar distinction or writing form, that feature must first receive deliberate learner attention.

Use progressive disclosure: audio, Pinyin, Hanzi, meaning and explanations must not all compete equally at once. Let the relevant feature dominate temporarily, then reconnect it to the whole expression. Keep this inside a coherent learning surface where possible; no theatrical pacing or mandatory waiting.

**Pinyin is scaffolding.** It may dominate pronunciation introduction, but should increasingly recede where Hanzi, meaning and sound are familiar. Hide answer-revealing support during genuine retrieval; keep appropriate help available. Avoid permanent dependence on Latin script. The exact fading threshold remains a product hypothesis.

**Tones require explicit item-specific introduction.** Visible diacritics alone are not instruction. Before assessing tone notation, explicitly focus that item's relevant tone and introduce the notation convention. Keep canonical linguistic truth separate from what the learner may currently be assessed on, including lexical versus contextual pronunciation. Introduction evidence is not mastery evidence; typed tone notation does not establish spoken pronunciation.

**Hanzi require visual attention.** Distinguish recognition targets from active writing targets. Give important new forms a deliberate visual-focus opportunity without requiring handwriting for every character.

## Writing, retrieval and feedback

For active writing targets, use:

**observe → guided production → reduced scaffold → free production → later recall.**

Preserve the learner's actual stroke geometry. Do not beautify it into ideal characters, assign beauty scores or equate tracing with independent reconstruction. Keep the existing writing system; the number of immediate productions and pace of fading are tunable hypotheses.

**Retrieval is learning, not merely examination.** After initial encoding/guidance, provide genuine reconstruction with the answer withheld. Recognition, assisted production and independent retrieval provide different evidence.

**After failure, prefer specific feedback and another attempt before exposing the entire solution.** Start with the smallest useful cue; strengthen scaffolding when needed. If the prerequisite was never introduced, teach it rather than marking its absence as failure. Do not trap the learner in endless identical retries. Provide a model when necessary, then return to independent retrieval later. This preference is a design rule, not a universal empirical claim about optimal feedback timing. Some current tasks still reveal a full correction; this document does not silently change them.

## Spacing, transfer and modalities

Successful independent knowledge should generally return after increasing intervals; weak or failed knowledge returns sooner. Immediate assisted success alone should not justify a long interval. Spacing is supported by research; exact intervals and expansion rules are hypotheses, not scientifically optimal constants. Expanding spacing is not assumed universally superior to equal spacing.

The goal is usable language, not memorized cards or fixed sentences. Reintroduce known language across different modalities, new combinations and communicative contexts. Transfer must be observed, not inferred solely from success on the original item.

Listening, speaking, reading, Pinyin, Hanzi and writing should support one another. Select modalities for the learning objective; do not force every item through every modality.

## Continuous Learning and evidence discipline

The learner-facing model is **WEITERLERNEN**. Lessons/modules are internal organization. The scheduler mixes recall, consolidation and new material without requiring completion of visible lessons. Preserve the current D system; this contract does not request a replacement engine.

No fixed pseudo-scientific ratios such as “20% instruction / 80% retrieval.” Scheduler parameters, activity counts, thresholds and exact presentation sequences are tunable hypotheses.

For each future learning-design decision distinguish:

| Category | Meaning | Example |
| --- | --- | --- |
| A — EVIDENCE | Strongly research-supported principle, within the studied conditions | Retrieval practice and spacing can support delayed retention. |
| B — DERIVED | Plausible or indirectly supported application | Reduce Pinyin support as independent Hanzi retrieval becomes reliable. |
| C — HYPOTHESIS | Product choice requiring observation | Two attention acknowledgements, a particular interval or number of guided copies. |

A cited study does not automatically validate our UI, population, timing or thresholds. State limitations and an observable question for consequential hypotheses. Established product patterns demonstrate design possibilities, not learning efficacy.

**Build while learning.** The primary human evaluator is also a real learner. Use proportionate automation for technical correctness; judge learning experience primarily through normal use, including later recall, rather than repeated artificial QA scripts. Individual observations guide iteration but are not controlled scientific proof.

## C2.2 pilot and C2.3 generalization

Only **你好 and 好** currently pilot:

**reference audio → explicit tone focus → Hanzi focus → combined form/sound/meaning → later retrieval.**

The focus changes occur within one surface. Two deliberate acknowledgements precede the existing Continue action; recording remains optional. Explicit tone acknowledgement is stored separately from ordinary Pinyin display. Tone-notation assessment additionally requires the notation introduction. Later acknowledged encounters use the compact presentation. 你好 is a recognition target in this pilot; 好 connects to the existing writing flow.

This is a **C — HYPOTHESIS**, not a universal mandatory sequence or proof that a click caused attention. Judge usefulness, retention, repetition burden and click cost through real learning before broader rollout. Do not extend the pilot merely because its technical tests pass. See [C2.2 implementation and limits](BUILD_C2_2_ATTENTION_PILOT.md).

The explicitly requested **C2.3 consolidated addition** now generalizes the underlying mechanism to all current items through canonical, relevant introduction dimensions. It does not mandate the pilot's exact click sequence. Focused listening can advance automatically; visual targets receive Pinyin-free form focus followed by form/sound/meaning association; familiar whole-word components can reuse prior visual introduction. Per-dimension introduction evidence gates assessment; visual recognition never implies writing. All 28 D objects and the existing scheduler remain. This remains a product hypothesis to evaluate through normal use. See [C2.3 implementation and limits](BUILD_C2_3_PHRASE_COMPREHENSION.md). The preceding C2.2 description records the original pilot, not a restriction on the subsequently authorized generalization.

## Evidence and references

A short selection from existing project research, supplemented by a primary SLA feedback meta-analysis. These support broad principles, not this exact architecture's effectiveness:

- **Retrieval:** Karpicke & Roediger (2008), [The critical importance of retrieval for learning](https://pubmed.ncbi.nlm.nih.gov/18276894/). Foreign-language vocabulary experiment; supports repeated retrieval, not a universal activity ratio.
- **Spacing:** Kim & Webb (2022), [The Effects of Spaced Practice on Second Language Learning: A Meta-Analysis](https://doi.org/10.1111/lang.12479). Supports distributed L2 practice; does not prescribe our intervals.
- **Guidance fading / worked examples:** Renkl & Atkinson (2003), [Structuring the Transition From Example Study to Problem Solving](https://doi.org/10.1207/S15326985EP3801_3). Rationale for gradually reducing support; transfer to our Hanzi sequence is indirect.
- **Corrective feedback in SLA:** Lyster & Saito (2010), [Oral Feedback in Classroom SLA: A Meta-Analysis](https://doi.org/10.1017/S0272263109990520). Supports corrective feedback in classroom language learning; our app's cue/retry policy remains a design application.
- **Phonetic training:** Yao et al. (2025), [A Meta-Analysis of Second Language Phonetic Training](https://doi.org/10.1044/2024_JSLHR-24-00432). Supports trainable L2 phonetic skills; does not validate tone-mark highlighting or automated pronunciation scores.
- **Hanzi learning:** Lyu et al. (2021), [Comparison studies of typing and handwriting in Chinese language learning: A synthetic review](https://doi.org/10.1016/j.ijer.2021.101740). Benefits vary by outcome; no requirement to handwrite every item.
- **Attention and visual load:** Hou & Jiang (2022), [Interference effects of radical markings and stroke order animations on Chinese character learning among L2 learners](https://pmc.ncbi.nlm.nih.gov/articles/PMC9403612/). Cautions against competing visual aids under the studied conditions; not a blanket rejection of stroke demonstrations.
- **Established product pattern:** Skritter's official [Writing Modes](https://docs.skritter.com/article/281-writing-modes) and [Teaching Mode / writing canvas](https://docs.skritter.com/article/267-mobile-writing-canvas-and-study-screen-buttons). References for raw strokes and supported practice, not evidence for our repetition counts.

Project context: [Evidence Discipline](EVIDENCE_DISCIPLINE_v0.1.md), [current Master](MANDARIN_APP_MASTER_CURRENT.md), [research/source archive](MANDARIN_APP_MASTER.md), [Writing Fading](WRITING_FADING_v0.1.3.md), [Writing Foundation](BUILD_B_WRITING_FOUNDATION.md), [Corrective Feedback Policy](CORRECTIVE_FEEDBACK_POLICY_v0.1.md) and [Continuous Learning](BUILD_D_CONTINUOUS_LEARNING.md).
