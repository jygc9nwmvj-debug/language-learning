# Learning Object Model v0.1

**Status:** BUILD SPEC

## Principle

The engine must not treat every learnable thing as a vocabulary card.

Language learning contains different object classes with different mastery relations.

## Core object classes

### 1. Lexical item
A word or bound lexical unit.

Examples:
- 我
- 你
- 好
- 名字

Possible targets:
meaning, listening, speaking, reading, writing, usage.

Not every lexical item activates every target.

### 2. Communicative phrase
A conventional chunk whose communicative function matters as much as its compositional meaning.

Examples:
- 你好
- 謝謝 / 谢谢
- 再見 / 再见

Targets:
listening, speaking, functional meaning, reading; writing optional.

### 3. Construction / grammatical pattern
A productive relationship reused with variable slots.

Example:
`我叫 + [Name]`

Targets:
comprehension, guided production, free production, transfer to new slot values.

A construction is not “mastered” merely because one fixed sentence was memorized.

### 4. Pronunciation pattern
A reusable phonological/perceptual phenomenon.

Examples:
- lexical tone 3
- third-tone sandhi
- a difficult initial/final contrast

Targets:
perception, discrimination, production, use in connected speech.

Progress belongs to the pattern across multiple lexical items.

### 5. Orthographic form / grapheme
The visual written form of a lexical item or character.

Example:
`好` in `hant` / `hans`

Targets:
recognition, component awareness, free-form recall.

Reading/writing progress may differ by orthography.

### 6. Orthographic / motor principle
A reusable writing-system principle.

Examples:
- top before bottom
- left before right
- enclosure sequencing
- a recurring component form

Targets:
recognition/application across multiple characters.

Do not teach as isolated theory when it can be introduced just in time.

### 7. Character component
A recurring structural unit with possible semantic, phonetic or purely graphic function.

Targets:
recognition, structural role, use in character analysis.

Do not assume every modern component is an etymological clue.

### 8. Cultural / discovery item
Optional enrichment.

Examples:
- historical form of 馬
- Chengyu
- poem line
- cultural/pragmatic note

Usually no mastery requirement unless promoted into curriculum later.

---

## Relations

Objects can reference one another.

Example:

`phrase:nihao`
- contains lexical/orthographic references to `你`, `好`
- uses pronunciation patterns for tone 3 / sandhi
- has communicative function `greeting`

`construction:wo-jiao-name`
- references `我`, `叫`
- slot: `name`
- can generate multiple utterances without creating separate mastery objects for every name.

`grapheme:hao`
- realizes lexical item `好`
- contains component references
- uses motor principles
- can have orthography-specific assets.

---

## Skill targets

Each object declares only relevant targets.

Example:

```ts
type SkillTarget =
  | "meaning"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "usage"
  | "perception"
  | "production"
  | "structure"
  | "application";
```

The exact vocabulary may be refined, but the important rule is:

**The engine never assumes every object should be heard, spoken, read and written.**

---

## Mastery evidence

Evidence belongs to `(objectId, target)`.

Examples:
- `(lexeme:hao, listening)`
- `(grapheme:hao:hant, writing)`
- `(tone:3, perception)`
- `(construction:wo-jiao-name, production)`
- `(motor:left-before-right, application)`

This prevents a single global “word mastery” value.

---

## Lesson 1 mapping

### 你好
Type: communicative phrase  
Targets: functional meaning, listening, speaking, reading.

### 我
Type: lexical item + orthographic form  
Lexical targets: meaning/listening/speaking/usage.  
Orthographic targets: reading; guided writing only initially.

### 你
Same pattern as 我.

### 好
Lexical + orthographic.  
Orthographic form is first active recall-writing target.

### 我叫 + [Name]
Type: construction.  
Targets: comprehension → guided production → free production.

### 你叫什麼名字？
Initially a communicative question chunk with partial lexical decomposition.  
Do not require independent mastery of every internal item immediately.

### Tone 3
Type: pronunciation pattern.  
Lesson 1 only begins perception/awareness; production stability grows across later words.

### Tone-3 sandhi
Type: pronunciation pattern.  
Initially experienced through natural 你好 audio; explicit mastery is deferred.

### 馬 historical form
Type: discovery item.  
No mastery state.

---

## Session composition implication

The engine composes sessions from **needed target relations**, not from a queue of “words”.

A session might therefore contain:
- one new phrase;
- one due grapheme-writing relation;
- one pronunciation-pattern discrimination;
- one old construction in a new slot/context;
- one optional discovery.

This is the intended basis for multimodal interleaving.
