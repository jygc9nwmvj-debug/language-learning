# Example Variation & Transfer Policy v0.1

**Status:** evidence-informed; implementation DERIVED; exact thresholds HYPOTHESIS.

## EVIDENCE

- Retrieval practice supports later retention and transfer better than passive restudy in many learning contexts.
- Varied examples can support abstraction/generalization when learners have enough structure to notice what remains invariant.
- Excessive variability during initial acquisition can increase extraneous difficulty, especially when several dimensions change simultaneously.
- Worked examples and stronger guidance are particularly useful for novices; support can be reduced as expertise grows.
- In language learning, contextualized encounters are valuable, but contextual guessing alone is not a reliable substitute for explicit form-meaning learning.

## DERIVED principle

**Stability first, then productive variation.**

Do not make every encounter novel merely because the engine can.

Variation should answer:
`What should remain constant, and what useful dimension should change?`

---

## 1. First encounter

For a genuinely new item:
- use one clear canonical example;
- keep irrelevant context simple;
- establish intended sound/meaning/function;
- avoid multiple competing formulations.

Example:
`我叫 Wolfram。`

Do not immediately generate five stylistic variants.

---

## 2. Controlled variation

Once the basic relation is available, vary **one useful dimension at a time**.

Possible dimensions:
- speaker/name;
- noun slot;
- location;
- question/answer direction;
- voice;
- orthography presentation;
- presence/absence of Pinyin;
- listening vs reading input;
- formal vs neutral register only when relevant.

Example construction:
`我叫 + [Name]`

Keep construction stable, change the slot:
`我叫 Wolfram。`
`我叫 Anna。`

Then later change communicative direction:
`你叫什麼名字？`

---

## 3. Transfer variation

When a pattern is developing/stable:
- use new contexts;
- combine with older material;
- require learner-generated slot values;
- remove surface similarity where appropriate.

Goal:
prove the learner knows the relationship, not one memorized sentence.

---

## 4. Variation budget

Avoid changing many dimensions at once.

A prompt can vary:
- lexical content,
- speaker,
- modality,
- register,
- syntax,
- task demand,
- visual form.

**HYPOTHESIS:** early transfer tasks should normally vary one major dimension while others remain stable.

Later tasks may combine variation deliberately.

---

## 5. Dynamic generation

Runtime AI generation is **not required for V0.1**.

Preferred Foundation approach:
- authored/QA-approved example bank;
- parameterized constructions/slots;
- deterministic or bounded selection;
- engine selects examples based on known inventory and learning target.

Later local/cloud AI may generate candidate variation only if constrained by:
- known vocabulary;
- target construction;
- region/register;
- QA/safety rules.

Generated language must not silently become authoritative curriculum.

---

## 6. Known-language constraint

An example used to test one target should not accidentally introduce several unknown items.

The engine should estimate:
- known lexical coverage;
- known construction coverage;
- orthographic familiarity;
- listening familiarity.

Unknown context can be used intentionally for inference tasks, but must be marked as such.

---

## 7. Humor and variation

Humorous examples are a type of contextual variation.

Use them when:
- all essential language is known/useful;
- humor reinforces memory or attention;
- sentence remains natural.

Do not introduce obscure vocabulary just to make a joke.

---

## 8. Multiple speakers

Speaker variation is desirable after a stable initial model.

Progression:
1. one clear canonical voice;
2. second voice;
3. broader natural variation.

Do not begin a fragile new contrast with maximal speaker variability.

---

## 9. Lesson replay

Replay should be different **where difference creates retrieval/transfer**, not cosmetically random.

Good replay variation:
- less Pinyin;
- different name/slot;
- different speaker;
- audio-first instead of text-first;
- old target embedded in new known construction;
- weak relation emphasized.

Bad replay variation:
- random wording that adds unknown vocabulary;
- shuffled screens with identical cognitive task;
- different decorative image with no learning consequence.

---

## 10. Evidence recorded

When success occurs in a genuinely new context, mark it as stronger transfer evidence than repeating the identical prompt.

But do not equate one successful novel example with durable mastery.

---

## 11. V0.1 test

Compare:
- repeated canonical example;
- one controlled variant;
- delayed novel-context retrieval.

Observe whether variation improves flexible recall or merely creates confusion.

Exact variation timing remains a prototype hypothesis.
