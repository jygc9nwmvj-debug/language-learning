# Physical prototype iteration 2

2026-09-29. Narrow R&D continuation of `985f072` on `research/paper-writing-v2`. No new literature review, production integration or learner-state access.

## Files and preservation

- [Prototype v2, one-page A4](../../output/pdf/paper-writing-prototype-v2-a4.pdf)
- [v2 fixed generative source](make_sheet_v2.py)
- [Preserved v1 PDF](../../output/pdf/paper-writing-v2-a4.pdf) and [preserved v1 source](make_sheet.py)

The original filename contains the research project's name “Paper Writing v2”; it is **prototype v1**, not the new iteration. Both PDFs and both sources remain separate. Running the new source writes only the new PDF. V1 is preserved byte-for-byte for comparison, including its now-known recall-eligibility defect; its lower section is **not an appropriate writing assessment for this learner**.

## Learner feedback and scope

The learner reports three concrete findings from reviewing the first printed/prototype design: 28 mm feels unnecessarily large; three immediate productions feel too sparse for a genuinely new target; 你 and 我 are recognized but have **not** been deliberately learned as active handwriting. These are reported experience and prerequisite information, not a controlled efficacy result or a diagnosis.

V1's conditional instruction to use only previously practised characters did not justify preselecting those two prompts. Recognition, known meaning/Pinyin, appearance in content and membership of the active-target inventory are all insufficient evidence of personal writing introduction. V2 corrects this through omission, not another disclaimer beside an ineligible prompt.

## Change log: v1 to v2

| Aspect | Preserved v1 | New v2 |
| --- | --- | --- |
| Writing cells | 28 × 28 mm | **21 × 21 mm**, identical across all four stages |
| Productions per current target | Three | **Four**; model observation does not count as a production |
| Support | Trace with cross; copy with cross; hidden-model plain square | Trace with cross; copy with cross; copy without cross; hidden-model plain square |
| Current practice examples | 人 and 好 | Same two existing targets; no content additions |
| Delayed section | Meaning cues for 你/我, with folded answers | **Omitted completely**; no confirmed eligible prior-writing set |
| Concealment | Cover before third field, plus solution-strip fold | One opaque cover before fourth field; no answer strip or folding |
| Page | Two practice rows plus lower recall area | Two widely separated practice rows, four columns, open space |
| Stroke labels | 9 pt secondary-gray numbers in white outlined badges | Same readable size and treatment; reference model remains 34 mm |

Twenty-one millimetres is the midpoint of the requested trial range. It leaves separation between four writing columns and the cover boundary while keeping the complex 好 example available for proportion work. The choice is a **PRODUCT HYPOTHESIS**, not a measured comfort result or scientifically optimal size. Smaller writing fields do not require smaller reference models or stroke labels. 我 is not added as a recall prompt merely to test complexity.

## Four productions and physically real fading

Before writing, observe the existing movement demonstration as needed and connect the form with its sound/meaning. The two page examples are representative current-practice targets, not a claim that both are personally new or that a scheduler selected them.

1. **Trace:** a light canonical form in a 21 mm 田字格 provides strong support.
2. **Copy:** the ghost form disappears; the model remains visible and the same-size cross grid supports placement.
3. **Copy without cross:** the visible reference remains, but only the square boundary guides proportions. This is still assisted copying, deliberately labelled “Ohne Kreuz,” not memory or delayed recall.
4. **Same-session memory:** cover everything left of the dashed vertical line with an opaque sheet, including the model, trace and **all own copies**. Only a meaning cue and a plain square remain visible. Reconstruct once, then uncover and compare.

Work across one row before starting the next. Covering only the printed model is inadequate. If a form was visible during the last attempt, it was assisted. All character paths are left of the 161 mm cover boundary; the final squares begin at 173 mm. Keep an external model/screen out of view during that attempt too. No amount of spatial separation alone makes a visible answer hidden.

