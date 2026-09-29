# Research Knowledge Base v0.1

Reviewed: 2026-09-29. Curated evidence notes, not a systematic review or a new implementation specification. No papers, model weights or datasets are vendored here.

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
| [Just-in-time meta-learning](meta-learning.md) | Eight candidate explanation moments, distinct claim types/evidence levels, presentation limits and Paper Writing research still outside main |
| [Mandarin pronunciation and tones](mandarin-pronunciation-tones.md) | Perception versus production, contextual tones, assessment R&D and licenses |
| [Hanzi recognition and writing](hanzi-recognition-writing.md) | Different outcomes, selective writing, components, stroke guidance and target selection |
| [Hybrid digital/paper](hybrid-digital-paper.md) | Media limits, offloading/distraction/rest, proposed Paper Writing v2 |
| [Curriculum progression](curriculum-progression.md) | Communication, separate skill speeds, standards and university examples |
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

Future Work proposing learner-facing explanations must first consult [just-in-time meta-learning](meta-learning.md). Distinguish linguistic fact, learning-science evidence, product rationale and product hypothesis; a well-supported learning principle does not establish the benefit or timing of its explanation.

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

Historical build reports remain historical. This consolidation does not rewrite their claims or alter application code, content, scheduler, writing targets, analytics or deployment.

## Open questions

Which uncertainty is actually preventing a product decision? Start with the relevant note's questions and real-use evidence; do not expand this into an exhaustive bibliography. The former meta-learning backlog is developed in [just-in-time meta-learning](meta-learning.md); all presentation/trigger choices remain unimplemented hypotheses.
