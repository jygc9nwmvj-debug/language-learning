# Roadmap — Mandarin learning pilot

Verified 2026-09-29. Current priorities and status, not a commitment to build the backlog. No dates are assigned to unselected work.

## Start here

Read [Learning Architecture](LEARNING_ARCHITECTURE.md) → [Product Observations](PRODUCT_OBSERVATIONS.md) → this roadmap → [research index](research/README.md) and the relevant notes → [Pilot Evaluation Protocol](PILOT_EVALUATION_PROTOCOL.md). Architecture states design decisions; remote main and served production establish implemented behavior. Historical Master/build reports record earlier scopes, not current priorities.

Keep **external research evidence**, **product/learning architecture**, **real-use observations**, **measured learner evidence**, **product hypotheses**, **experimental prototypes**, and **deployed behavior** distinct. No real pilot outcomes were analyzed in this consolidation.

## Current state

| State | Scope / decision |
| --- | --- |
| **PRODUCTION** | German local-first Mandarin baseline `b229877377b664bdc737106f661852445f76eff5`: recording replay lifecycle fixed (`183c342`), Assessment Intent / answer leakage corrected (`bc0e5c6`), artificial stop and completion boundary removed (`b229877`). Internal batches continue automatically; voluntary exit remains. Existing optional Build E Paper/Screenless activities are distinct from Paper Writing v2. |
| **PILOT** | Real multi-day Mandarin learning underway. Production freeze except genuine bugs. Existing F-light collects bounded evidence under the unchanged [pre-specified protocol](PILOT_EVALUATION_PROTOCOL.md). **NO CRITICAL PRODUCTION-INSTRUMENTATION GAP.** No new probes, questionnaires, analytics, telemetry or report-code changes. |
| **ACTIVE LAB** | None found active. Completed previews do not count as active work. No next Lab/Product track selected. Uncommitted personal-name work is retained separately; it is neither deployed nor selected here. |
| **PHYSICAL VALIDATION** | [Paper Writing v2](research/paper-writing-v2.md): initial preference for ~21 mm cells over 28 mm and slightly more immediate production. Prior Writing introduction is required for delayed recall. 好 suggests a copying-to-free-recall scaffold gap; earlier Look → Cover → Write → Check is a product hypothesis, not established evidence. No v3 or integration. |
| **RESEARCH DONE** | [Meta-Learning](research/meta-learning.md): eight candidate moments, evidence limits; JIT remains a hypothesis. [English v0 architecture](I18N_ENGLISH_V0_ARCHITECTURE.md): one canon, presentation localization and independent learner state; no English release approved. [Speaking v2](research/pronunciation-assessment-rd.md): tested F0 approach NO-GO; future local pronunciation assessment remains open. |
| **DONE / RESOLVED** | Replay stuck after natural end; assessment-intent / answer-leakage correction; proactive Meaningful Stop fragmentation. Original observations A/C/D are preserved with resolution status. Evaluation protocol completed; no learning-efficacy verdict follows. |

Protocol gate remains **7 elapsed days + 5 confirmed learning bouts + 120 valid active minutes**; internal batch IDs do not equal learner sessions. Dimension-specific coverage and small-count rules are unchanged. The full protocol, including uncertainty and partial-review rules, governs interpretation.

## WATCH

- **Microphone level OPEN:** healthy macOS indication can coexist with extremely quiet real recordings. Synthetic tests did not reproduce the physical issue. No speculative gain/normalization deployed; representative hardware diagnosis remains needed.
- **Audio differentiation:** Natural and `careful_slow` sometimes sound barely different. Future pairwise QA must ask whether slow provides a useful listening aid, separately from linguistic correctness. No regeneration now.
- Provisional audio still needs human/native review; current source acceptance is not native linguistic approval.
- Beginner explanation clarity, including predictable answer-option ordering flagged by the assessment audit.
- Paper scaffold transition for 好; digital writing-grid/stroke-number legibility. Initial physical preference is not measured learning efficacy.
- Phrase segmentation: 15 older unannotated expressions remain listed in [C2.3](BUILD_C2_3_PHRASE_COMPREHENSION.md); semantic gloss quality and the limits of one-to-one Hanzi/syllable alignment remain open. Structural validation is not semantic review.

## BACKLOG

| Group | Unselected work |
| --- | --- |
| Learning / curriculum | Multi-speed skill progression; selective Writing curriculum; Learning Engine v2 only after pilot evidence; larger multi-week content/curriculum. |
| Writing / paper | Paper integration after physical validation; digital grid and stroke-number legibility; audit current Writing Targets after pilot. |
| Content / explanations | Beginner editorial pass; future JIT Meta-Learning; remaining segmentation/content QA. |
| Audio / speaking | Physical microphone-level diagnosis; human pairwise Natural vs Slow review; native audio review; pronunciation-assessment research if a materially better candidate appears. |
| i18n / external review | English productionization; locale-specific meaning-answer semantics; German-speaking Taiwan tester; Taiwan Mandarin native reviewer; possible future Native Review Mode. No contact or recruitment authorized here. |
| Product / design | Motion Language; future non-intrusive stop recommendation remains open and is not implemented. |
| Transparency / legal | Privacy; Imprint/legal requirements before broader external use; public “How learning works / Research & sources” page. |
| Infrastructure | Identity / Backup / Sync later (existing local export/import already works); Research Mode for larger external testing later. |
| Identity | Naming later. “Mandarine” is only an early candidate; domain/app-store/trademark/DE–EN review required before a decision. |

