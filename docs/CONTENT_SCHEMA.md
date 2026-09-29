# Content Schema v0.1

## Principle

The platform stores **language concepts separately from lesson presentation**.

A lesson references stable IDs. The same item can occur in many lessons and many exercise directions without duplication.

---

## 1. Core entities

### LanguagePack

```ts
type LanguagePack = {
  id: string;
  name: string;
  locale: string;
  writingSystems: WritingSystem[];
  defaultWritingSystem: string;
  modules: string[];
  lessonIds: string[];
};
```

Core does not know what `tone`, `hanzi`, or `pinyin` mean.

### LearningItem

Generic identity and skill targets:

```ts
type LearningItem = {
  id: string;
  kind: "lexeme" | "phrase" | "sentence" | "grapheme" | "concept";
  languageId: string;
  meanings: LocalizedMeaning[];
  audio?: AudioVariant[];
  skillTargets: SkillDimension[];
  tags?: string[];
  languageData?: unknown;
};
```

`languageData` is validated by the active language pack.

### Lesson

```ts
type Lesson = {
  id: string;
  languageId: string;
  title: LocalizedText;
  objectives: string[];
  prerequisites: string[];
  introduces: string[];
  reviews: ReviewSelector[];
  steps: LessonStep[];
  exitChecks: LessonStep[];
  discoveries?: LessonStep[];
};
```

### LessonStep

Generic contract:

```ts
type LessonStep = {
  id: string;
  type: string;
  targets: string[];
  config?: Record<string, unknown>;
  required?: boolean;
  scaffold?: ScaffoldPolicy;
};
```

Exercise implementations are registered by `type`.

---

## 2. Mandarin extension

A Mandarin lexeme can add:

```ts
type MandarinLexemeData = {
  traditional: string;
  simplified: string;
  pinyin: string;
  syllables: MandarinSyllable[];
  partOfSpeech?: string;
  usageNotes?: string[];
  regionNotes?: {
    mainland?: string;
    taiwan?: string;
  };
};
```

### MandarinSyllable

```ts
type MandarinSyllable = {
  pinyinBase: string;
  tone: 1 | 2 | 3 | 4 | 5;
  surfaceToneHint?: 1 | 2 | 3 | 4 | 5;
};
```

The underlying lexical tone and surface pronunciation must not be conflated.

### Hanzi data

```ts
type HanziData = {
  traditional: string;
  simplified: string;
  readings: string[];
  meanings: string[];
  components?: CharacterComponent[];
  strokeData?: StrokeAsset;
  etymology?: EvidenceNote;
  mnemonic?: MnemonicNote;
};
```

### Evidence distinction

```ts
type EvidenceNote = {
  text: string;
  sourceRefs: string[];
  confidence: "high" | "medium" | "uncertain";
};

type MnemonicNote = {
  text: string;
  label: "mnemonic";
};
```

A mnemonic must never be presented as etymology.

---

## 3. Audio

```ts
type AudioVariant = {
  id: string;
  src: string;
  locale: string;
  speakerId?: string;
  style?: "isolated" | "careful" | "natural";
  qaStatus: "generated" | "source_checked" | "native_reviewed";
};
```

A content item may have multiple speakers/styles.

---

## 4. Progress

```ts
type SkillDimension =
  | "meaning"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "usage";

type SkillState =
  | "unseen"
  | "introduced"
  | "assisted_success"
  | "unassisted_success"
  | "shaky"
  | "due_for_review";

type ItemProgress = {
  itemId: string;
  skills: Partial<Record<SkillDimension, {
    state: SkillState;
    attempts: number;
    successes: number;
    lastSeenAt?: string;
    nextReviewAt?: string;
  }>>;
};
```

Mandarin may attach additional diagnostics such as tone confusion, but the core skill state remains generic.

---

## 5. User preferences

Stored locally:

```ts
type LearnerPreferences = {
  languageId: string;
  writingSystem?: string;
  writingMode: "screen" | "paper" | "ask_each_time";
  pinyinPolicy?: "adaptive" | "always" | "minimal";
  displayName?: string;
};
```

---

## 6. Lesson 1 example

Lesson 1 does not contain duplicate definitions of 我, 你, 好.

It references stable IDs:

```json
{
  "id": "cmn-foundation-001",
  "languageId": "cmn",
  "introduces": [
    "cmn:phrase:nihao",
    "cmn:pronoun:wo",
    "cmn:pronoun:ni",
    "cmn:verb:jiao",
    "cmn:word:hao",
    "cmn:phrase:xiexie",
    "cmn:phrase:zaijian"
  ]
}
```

