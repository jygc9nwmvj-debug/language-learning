# Paper Writing v2: one A4 physical prototype

2026-09-29. Isolated research artifact. [Evidence and design decisions](../../docs/research/paper-writing-v2.md).

## Deliverables

- [Print-ready single-page A4 PDF](../../output/pdf/paper-writing-v2-a4.pdf)
- [Fixed source/template](make_sheet.py)
- [Research note](../../docs/research/paper-writing-v2.md), with evidence ledger, eleven design questions, grid comparison, target-selection criteria, separate progression speeds and the deferrable-paper assessment.

No worksheet engine, application import, network call, scheduler hook, learner-state read/write, QR code, OCR or camera facility is added.

## Actual baseline found

The chat's initial project mirror contained only its `AGENTS.md` and an empty read-only `sources/` directory; it was not a Git repository. The actual repository was located at `/Users/wolframhuke/Desktop/language-learning`.

- Branch `main`; local HEAD and remote `main` both verified as **`acfa24938a4d516942f8deface61f8e29fd3c9c4`**, subject `[CF-Pages-Skip] Document curated research knowledge base v0.1`.
- Original working tree was **dirty**, with unrelated changes in research/pronunciation work and production files including `LessonRunner.tsx`, CSS, progress DB, Mandarin introduction/exercise/phrase components, Lesson-1 content, audio tooling and personal-name work. None was copied as a working change, staged, reverted or edited by this task.
- Created an independent local clone of committed HEAD, with its own `.git`, under this chat's writable workspace. R&D branch: **`research/paper-writing-v2`**. This avoids sharing the original checkout/index with ongoing work.
- Production was checked through read-only HTTP asset fetches, without opening a learner session: **`Testversion F-light · E · UI1 · C2.3+ · Inhalte D`** at [the normal app](https://language-learning-abk.pages.dev/). The uncommitted local `Name1` label was **not** in the fetched live bundle.
- Live entry: `/assets/index-D-lc3O-Z.js`, SHA-256 `469301b64301ab632579a36049719378d85ac07819ef3a52c6c1aaf508879885`. App bundle: `/assets/App-f-KmE21Q.js`, SHA-256 `b8c581f4e9db1390a5dbb7d1b55c6e41f97c19af882182b94144f92fe3c2ecd5`. These establish served bytes/version, not an exact deployment commit; the latter was not exposed and is not claimed. An installed device may still have an older cached build.

### Architecture inspected

React/TypeScript/Vite PWA, local Dexie/IndexedDB state and append-only events, canonical JSON plus derived Mandarin tasks, local Hanzi Writer 3.7.3 and pinned character data. No account-based learner service.

| Area | Actual inspected behavior |
| --- | --- |
| Writing Foundation | Canonical movement demonstration, real learner ink, supported stages and later blank recall. Existing counts vary by target and are already described as hypotheses. |
| Active targets | **Eight total:** 好、你、我、人、一、二、三、十. The five in Build D were additions, not the complete current set. `writing-targets.ts` is authoritative. |
| C2.3 | Per-item/per-dimension introduction evidence; Hanzi focus without dominant Pinyin followed by association; recognition does not imply writing. Missing prerequisites redirect to introduction/guided work. |
| Continuous Learning | Small mixed plans, due/consolidation/new material and a selective writing slot. Existing time/quantity settings are pilot hypotheses. |
| Build E | Optional paper group at a session ending, older writing/meaning introductions, exclusions for recent practice and offer cooldowns. Skip is neutral. Group self-report does not update individual character relations. |
| F-light | Assistance/provenance/dimensions/actual intervals; foreground-time estimate can omit offline effort. No real learner export was supplied or analysed. |
| Existing print | `Worksheet.tsx` prints 好 with six fading cells, six recall cells and visible contextual forms. CSS requests A4. This existing worksheet is unchanged; the new artifact is separately generated. |
| Visual system | Large language forms, quiet tools, generous spacing, system text and handwriting-specific reference data. The print version uses white stock and neutral ink rather than a full-page colored background. |

Read before authoring: `LEARNING_ARCHITECTURE.md`, `PRODUCT_OBSERVATIONS.md`, research README and the Hanzi, hybrid, curriculum and learning-science notes; Writing Foundation/Fading, C2.3, Continuous Learning, Build E, F-light, Product UI and deployment documentation. Relevant implementations were also read, including writing targets/exercise/worksheet, introduction, continuous/hybrid planning and evidence classification. Historical README/build names were not accepted as the current production version.

## Design rationale

**Two current practice targets:** 人 (two oblique strokes) and 好 (six strokes, left/right construction). **Two earlier-learning recall cues:** `du` and `ich`, corresponding to existing 你/我. Their personal learning status is unknown; only use those fields if introduced and practised in an earlier session. Otherwise leave them blank, without treating that as failure.

The form-building block has three pen productions per target: one trace, one visible-model copy, one immediate hidden-model attempt. This is a small usability hypothesis, not an evidence-based dose. All writing fields are **28 × 28 mm**. The first two have 田字格 midlines; the recall fields retain only the outer square. Constant size makes support removal easier to interpret. There is no extra 米字格 stage merely to exhibit more grids.

Hanzi are the app's existing **Kaiti/regular-script vector paths**, not approximations drawn by a language model or Songti print glyphs. Model data and source stroke order are unchanged. Nine-point stroke-start labels sit in separate outlined white badges with thin leaders, only on the model, never in the writing fields. They identify order/start; they cannot teach direction on their own. The existing digital movement demonstration supplies that information.

Pinyin and a short canonical German meaning sit below the two models, not inside the writing squares. The later recall cues have no target Hanzi or Pinyin. No radical explanation, color coding, mnemonic, or step-by-step static stroke film competes for attention.

### Answer concealment

Before starting, fold the bottom **31 mm** strip backwards at the dashed line. The two delayed solutions are upside down and entirely below that line. They occur nowhere else on the worksheet. Do not treat inversion alone as concealment: fold or cover the strip. Prepare it without studying the solutions; if an answer was already seen, the corresponding attempt is not clean delayed recall.

For the immediate third column, place an opaque sheet over everything **left of the vertical line**, including the printed models, traces and the learner's own copies. A thumb over only the model is insufficient. The German cue remains visible beside the empty square. Uncover only after that attempt. Repeat this handling for each row. The first two columns are deliberately **not** called recall.

The lower recall section uses different characters from the upper block, so the upper models do not display its full answers. This does not eliminate all priming from related shapes. Self-check compares form/spacing/missing strokes; it cannot objectively recover writing order from the finished ink. Exact cue ambiguity, fold show-through and handling remain physical test questions.

## Physical test after the pilot

**Protect the current 5–7 day pilot:** preparing a sheet is separate R&D, but practising its targets would still change the current learner's exposure outside F-light. Use it with the pilot learner **after the frozen window and pilot review**, or conduct only a non-learning handling/print check beforehand. Do not insert new practice into the current learning flow or log synthetic paper success.

Print **one-sided, A4 portrait, actual size / 100%**, without fit-to-page. Use normal uncoated paper and the intended pen; start with the paper already available rather than buying special materials. The PDF requests no print scaling, but the printer dialog can override that. Measure a square: it should be 28 mm. Start with an opaque cover sheet and the answer strip folded away.

Observe once through normal use; no additional measurement drills are required:

1. Is 28 mm comfortable, cramped or unnecessarily large with this pen? Is there room to rest the hand?
2. Are the ghost models and dashed midlines visible in the actual printer output without competing with the ink?
3. Can every number, especially 2 versus 3 on 好, be read and matched to its stroke start? Do the leaders confuse the form?
4. Does removing the model, then the midlines, feel useful or abrupt? Is the tracing step redundant for 人?
5. Does three immediate productions feel too much or too little? Record the experience; do not infer an optimum from one sheet.
6. Does the cover hide earlier handwriting as well as models? Does the fold stay shut, remain opaque and avoid revealing the answers while handling the page?
7. Were the two lower targets actually learned in a prior session, and roughly when last seen/practised? Separate unaided, helped, uncertain and not-yet-learned attempts. Do not count blanks as forgotten knowledge by default.
8. Does the page feel adult, calm and worth using? Would a normal paper opportunity be welcomed, and would “Später / gerade kein Papier” preserve convenience?

A next-session return to the upper targets can later test the feasibility of **delayed** recall on a fresh hidden-answer surface; do not call the immediate third column that test. No promised exact delay, automated schedule or extra worksheet is included. A single physical trial can inform usability; it cannot establish comparative learning efficacy.

## Reproduce the PDF

```sh
python3 tools/paper-writing-v2/make_sheet.py
```

Requires Python 3 and `reportlab`. The checked source uses the existing repository character JSON files and validates the four IDs/forms/tone numbers/German meanings against canonical content. It reads no learner data. Output is always `output/pdf/paper-writing-v2-a4.pdf`.

On macOS the template embeds system Arial/Arial Bold for Latin text and Pinyin. On another system, set `PAPER_FONT_REGULAR` and `PAPER_FONT_BOLD` to suitable embeddable TrueType fonts containing the tone-marked vowels. Character shapes remain vector paths, independent of installed CJK fonts. No font files are vendored. Character-model licensing is retained at [ARPHICPL.txt](../../public/licenses/ARPHICPL.txt); upstream provenance is [Hanzi Writer Data](https://github.com/chanind/hanzi-writer-data) / [Make Me a Hanzi](https://github.com/skishore/makemeahanzi#sources).

## Verification and isolation

The artifact is checked as a one-page A4 PDF with embedded text fonts, vector character paths, correct canonical targets and valid page geometry. The final raster render is inspected for overlap, clipping and legibility. Concealment coordinates are checked, including the solution strip and the empty recall fields. These are print-file checks, **not a claim of having printed or written on it**. Physical pen comfort, printer gray reproduction and folding still require the trial above.

Final file check (2026-09-29): 210 × 297 mm; eight 28 × 28 mm fields; six fields without prefilled character paths; both rendered text fonts embedded; all 14 strokes of the two solution characters below the 266 mm fold. The final 160-dpi page render was visually reviewed. PDF SHA-256: `6f2f3fc2fefb74bc693200c9a68a70e4c0481fbedf2a76a6a7bd05dc789826e2`.

Only `docs/research/`, `tools/paper-writing-v2/` and this one PDF belong to the change. No production tests/build are needed or added; the app code and architecture contract are unchanged. Commit prefix `[CF-Pages-Skip]` prevents Cloudflare's Git integration from deploying this research push, including a preview; see [Cloudflare's documented behavior](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/#skipping-a-build-via-a-commit-message). Push only the R&D branch, with no merge or deployment.
