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

## 9. Implemented Mandarin phrase authoring contract (C2.3, 2026-09-28)

This section describes the current executable schema (`src/languages/mandarin/schema/content.ts`), rather than the conceptual entity sketches above. Follow `LEARNING_ARCHITECTURE.md` for assessment and scaffolding.

Every **new multi-character item** must include authored `exploration` metadata. Nothing is segmented or translated by runtime NLP. Example for the existing `speak-slowly` item:

```json
{
  "pronunciation": "surface",
  "units": [
    { "words": ["qing"], "syllables": ["qing3"], "gloss": "bitte", "audioItem": "qing" },
    { "words": ["shuo"], "syllables": ["shuo1"], "gloss": "sprechen / sagen" },
    { "words": ["man"], "syllables": ["man4"], "gloss": "langsam" },
    { "words": ["yidian"], "syllables": ["yi4", "dian3"], "gloss": "ein bisschen / etwas" }
  ]
}
```

- Each UI unit groups one or more **existing canonical word IDs**. Flattening all unit references must equal `item.words` exactly, in order. A meaningful unit can contain multiple Hanzi; neither characters nor legacy canonical word boundaries necessarily equal the desired explanation unit.
- Forms come only from those canonical references in the session's `hant`/`hans` script. Each Hanzi has one authored syllable in this deliberately restricted content model. Neutral tone uses `5`, rendered without an accent; punctuation is outside the syllable mapping. Unsupported forms require an explicit future schema change, not guessing.
- `pronunciation: lexical` must match canonical word tones; `surface` must match the item's existing explicit `surfaceToneNumbers`. Syllable bases/counts must match either way. Surface display does not change canonical truth or unlock tone assessment.
- A `gloss` describes this unit **in context**. Optional `characters: [{index, note}]` explains selected characters' roles without mechanically summing literal meanings. Index is zero-based within the resolved unit; duplicate/out-of-range indices fail validation.
- Optional `audioItem` references an existing item with exactly the same canonical word sequence. Reuse its production natural audio. No new paths, slicing, inference or synthesis. Absence simply means no unit audio control.
- `learning.note` and `learning.discovery` accept plain prose without Hanzi, or an array of prose and `{word, gloss}` references. Example: `[{"word":"qing","gloss":"bitte"}," macht die Aufforderung höflicher."]`. Rendering supplies primary-script Hanzi + canonical Pinyin + gloss. Raw Hanzi in these prose fields or exploration notes/glosses are rejected; referenced words must exist. Preserve authored spaces around reference tokens.
- Script-pair, mapping, coverage, reference and production-audio checks run at build time. They prove structural integrity, not linguistic correctness of editorial segmentation/glosses; content review still owns semantics.

`legacy-unsegmented.json` explicitly grandfathers 15 existing items. Do not add new content to this allowlist as a normal authoring shortcut. Remove an ID when its metadata is authored. Existing unmigrated items retain their prior plain display; they do not acquire inferred glosses. See the C2.3 report for the exact migrated and pending sets.
