# Content QA & Source Policy v0.1

**Status:** SET for prototype workflow; public-release thresholds may be tightened later.

## 1. Goal

The app must not teach plausible-sounding but incorrect Mandarin.

AI may draft, structure and cross-check content. It is not the final authority for public language material.

The QA system should be rigorous **without turning every beginner sentence into a research project**.

---

## 2. Four content classes

Every factual/linguistic note belongs to one of four classes.

### A. Language fact
Examples:
- character form
- Pinyin
- lexical tone
- basic meaning
- grammatical construction
- Traditional/Simplified mapping

Must be source-checkable.

### B. Usage / pragmatics
Examples:
- whether a phrase sounds natural
- where it is used
- Taiwan/Mainland differences
- politeness/register

Needs stronger contextual verification and, for public release, native/teacher review when material.

### C. Historical / etymological claim
Examples:
- original graph form
- semantic/phonetic component function
- historical meaning

Requires specialist/reference sources. Never infer etymology merely from modern visual appearance.

### D. Mnemonic / teaching device
Examples:
- visual memory story
- playful association
- invented hook

May be original, but must be labeled as mnemonic and never presented as historical fact.

---

## 3. Source hierarchy

Use the highest practical level for the claim.

### Tier 1 — authoritative / academic / institutional
Preferred for disputed or structural claims:
- Taiwan Ministry of Education language resources
- Academia Sinica / 小學堂 for historical character forms
- CUHK Multi-function Chinese Character Database
- NTNU Mandarin Training Center materials
- university Mandarin curricula / linguistic publications
- Unicode Unihan for machine-readable character metadata where appropriate

### Tier 2 — established open lexical datasets
Useful for automated cross-checking:
- CC-CEDICT
- Unicode data
- other clearly licensed, maintained lexical datasets

Do not assume a dataset alone settles pragmatics or etymology.

### Tier 3 — reputable secondary references
Useful for explanation/cross-check:
- specialist dictionaries
- Outlier Linguistics for character-function analysis
- Wiktionary as a cross-check, not sole authority for uncertain etymology

### Tier 4 — general web / community material
May surface leads but must not be the sole basis for published linguistic claims.

---

## 4. Minimum checks per lexical item

Before `source_checked`:

- Traditional form checked
- Simplified form checked
- Pinyin checked
- lexical tone(s) checked
- core meaning checked
- part of speech / function checked where relevant
- regional note added if materially different
- audio text exactly matches intended item/context

For multi-character phrases:
- natural phrase-level pronunciation checked
- tone sandhi / neutral tone behavior considered
- phrase meaning checked in context

---

## 5. Minimum checks per sentence

Before `source_checked`:

1. every word exists in the intended learner inventory or is intentionally introduced;
2. grammar is valid;
3. sentence is semantically coherent;
4. sentence serves the intended communicative function;
5. sentence is not merely a literal translation from German/English;
6. register is appropriate;
7. regional usage is noted if relevant;
8. Pinyin and script match the sentence exactly.

Before public `published`:
- native speaker / qualified Mandarin teacher reviews naturalness for learner-facing production examples.

---

## 6. Character notes

For each character note distinguish:

### Structure
What components are visibly/functionally present?

### Historical claim
What is known about earlier forms/origin?

### Pedagogical mnemonic
What helps remember it?

Never write:
`X means Y because the character contains A + B`
unless the historical/structural claim is actually supported.

Allowed:
`A useful way to remember it is ...`
when explicitly labeled mnemonic.

---

## 7. Proverbs, chengyu and literature

For each item store:
- original text
- source/work when known
- dating/attribution confidence if relevant
- literal gloss
- learner-facing translation written by us
- modern usage note if used as living language
- license/source status

Public-domain original texts do not automatically make modern translations/commentaries public domain.

Use literature as optional enrichment unless it directly supports the lesson objective.

---

## 8. Humor

Humorous example sentences must pass the same language QA as serious ones.

Additional checks:
- joke is understandable with learner's current inventory;
- sentence remains natural Mandarin;
- no culturally misleading implication;
- humor does not depend on a false etymology;
- tone-confusion jokes do not teach an incorrect pronunciation model.

Humor is allowed to be original.

---

## 9. Audio QA pipeline

Status:

`audio_needed -> generated/recorded -> technical_checked -> pronunciation_checked -> native_reviewed -> published`

### Technical check
- no clipping
- consistent loudness
- clean start/end
- correct file association
- works offline

### Pronunciation check
- exact intended words
- lexical tones
- tone sandhi
- neutral tones
- segmental pronunciation
- natural rhythm for style (`isolated`, `careful`, `natural`)

### Public release
At least one qualified native reviewer should approve final instructional audio.

For tone-discrimination reference material, require especially strict review.

---

## 10. Content lifecycle

### `draft`
AI/editor working material. May contain unresolved questions.

### `source_checked`
Core language facts verified against appropriate references.

### `language_reviewed`
Qualified native speaker / Mandarin teacher has reviewed learner-facing naturalness, pragmatics and explanations.

### `audio_reviewed`
Instructional audio approved.

### `published`
All required checks for that content type complete.

Prototype builds may use `source_checked` content with a visible internal-development flag.

---

## 11. Automated build checks

Deployment should fail if published content violates schema rules.

Examples:
- missing Traditional/Simplified field
- missing Pinyin
- invalid tone number
- missing referenced audio
- lesson references unknown item
- published etymology lacks source reference
- mnemonic stored in etymology field
- public sentence contains unknown/unapproved item unintentionally
- public audio lacks QA status

Automation catches consistency errors, not naturalness.

---

## 12. Review efficiency

Do not ask a human reviewer to rediscover basic data.

Reviewer receives a compact review sheet:

- Chinese text
- Pinyin
- translation
- intended context
- optional usage note
- audio
- flags/questions only where uncertain

Reviewer actions:
- approve
- edit
- regional note
- reject / unnatural
- pronunciation issue

This keeps human QA focused on what humans add most value to.

---

## 13. Versioning

Each published content item stores:
- content version
- last source-check date
- reviewer status
- source references
- audio version

If a correction is made:
- update item version;
- retain stable item ID so learner progress is not lost;
- invalidate review only for fields materially changed.

---

## 14. V0.1 Lesson 1 QA checklist

Before we use Lesson 1 as real learning material:

- verify all core forms and Pinyin;
- verify phrase-level pronunciation of 你好;
- verify explanation of third-tone behavior;
- verify name-question naturalness and regional neutrality/notes;
- verify 謝謝/谢谢 and 再見/再见 audio;
- verify `ma` tone demonstration items;
- verify 馬/马 historical note;
- verify 好 component explanation and ensure mnemonic is labeled;
- verify Laozi quotation/source if retained;
- replace technical placeholder audio with reviewed Mandarin audio before treating prototype as instructionally authoritative.

---

## 15. Rule of uncertainty

When reliable sources disagree or the history/usage is uncertain:

**Say that it is uncertain.**

Do not select the most memorable explanation merely because it teaches well.

Pedagogical clarity never requires pretending uncertainty does not exist.
