# Core / Language-Pack Boundary Audit v0.1

**Status:** PASS WITH TWO REQUIRED REFACTOR RULES

## Rule 1 — Orthography is generic
Core may support orthographic variants but must not name them Traditional/Simplified.

Core:
`orthographies: Record<orthographyId, string>`

Mandarin:
- `hant` → Traditional
- `hans` → Simplified

## Rule 2 — Pronunciation analysis is generic
Core may know audio samples, F0/pitch contours, timing, confidence and generic comparison results.
Core must not know Mandarin tone numbers, sandhi or Pinyin.

Mandarin interprets generic acoustic evidence in Mandarin terms.

## Core owns
session orchestration; exercise registry; generic skill dimensions; progress evidence; review scheduling; scaffold levels; audio capture/playback; generic pitch extraction; drawing/stroke capture; worksheet primitives; offline cache; persistence; accessibility; UI localization.

## Mandarin owns
lexicon; Pinyin; lexical/surface tone metadata; tone sets and interpretation; Hanzi; `hant`/`hans`; components; stroke-order content; grammar/usage; regional notes; etymology/discoveries; Mandarin worksheet choices.

## Generic item shape
```ts
type LearningItem = {
  id: string;
  languageId: string;
  kind: string;
  meanings: LocalizedMeaning[];
  orthographies?: Record<string, string>;
  audio?: AudioVariant[];
  skillTargets: SkillDimension[];
  languageData?: unknown;
};
```

## Mandarin extension
```ts
type MandarinData = {
  pinyin?: string;
  syllables?: {
    pinyinBase: string;
    lexicalTone: 1|2|3|4|5;
    surfaceToneHint?: 1|2|3|4|5;
  }[];
  components?: CharacterComponent[];
  strokeAssetId?: string;
  regionNotes?: Record<string,string>;
};
```

## V0.1 guard
Inspect generic core code if it contains:
`pinyin`, `hanzi`, `tone3`, `traditional`, `simplified`, `radical`, `sandhi`.
