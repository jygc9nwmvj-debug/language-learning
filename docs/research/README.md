# Research Knowledge Base

Reviewed: 2026-09-29. Curated evidence notes, not a systematic review or a new implementation specification. No papers, model weights or datasets are vendored here.

## Current orientation

Start with [Learning Architecture](../LEARNING_ARCHITECTURE.md), [Product Observations](../PRODUCT_OBSERVATIONS.md), [Roadmap](../ROADMAP.md), the relevant research note and [Pilot Evaluation Protocol](../PILOT_EVALUATION_PROTOCOL.md). Main carries the knowledge; prototype code remains isolated. The pilot needs **no critical additional production instrumentation**.

Distinguish external research, architecture decisions, qualitative observations, measured learner evidence, product hypotheses, experimental prototypes and deployed behavior. The four-input model below organizes decisions, not equivalent kinds of proof.

## Four distinct inputs to decisions

**RESEARCH → LEARNING ARCHITECTURE → OBSERVATIONS / LEARNING DATA → DECISIONS / BUILDS**

- **Research:** what external evidence supports, for which learners, tasks and outcomes.
- [Learning Architecture](../LEARNING_ARCHITECTURE.md): authoritative current product decisions unless explicitly revised. Evidence notes do not silently change this contract.
- [Product Observations](../PRODUCT_OBSERVATIONS.md): what real use reveals; observations, hypotheses and proposed solutions stay separate.
- [F-light](../BUILD_F_LIGHT_OBSERVABILITY.md): measurable behavior and later retrieval, with assistance, provenance, actual intervals and missing-data limits. A single learner's observational data do not identify causal effects.

All four matter. Research does not automatically authorize a build; an Inbox suggestion is not a validated problem. Preserve LEARN → CAPTURE → CLUSTER → MEASURE → RESEARCH → PRIORITIZE → BUILD → FREEZE → LEARN.

## Read the relevant note

| File | Questions it answers |
| --- | --- |
| [Learning science](learning-science.md) | Retrieval, spacing, fading, feedback, explicit instruction, cognitive load and interleaving |
| [Mandarin pronunciation and tones](mandarin-pronunciation-tones.md) | Perception versus production, contextual tones, assessment R&D and licenses |
| [Hanzi recognition and writing](hanzi-recognition-writing.md) | Different outcomes, selective writing, components, stroke guidance and target selection |
| [Hybrid digital/paper](hybrid-digital-paper.md) | Media limits, offloading/distraction/rest, proposed Paper Writing v2 |
| [Curriculum progression](curriculum-progression.md) | Communication, separate skill speeds, standards and university examples |
| [Paper Writing v2](paper-writing-v2.md) | Completed handwriting/media/grid review; physical-validation observations and product hypotheses, not integrated |
| [JIT Meta-Learning](meta-learning.md) | Eight candidate moments, evidence levels and wording limits; no approved JIT feature |
| [Speaking v2 benchmark](pronunciation-assessment-rd.md) | Reproducible negative F0 result, OMPAL audit and candidate limitations; no pronunciation scorer approved |
| [English v0 architecture](../I18N_ENGLISH_V0_ARCHITECTURE.md) | One Mandarin canon, localized presentation, independent state and locale-specific answers; not an English release |
| [Product patterns](product-patterns.md) | Documented interaction patterns, not product efficacy rankings |

## Evidence discipline

**HIGH** = well-supported bounded principle or directly verified descriptive fact; it does not confer high confidence on its UI implementation. **MODERATE** = narrower/heterogeneous evidence or indirect application. **LOW / HYPOTHESIS** = proposed product choice or insufficient validation. These are editorial assessments, not a formal GRADE review. Each substantive finding separates evidence, implication and limits. General learning experiments, L2 research, curriculum examples and product documentation are different evidence types.

Before proposing or implementing a learning-design change, future Work must:

1. Read the relevant Learning Architecture section.
2. Inspect relevant Product Observations and available F-light evidence.
3. Consult the relevant research note.
4. Distinguish established evidence from product hypothesis.
5. Document the reason explicitly if departing from high-confidence evidence within its applicable scope.
6. Avoid researching settled questions again unless new evidence or a different question warrants it.

When adding a consequential claim, record population/outcome, confidence, limits, source and verification date. Prefer reviews/meta-analyses, peer-reviewed primary research, official standards/university curricula, then official product documentation. Search snippets and marketing claims are not efficacy evidence. Do not copy copyrighted papers into the repository.

## Verification and corrections in this edition

Source abstracts or relevant original passages were checked, not merely citation titles. Publisher abstracts support broad summaries, not detailed methodological claims. Key accessible full texts include the Hanzi visual-interference experiment, interleaving review, HVPT review, rest replication/meta-analysis and MIT character notes. Links identify the source even where an alternative author/university copy was needed.

- **Retrieval:** the existing Gonçalves et al. comparison is with elaborative encoding, not all possible instruction. Its modest average advantage depends on feedback; it cannot establish “mostly testing” or a fixed ratio.
- **Handwriting:** Lyu et al. concerns different mappings/outcomes, not a universal handwriting advantage. Review abstract verified through the authors' HKU record; no new claim about an optimal copy count.
- **Visual load:** Hou & Jiang found interference on recognition measures, but no significant character–meaning matching difference. “All animation/color is harmful” would overstate it.
- **Interleaving:** evidence varies by materials; arbitrary modality switching is not the same intervention as category interleaving.
- **University practice:** the MIT streamlined course serves learners with prior spoken Chinese. Its writing discussion is useful, but cannot establish an absolute beginner's rate. The regular beginner syllabus is considered separately.
- **Product documentation:** Skritter has raw-stroke modes; its default also supports stroke snapping. Raw writing is not its universal default. Glossika's cited mode guide is explicitly legacy documentation.
- **Assessment:** Charsiu alignment is not pronunciation grading. OMPAL is an annotated corpus, not a ready scorer. ToneForge's current repository/license could not be verified. Azure's documented prosody assessment is en-US-only, not a Mandarin tone-quality guarantee.
- **Access limits:** Delgado et al.'s publisher text was unavailable in this pass; its broad reading-media finding was checked against the research team's university report. Do not use it for detailed effect estimates or Hanzi motor-learning claims. Yao et al. (2025; DOI 10.1044/2024_JSLHR-24-00432) remains an existing citation, but its full abstract could not be retrieved reliably here; numerical claims are not carried forward. The accessible HVPT review supports the narrower phonetic finding below. Nation's Four Strands remains a pedagogical framework, not an experimentally established allocation ratio; see curriculum note for access limits.

Historical build reports remain historical. This consolidation imports completed research with its recorded source/access limits; it does not claim a new literature review or benchmark rerun. Earlier findings above are qualified by the later Paper and Speaking notes. No application code, content, scheduler, writing targets, analytics or deployment changes.

## Open questions

Which uncertainty is actually preventing a product decision? Start with the relevant note's questions and real-use evidence; do not expand this into an exhaustive bibliography. Meta-learning research is now [completed](meta-learning.md); implementation remains an unselected backlog item. [Roadmap](../ROADMAP.md) records branch provenance and current status.