## Workflow and limits

**LEARN → CAPTURE → CLUSTER → MEASURE → RESEARCH → PRIORITIZE → BUILD → FREEZE → LEARN.**

Production: at most one bugfix/change cluster. Pilot: ongoing. Active Lab: at most one implementation/prototype track. NEXT: at most one explicitly selected Lab/Product track; currently none. Backlog ideas may accumulate without triggering work. **Observation ≠ task. Idea ≠ roadmap commitment.**

Production Work executes genuine fixes/builds; Lab Work isolates research/prototypes; Evaluation Work handles measurement validity and pilot analysis. Project/Product decisions are made outside Work execution, based on evidence and priorities. Maintenance Work preserves canonical knowledge and repository consistency; it does not authorize product changes.

## Verified main and served baseline

Remote heads were fetched and queried directly on 2026-09-29; starting main was `b229877`. Read-only HTTP checks of [production](https://language-learning-abk.pages.dev/) found worker cache `mandarin-v01-7924864fc57d5423`. Live `sw.js` and `assets/App-Z-IRrE4i.js` matched the existing local build byte-for-byte (SHA-256 `fef17b6dbf825548ad99585a83edc18faa4d6d9585b90933c094c234254ef905` and `df4729cd5cfe83d1f57c2aa7c7a15d03406a9e0dbcf33e6521899579c1efeb62`). This verifies served assets, not the cached version in an already-open learner PWA. No learner browser/database was opened.

This consolidation advances main's documentation only; production behavior stays at that baseline. The protocol was preserved byte-for-byte from its completed local document (SHA-256 `7314021024877cf5472f50e836cfbac9109ca932f108be169d2b94b65949c1fb`).

## Branch and working-tree inventory

Snapshot before consolidation. “Knowledge preserved” means selective documentation import, not a Git merge of the branch. No branch was deleted. Recheck remote heads and dirty state before any future cleanup.

| Branch / location | Verified state | Knowledge / retention classification |
| --- | --- | --- |
| Remote `main` | `b229877`; three recent production fixes present | Authoritative behavior baseline; documentation consolidation is based directly on it. |
| `research/paper-writing-v2` | Local and remote `b976cf7`; clean `paper-writing-v2-rd` checkout | Research and four KB corrections preserved on main. PDFs, generators and physical iteration notes intentionally retained on branch under `output/pdf/` and `tools/paper-writing-v2/`. First sheet superseded for current physical use, but preserved as history. Do not delete branch during validation. |
| `research/just-in-time-meta-learning` | Local/remote `02b7922`; clean `meta-learning-rd` clone | Complete research note and curriculum cross-reference preserved on main. Documentation-only branch, superseded as canonical knowledge; eligible for later archival/deletion after confirming no new unique changes. |
| `lab/english-v0` | Local `e49b931`; clean `i18n-lab` clone; no matching remote branch | Architecture audit preserved on main. Six-item preview, inventory, tests and screenshots intentionally retained locally under `tools/i18n-lab/`. Not remotely backed up; retain checkout/commit. No English production implementation merged. |
| Speaking v2 R&D | No local/remote Speaking branch found. Untracked report and `tools/pronunciation-assessment-rd/` in desktop checkout | Full negative report, reproduction instructions and artifact fingerprints preserved on main. Scripts/raw results remain local and uncommitted; retain them, not safe to delete. Secondary experiment copy: earlier Work directory `work/tone-rd`. No corpus, weights or experiment code imported. |
| `fix/recording-reliability`, `fix/assessment-intent`, `fix/continuous-boundaries` | Local tips `183c342`, `bc0e5c6`, `b229877`, all ancestors of remote main | DONE; branch names eligible for later cleanup, subject to checkout/process use. `recording-reliability` checkout initially had only the untracked completed protocol; reused on updated local main for this documentation task. |
| Remote `a1-test-harness` | `ecf68e1`, ancestor of main | Historical completed work; eligible for later cleanup after checking use. |
| Local `a2-audio-qa` / cached `origin/a2-audio-qa` | `78e6c97`, ancestor of main; no live remote branch exists | Superseded; stale tracking ref is not an active remote branch. Eligible for later local cleanup. |
| Desktop `language-learning`, local main | `acfa249`; cached origin/main stale. Dirty personal-name production work plus Speaking report/KB edits | Leave untouched. Not current main, not a production baseline, and not safe to archive/delete or merge wholesale. Personal-name correctness work is unresolved local work, not an active Lab commitment. |

Local repository locations: project-mirror siblings `paper-writing-v2-rd`, `meta-learning-rd`, `i18n-lab`, `recording-reliability`; separate desktop checkout `/Users/wolframhuke/Desktop/language-learning`. Speaking's second copy is `/Users/wolframhuke/Documents/Codex/2026-09-27/referenced-chatgpt-conversation-this-is-an/work/tone-rd`. These paths locate artifacts; current product knowledge is in main's canonical documents above.
