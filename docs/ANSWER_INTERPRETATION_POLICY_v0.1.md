# Answer Interpretation Policy v0.1

**Status:** BUILD SPEC / exact tolerance thresholds HYPOTHESIS

## Core rule

**Evaluate an answer against the learning relation the task is intended to measure, not against exact string equality.**

A learner response can contain evidence of several distinct skills. The engine should preserve that information instead of collapsing the response into `correct / wrong`.

---

## 1. Separate dimensions

For typed Mandarin/Pinyin responses, distinguish where relevant:

- intended lexical item / meaning;
- syllable identity;
- Pinyin orthography;
- tone notation;
- grammatical/construction completeness;
- script/orthography;
- pronunciation — only from audio, not inferred from missing tone marks.

Example target:
`wǒ jiào Wolfram`

Possible response:
`wo jiao Wolfram`

Interpretation:
- lexical content: correct;
- construction: correct;
- Pinyin base syllables: correct;
- tone notation: omitted;
- spoken tone ability: unknown.

Do **not** mark the entire response wrong.

---

## 2. Task-sensitive grading

The same response may be treated differently depending on task objective.

### Task: produce the meaning/content
`wo jiao Wolfram`
→ accept content; show canonical Pinyin.

### Task: practice Pinyin tone notation
`wo jiao Wolfram`
→ content correct, tone notation incomplete; prompt learner to add tones.

### Task: speaking/pronunciation
Typed Pinyin provides no valid evidence of actual tone production.
→ use microphone/audio evidence.

---

## 3. Pinyin normalization

The interpreter may recognize equivalent/near-equivalent input forms such as:
- tone marks: `wǒ`
- tone numbers: `wo3`
- no tone notation: `wo`

But these are not identical evidence.

Store which form was supplied.

Normalize:
- case;
- harmless whitespace;
- common punctuation differences;
- standard `ü` input conventions where appropriate;
- tone-number vs diacritic representation.

Do not silently erase meaningful distinctions.

---

## 4. Typo tolerance

Use conservative typo/phonological matching to identify likely intended targets.

Possible result:
`likely intended jiào`

If confidence is high:
- preserve credit for clearly demonstrated content;
- show correct form;
- record orthographic uncertainty if relevant.

If confidence is medium:
- ask/offer:
  `Did you mean jiào?`

If confidence is low:
- do not guess.

Never use fuzzy matching so aggressively that a genuinely different Mandarin syllable/word is accepted as a typo.

---

## 5. Interpretation result

Suggested generic shape:

```ts
type AnswerInterpretation = {
  targetId: string;
  intentConfidence: number;
  matchedContent?: boolean;
  evidence: Array<{
    skill: string;
    result: "success" | "partial" | "failure" | "unknown";
    confidence: number;
    note?: string;
  }>;
  normalizedInput?: string;
  likelyIntendedForm?: string;
  needsClarification?: boolean;
};
```

The Learning Engine consumes the evidence array rather than a single boolean.

---

## 6. Feedback

Feedback should say what was right and what needs work.

Good:
`You remembered the sentence. In Pinyin, write wǒ jiào — the tone marks are missing.`

Good:
`You remembered wǒ, but jiào is missing.`

Avoid:
`Wrong.`

Avoid silently changing an answer without telling the learner what was interpreted.

---

## 7. Progressive strictness

Tolerance changes with learning objective and stage.

Early:
- accept recognizable content with missing tone marks;
- model canonical form.

Later:
- if Pinyin notation itself is the target, require it more precisely.

The system becomes stricter because the target changed, not because the learner is arbitrarily being punished.

---

## 8. Speech vs text

Never infer spoken pronunciation competence from typed Pinyin.

Examples:
- missing tone mark ≠ spoken tone failure;
- correct tone mark ≠ proof of correct pronunciation.

Speech evidence comes from audio tasks.

---

## 9. Script input

When a task measures character recognition/production, Pinyin may be:
- partial evidence of lexical recall;
- but not evidence of grapheme production.

Example:
prompt: `write 你`
response: `ni`
→ lexical/sound recall may be present;
→ written-form production remains unproven.

---

## 10. V0.1 implementation

Start deterministic:
- normalization;
- target-specific accepted forms;
- conservative edit distance;
- Pinyin parser;
- construction slot matching;
- explicit confidence rules.

Do not require an LLM to grade beginner answers.

Later AI may help interpret freer language, but should output structured evidence and confidence rather than overwrite deterministic checks.

---

## 11. HYPOTHESES to test

- edit-distance thresholds;
- phonological similarity thresholds;
- when to auto-assume vs ask clarification;
- how much partial-credit feedback learners find useful;
- when increasing Pinyin strictness becomes helpful rather than annoying.
