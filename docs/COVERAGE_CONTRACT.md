# Coverage contract

Effective 2026-09-30. Applies project-wide to UI, content, audio, learning logic, human review and release QA. Linked from repository AGENTS.md. User-authorized scope still governs what work is performed.

## Exhaustive

Before claiming exhaustive coverage:

1. Define the population, source revision, reachability boundary, counting unit and exclusions.
2. Enumerate the population automatically wherever practical. Register dynamic generators and external inputs as families; do not pretend infinitely many values were exercised.
3. Match every member to an explicit review/check disposition. Show numerator and denominator, including missing/unclassified members. Demonstrate 100% accounting of the defined population.
4. State separately what the check cannot establish: visual semantics, correctness, human approval, physical device behavior or other non-automatable aspects. Enumeration is not proof of quality.
5. Where membership can be checked automatically, fail the relevant QA for new/unclassified or stale members. No silent blanket approvals.

Examples: audio asset inventory is distinct from acoustic/native review; an enumerable content list is distinct from actual reviewer sign-offs; enumerating scheduler branches is distinct from proving learning effectiveness.

## Representative

Name the sampled cases, why they cover relevant state families and what was not tested. Viewport/browser/device combinations are part of that sample. A high number of passing cases does not establish complete product coverage.

## Reporting

Use “all”, “complete”, “none remaining”, “exhaustive”, “100%” (and German equivalents) only with the applicable population evidence. Always attach the boundary to the claim. Report inventory coverage, functional tests, visual sampling and human review separately.

Do not retrospectively upgrade old evidence. If an earlier report overclaimed, append a dated correction in a new report/status record with a link to the original. Preserve the historical report.

## Current production text contract

[UI_TEXT_COVERAGE.md](UI_TEXT_COVERAGE.md) defines the current population and audit. `npm run check:ui-text` is part of `npm test` and the production build.

- `scripts/ui-text-inventory.mjs --list` emits candidates, source positions, resolved task prompts and source hashes.
- `qa/ui-text/inventory.json` contains reviewed source boundaries and explicit decisions keyed by file, source kind and text hash. No automatic acceptance/update command exists.
- For a changed source, inspect its diff and text paths, classify new candidates and remove stale decisions, then update that source's reviewed hash. Source hashes intentionally also catch changed output routing, new imports, or reuse of old strings in new contexts. This is conservative and can require review after a non-text change.
- Allowed functional classifications: `orientation`, `action`, `learning-content`, `feedback`, `necessary-system-information`, `redundant`. Internal identifiers are explicitly `non-display`; they are not invented UI copy. Development, unused, compatibility and suppressed sources remain separately accountable.
- A reviewer must justify classifications. A green inventory check demonstrates that the current sources match the reviewed ledger; it does not machine-prove that every semantic decision was wise.