This adds one physically distinct motor production without a row of identical copies. First the trace disappears, then the midlines, then the reference and previous attempts. We choose four, within the requested four-to-five range, rather than fill space with a fifth. Count, size and this exact fading sequence are all **PRODUCT HYPOTHESES**. Existing [research](../../docs/research/paper-writing-v2.md) supports bounded handwriting, retrieval and distributed-practice principles, not this dose or layout.

## Same-session memory is not delayed recall

The final column, “Jetzt erinnern,” follows guidance and copying in this sitting. It is initial learning practice, **not evidence of long-term retention** or proof that writing introduction was sufficient. It does not record mastery or change any learner data.

Delayed recall requires deliberately introduced **active writing from earlier learning**, plus an actual later return. No eligible set is confirmed in the supplied state: 你/我 are explicitly ineligible; the report does not establish prior active-writing introduction for any replacement. Therefore **no characters appear in delayed recall in v2**. Reviewing v1 does not by itself prove that its practice was completed. We do not fabricate alternatives or infer eligibility from recognition.

The future static/dynamic distinction is documented, not implemented:

- **Top/current:** selected new or consolidating active Writing Targets receive appropriate introduction and progressive physical production.
- **Bottom/later:** only targets with affirmative prior active-writing introduction (`writingIntroduced == true` conceptually) may be considered for later recall. Active-target status alone is insufficient; unknown introduction status excludes a target. Actual learner state and a future scheduler decision would determine selection and timing.
- No eligible targets means a reduced or omitted section. No placeholder tests, invented learner history, fixed interval, prioritization formula or scheduling algorithm is introduced here.

## Print and compare physically

Print v1 and v2 **A4 portrait, one-sided, actual size / 100%**. Confirm 28 mm on v1 and 21 mm on v2 with a ruler; printer settings can override the PDF's no-scaling preference. Use the intended pen, ordinary paper and an opaque cover sheet. Leave v1's ineligible delayed-recall fields unused. Protect the production pilot: actual extra writing changes learning exposure even without app events, so conduct learning practice after the frozen pilot/review; layout/handling inspection alone is separate.

Compare these questions with the pen; screenshots cannot answer them:

1. Is 21 mm more comfortable/natural than 28 mm, with sufficient hand space?
2. Is 好 still large enough to construct its left/right proportions deliberately? Comfort with other complex early targets such as 我 remains untested here, not inferred from 好.
3. Do four productions feel useful or repetitive, and does that differ for simple 人 versus 好 or a genuinely new versus familiar target?
4. Does removing ghost, cross and then visible examples feel natural and clear?
5. Can the last attempt happen without seeing any printed model, own copy or screen answer? Is the cover easy to place and remove?
6. Are the 9 pt numbers and leaders clear in grayscale, especially 2 versus 3 on 好, without dominating the form?
7. Does the page remain calm, generous and adult despite the extra writing column?
8. Is delayed recall correctly restricted to **previously writing-introduced** targets? Here its absence is intentional; “actual Writing Target” must not be confused with individual eligibility.
9. Would this be comfortable to use repeatedly, rather than merely attractive once?

Printing/writing the same targets twice introduces practice and order effects. Use the comparison for comfort, handling and perceived burden, not a claim that v2 caused better retention. No comparison answers or physical comfort findings are inferred from the rendered preview.

## Reproduction and print-file checks

```sh
python3 tools/paper-writing-v2/make_sheet_v2.py
```

Python/ReportLab, embedded system Arial/Arial Bold (or the documented font overrides), and the unchanged canonical Hanzi Writer data are used as in v1. The new file is a fixed standalone template; helper code is retained locally rather than importing and executing v1's PDF-writing script. No dynamic worksheet engine, network call, app import or learner-state read/write is added. See the [existing provenance/license note](README.md#reproduce-the-pdf).

Print-file verification covers A4 geometry, eight 21 mm writing fields, two traces and six blank fields, reference/number separation, absence of delayed prompts/solutions, embedded rendered text fonts and a visually inspected grayscale render. This verifies the file, **not actual printer output or pen comfort**. V1 PDF/source identity is checked against the preceding commit. Only prototype files and related documentation are changed; no production tests/build/deployment are required.