The lexicon holds their forms, audio and metadata.

---

## 7. Content validation

Every build validates:

- all referenced IDs exist
- all published items have required meanings
- Mandarin published lexemes have script forms and Pinyin
- audio paths exist
- lesson prerequisites exist
- exercise type is registered
- writing exercises have writing data or explicitly use paper/self-check only
- public content has required QA status
- mnemonic/etymology are not mixed
- Traditional/Simplified mapping is present where applicable

Validation failure blocks deployment.

---

## 8. Content lifecycle

Recommended repository layout:

```text
src/
  core/
  languages/
    mandarin/
      schema/
      content/
        lexicon/
        lessons/
        discoveries/
public/
  audio/
    mandarin/
docs/
```

Later:

```text
languages/
  mandarin/
  romanian/
  ...
```

No new language should require copying the core.

## 9. Implemented Mandarin phrase authoring contract (C2.3; audio updated for v0.5)

This section describes the current executable schema (`src/languages/mandarin/schema/content.ts`), rather than the conceptual entity sketches above. Follow `LEARNING_ARCHITECTURE.md` for assessment and scaffolding.

Every **new multi-character item** must include authored `exploration` metadata. Nothing is segmented or translated by runtime NLP. Example for the existing `speak-slowly` item:

```json
{
  "pronunciation": "surface",
  "units": [
    { "words": ["qing"], "syllables": ["qing3"], "gloss": "bitte", "audio": { "kind": "item", "item": "qing" } },
    { "words": ["shuo"], "syllables": ["shuo1"], "gloss": "sprechen / sagen", "audio": { "kind": "reference", "id": "detail-shuo", "src": "/audio/mandarin/polly-detail-shuo.mp3" } },
    { "words": ["man"], "syllables": ["man4"], "gloss": "langsam", "audio": { "kind": "reference", "id": "detail-man", "src": "/audio/mandarin/polly-detail-man.mp3" } },
    { "words": ["yidian"], "syllables": ["yi4", "dian3"], "gloss": "ein bisschen / etwas", "audio": { "kind": "reference", "id": "detail-yidian", "src": "/audio/mandarin/polly-detail-yidian.mp3" } }
  ]
}
```

- Each UI unit groups one or more **existing canonical word IDs**. Flattening all unit references must equal `item.words` exactly, in order. A meaningful unit can contain multiple Hanzi; neither characters nor legacy canonical word boundaries necessarily equal the desired explanation unit.
- Forms come only from those canonical references in the session's `hant`/`hans` script. Each Hanzi has one authored syllable in this deliberately restricted content model. Neutral tone uses `5`, rendered without an accent; punctuation is outside the syllable mapping. Unsupported forms require an explicit future schema change, not guessing.
- `pronunciation: lexical` must match canonical word tones; `surface` must match the item's existing explicit `surfaceToneNumbers`. Syllable bases/counts must match either way. Surface display does not change canonical truth or unlock tone assessment.
- A `gloss` describes this unit **in context**. Optional `characters: [{index, note}]` explains selected characters' roles without mechanically summing literal meanings. Index is zero-based within the resolved unit; duplicate/out-of-range indices fail validation.
- Required `audio` distinguishes existing-item reuse, a required independent detail reference, and a deliberate phrase-only model with a reason. See the v0.5 audio availability contract below. Missing audio decisions fail validation; audio is never inferred or sliced at runtime.
- `learning.note` and `learning.discovery` accept plain prose without Hanzi, or an array of prose and `{word, gloss}` references. Example: `[{"word":"qing","gloss":"bitte"}," macht die Aufforderung höflicher."]`. Rendering supplies primary-script Hanzi + canonical Pinyin + gloss. Raw Hanzi in these prose fields or exploration notes/glosses are rejected; referenced words must exist. Preserve authored spaces around reference tokens.
- Script-pair, mapping, coverage, reference and production-audio checks run at build time. They prove structural integrity, not linguistic correctness of editorial segmentation/glosses; content review still owns semantics.

`legacy-unsegmented.json` explicitly grandfathers 15 existing items. Do not add new content to this allowlist as a normal authoring shortcut. Remove an ID when its metadata is authored. Existing unmigrated items retain their prior plain display; they do not acquire inferred glosses. See the C2.3 report for the exact migrated and pending sets.

## 10. Introduction dimensions (C2.3 consolidated addition)

