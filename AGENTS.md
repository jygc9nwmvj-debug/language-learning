# Project audit and QA coverage

For audits and QA (UI, content, audio, learning logic, human review and releases), follow [docs/COVERAGE_CONTRACT.md](docs/COVERAGE_CONTRACT.md).

Declare `exhaustive` or `representative` coverage, its population and exclusions before drawing conclusions. Test counts do not prove population coverage. Do not rewrite historical reports to imply stronger evidence.

For production text changes run `npm run check:ui-text`. Review changed source contracts and each new/changed text or dynamic output family in `qa/ui-text/inventory.json`; do not auto-approve or blanket-classify new entries. `--list` enumerates candidates but does not update approvals. Keep language content, assessment and recording semantics unchanged unless separately authorized.