Every existing and future item declares `introduction: {dimensions, role, toneNote?}`. Supported dimensions: `meaning`, `pronunciation`, `tone`, `hanzi`, `segmentation`, `writing`. Meaning and pronunciation are required; other dimensions reflect actual learning targets. Roles are `spoken`, `recognition`, `writing`. Recognition/writing roles require Hanzi attention; only writing role declares writing. Segmentation requires authored exploration data. A declared tone assessment requires tone introduction; reading/number-transfer tasks require Hanzi introduction; writing tasks require writing eligibility. The optional tone note is authored prose, with the same no-unexplained-Hanzi rule.

Production records `introduction_dimensions` with item, exact tone numbers, version, dimensions, primary script/form and method. Tone retains the explicit `tone_attention_confirmed` event plus notation prerequisite. Hanzi-focus acknowledgement alone is not completed association: `hanzi_attention_confirmed` permits resuming at connection; completing the form/sound/meaning connection records Hanzi and meaning introduction. Focused audio completion (or a later completed linked reference replay) records pronunciation exposure; skipping blocked audio does not. These are teaching-opportunity records, never mastery or speech-quality evidence.

Only the missing relevant dimensions receive focus. An existing read/listen/recall/number task whose prerequisites are missing becomes an ungraded introduction on that occurrence, with no scheduled attempt. Independent writing requires prior guided-writing introduction; otherwise reuse the existing guided writing. Historical actual completed guided-writing evidence and completed C2.2 focus-plus-connection records have narrow compatibility bridges; arbitrary old display, Pinyin or completion logs do not become dimensional evidence. Thus some previously seen D material may receive one deliberate introduction after this upgrade; learner history is not erased.

Known-component reuse requires separately introduced whole canonical words in the same script. Do not infer standalone-character knowledge from having introduced an entire phrase. Reused components do not imply the new phrase's meaning or tones. Primary script matters for visual/writing evidence; no competency graph or separate Hanzi scheduler is introduced.

## Pilot correctness contract — assessment intent (2026-09-29)

Task kind plus target already distinguish listening/meaning, Hanzi recognition, written production, writing and tone perception. The legacy ID/kind `tone-recall` is **audio-based perception**, not lexical-tone recall. Its target remains `perception`.

The Tone Lab now declares its previously implicit conversion subtask:

```json
"notationPractice": { "intent": "tone_notation_conversion", "sourceWord": "ma2" }
```

This source is mandatory for `tones`, must be a canonical tone example, and is prohibited on other task kinds. The renderer derives visible Pinyin and expected numbered notation from the same word. The schema also rejects kind/assessment-target mismatches. No whole-task mastery target is attached to the introduction/practice bundle.

Retrieval must withhold its target information; transformation and recognition may show their necessary sources. Help that reveals a target must remain assisted evidence. Current renderer visibility is covered by focused tests; arbitrary prose remains editorial QA, not heuristic semantic validation. See [the 131-task audit and limits](ASSESSMENT_INTENT_AUDIT.md).

## v0.5 audio availability

Every `exploration.units[]` entry now requires an explicit `audio` decision:

- `{ "kind": "item", "item": "what" }`: reuse an existing learning item's normal reference; words and pronunciation must match the declared lexical/surface context.
- `{ "kind": "reference", "id": "detail-tingbudong", "src": "/audio/mandarin/polly-detail-tingbudong.mp3" }`: required normal detail audio. Repeated occurrences share the same ID/path; conflicting words, contextual syllables or paths are rejected.
- `{ "kind": "phrase", "reason": "…" }`: intentionally no isolated model. Explain why in German; the opened detail offers the explicitly labelled whole phrase instead. This is not a missing-asset fallback.

The old optional `audioItem` is replaced, with no change to unit boundaries or authored Pinyin. `content.detailAudio` is derived from reference-bearing units, deduplicated by media ID. Hanzi and lexical tones come from canonical words; spoken tones and synthesis Pinyin come from **the authored unit's syllables**. There is no spelling-to-pronunciation guess and no duplicate pronunciation field to maintain. These media references are not items, tasks, prerequisites or mastery objects.

`generate-audio.mjs --details-only` selects only these normal detail references. A dry run also accepts `--dry-run`. Existing request fingerprinting, provenance, technical checks and review states apply. No slow detail variants are generated. Production inventory, build filtering and validation include detail files. Validation rejects missing decisions, unknown items, conflicting reuse, absent manifest entries/files and mismatched contextual pronunciation.

Corrective text-production feedback uses the existing phrase normal/slow pair without autoplay, including `attention` results that count as success but require notation correction. Fully correct feedback gets no new phrase control. Reference replay emits `optional_reference_audio` with `optionalPractice: true`, context and variant; it never invokes reveal/assessment or the existing `audio_replay` path. Scheduling already excludes optional events.
